using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.Json;
using TODO_API.Models;
using TODO_API.Models.Requests;
using TODO_API.Repositories;

namespace TODO_API.Services;

public class TodoService(TodoContext dbContext, TodoRepository todoRepository)
{
    public async Task<Todo> CreateTodoAsync(CreateTodoRequest request)
    {
        try
        {
            var todo = await todoRepository.CreateTodoAsync(request);

            var todoHistoryRequest = new CreateTodoHistoryRequest
            {
                Todo = todo,
                Date = DateTime.UtcNow,
                Reporter = todo.Owner,
                TeamId = request.TeamId,
                UpdatedState = todo.TodoState,
                OldState = todo.TodoState
            };

            await todoRepository.CreateTodoHistoryAsync(todoHistoryRequest);

            return todo;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            throw new Exception("An error occurred while creating the todo.", ex);
        }
    }

    public bool validateUserForCreation(string jwt, int OwnerId)
    {
        var handler = new JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(jwt);
        // get the user from the jwt
        var user = dbContext.Users.Include(u => u.RefreshTokens).FirstOrDefault(u => u.Id.ToString() == jwtToken.Subject.ToString()) ?? throw new UserNotFoundException();
        var roles = jwtToken.Claims
        .Where(c => c.Type == ClaimTypes.Role)
        .Select(c => c.Value)
        .ToList();
        Console.WriteLine(JsonSerializer.Serialize(roles));
        if (roles.Any(role => role == "TEAM_LEAD")) return true;

        // return whether or not the users id matched the proposed owner id
        return user.Id == OwnerId;
    }

    public async Task<List<Todo>> GetUserTodosAsync(string jwt)
    {
        var handler = new JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(jwt);
        // get the user from the jwt
        var user = dbContext.Users.Include(u => u.RefreshTokens).FirstOrDefault(u => u.Id.ToString() == jwtToken.Subject.ToString()) ?? throw new UserNotFoundException();

        return
         [.. dbContext.Todos
         .Include(todo => todo.TodoState)
            .ThenInclude(ts => ts.Assignee)
                .ThenInclude(assignee => assignee.User)
        .Include(todo => todo.TodoState)
            .ThenInclude(ts => ts.Team)
        .Include(todo=>todo.TodoState)
            .ThenInclude(ts =>ts.Status)
        .Include(todo => todo.Owner)
            .ThenInclude(owner=>owner.User)
         .Where( todo => todo != null && todo.TodoState != null && todo.TodoState.Assignee != null && todo.TodoState.Assignee.User.Id == user.Id)];
    }

    internal async Task<Todo> UpdateTodoAsync(string jwt, UpdateTodoRequest request)
    {
        try
        {
            var todo = dbContext.Todos
            .Include(todo => todo.Owner)
            .ThenInclude(owner => owner.User)
            .Include(todo => todo.TodoState)
            .ThenInclude(ts => ts.Assignee)
            .ThenInclude((assignee) => assignee.User) // this is NOT a null reference exception waiting to happen because EF will skip the ThenInclude in the case that assignee is null
            .Include(todo => todo.TodoState)
            .ThenInclude(ts => ts.Status)
            .FirstOrDefault((todo) => todo.Id == request.TodoId) ?? throw new ArgumentException("Todo not found.", nameof(request.TodoId));

            if (!ValidateUserForTodoUpdates(jwt, todo.Id)) throw new UnauthorizedAccessException("User does not have permission to update this todo.");

            var currentState = todo.TodoState;
            var currentStateCopy = JsonSerializer.Deserialize<TodoState>(JsonSerializer.Serialize(currentState));

            currentState.Description = request.Description ?? currentState.Description;
            currentState.Title = request.Title ?? currentState.Title;

            currentState.StatusId = dbContext.TodoStatuses.FirstOrDefault((status) => status.StatusName == request.Status)?.Id ?? currentState.StatusId;
            Console.WriteLine(currentState.StatusId);
            currentState.AssigneeId = request.AssigneeId ?? currentState.AssigneeId;
            currentState.TeamId = request.TeamId ?? currentState.TeamId;

            todo.TodoState = currentState;
            await dbContext.SaveChangesAsync();

            var todoHistoryRequest = new CreateTodoHistoryRequest
            {
                Todo = todo,
                Date = DateTime.UtcNow,
                Reporter = dbContext.TeamMembers.FirstOrDefault((tm) => tm.Id == currentState.AssigneeId && tm.TeamId == currentState.TeamId) ?? throw new Exception("No Team member found for the new state"),
                OldState = currentStateCopy,
                UpdatedState = currentState
            };

            await todoRepository.CreateTodoHistoryAsync(todoHistoryRequest);

            return todo;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            throw new Exception("An error occurred while updating the todo.", ex);
        }
    }

    internal async Task<IEnumerable<Todo>> GetTeamTodosAsync(int teamId)
    {
        var todos = await dbContext.Todos
            .Include(todo => todo.TodoState)
                .ThenInclude(todoState => todoState.Team)
            .Include(todo => todo.TodoState)
                .ThenInclude(ts => ts.Status)
            .Include(todo => todo.Owner)
                .ThenInclude(owner => owner.User)
            .Include(todo => todo.TodoState)
                .ThenInclude(ts => ts.Assignee)
                    .ThenInclude(assignee => assignee.User)
            .Where(todo => todo != null && todo.TodoState != null && todo.TodoState.Team.Id == teamId)
            .ToListAsync();

        return todos;
    }

    public bool ValidateUserForTodoUpdates(string jwt, int todoId)
    {
        var handler = new JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(jwt);
        // get the user from the jwt
        var user = dbContext.Users.Include(u => u.RefreshTokens).FirstOrDefault(u => u.Id.ToString() == jwtToken.Subject.ToString()) ?? throw new UserNotFoundException();
        var userTeams = dbContext.TeamMembers
            .Include(teamMember => teamMember.Team)
            .Where(teamMember => teamMember.User.Id == user.Id)
            .Select(teamMember => teamMember.Team)
            .ToList();
        var todo = dbContext.Todos
            .Include(todo => todo.TodoState)
                .ThenInclude(ts => ts.Assignee)
                    .ThenInclude(assignee => assignee.User)
            .Include(todo => todo.TodoState)
                .ThenInclude(ts => ts.Team)
            .FirstOrDefault(todo => todo.Id == todoId) ?? throw new ArgumentException("Todo not found.", nameof(todoId));

        var roles = jwtToken.Claims
        .Where(c => c.Type == ClaimTypes.Role)
        .Select(c => c.Value)
        .ToList();

        if (roles.Any(role => role == "TEAM_LEAD")) return true;

        if (userTeams.Any(team => team.Id == todo.TodoState.Team.Id)) return true;

        return false;


    }

    internal async Task DeleteTodoAsync(string jwt, int todoId)
    {
        var todo = dbContext.Todos
            .Include(todo => todo.TodoState)
                .ThenInclude(ts => ts.Assignee)
                    .ThenInclude(assignee => assignee.User)
            .Include(todo => todo.TodoState)
                .ThenInclude(ts => ts.Team)
            .FirstOrDefault(todo => todo.Id == todoId) ?? throw new ArgumentException("Todo not found.", nameof(todoId));

        if (!ValidateUserForTodoUpdates(jwt, todoId)) throw new UnauthorizedAccessException("User does not have permission to delete this todo.");

        dbContext.Todos.Remove(todo);
        await dbContext.SaveChangesAsync();
    }

    internal async Task<IEnumerable<TodoHistory>> GetTodoHistoryAsync(int todoId)
    {
        var history = await dbContext.TodoHistory
            .Include(todoHistory => todoHistory.Todo)
            .Include(todoHistory => todoHistory.Reporter)
                .ThenInclude(tm => tm.User)
            .Include(todoHistory => todoHistory.OldState)
                .ThenInclude(os => os.Status)
            .Include(todoHistory => todoHistory.UpdatedState)
                .ThenInclude(us => us.Status)
            .Where(todoHistory => todoHistory.Todo.Id == todoId)
            .ToListAsync();

        return history;
    }

    internal async Task<Todo> GetTodoByIdAsync(int todoId)
    {
        return await dbContext.Todos
            .Include(todo => todo.TodoState)
                .ThenInclude(ts => ts.Assignee)
                    .ThenInclude(assignee => assignee.User)
            .Include(todo => todo.TodoState)
                .ThenInclude(ts => ts.Team)
            .Include(todo => todo.TodoState)
                .ThenInclude(ts => ts.Status)
            .Include(todo => todo.Owner)
                .ThenInclude(owner => owner.User)
            .FirstOrDefaultAsync(todo => todo.Id == todoId) ?? throw new ArgumentException("Todo not found.", nameof(todoId));
    }
}
