using System.IdentityModel.Tokens.Jwt;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
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
            throw new Exception("An error occurred while creating the todo.", ex);
        }
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

    internal async Task<Todo> UpdateTodoAsync(UpdateTodoRequest request)
    {
        try
        {
            var todo = dbContext.Todos
            .Include(todo => todo.Owner)
            .ThenInclude(owner => owner.User)
            .Include(todo => todo.TodoState)
            .ThenInclude(ts => ts.Assignee)
            .ThenInclude((assignee) => assignee.User) // this is NOT a null reference exception waiting to happen because EF will skip the ThenInclude in the case that assignee is null
            .FirstOrDefault((todo) => todo.Id == request.TodoId) ?? throw new ArgumentException("Todo not found.", nameof(request.TodoId));

            var currentState = todo.TodoState;
            var currentStateCopy = JsonSerializer.Deserialize<TodoState>(JsonSerializer.Serialize(currentState));

            currentState.Description = request.Description ?? currentState.Description;
            currentState.Title = request.Title ?? currentState.Title;

            currentState.StatusId = dbContext.TodoStatuses.FirstOrDefault((status) => status.StatusName == request.Status)?.Id ?? currentState.StatusId;
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
            throw new Exception("An error occurred while creating the todo.", ex);
        }
    }



}
