using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TODO_API.Models;
using TODO_API.Models.Requests;

namespace TODO_API.Repositories;

public class TodoRepository([FromServices] TodoContext context)
{
    public async Task<Todo> CreateTodoAsync(CreateTodoRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        try
        {
            var ownerMember = await context.TeamMembers.FirstAsync(member => member.User.Id == request.OwnerUserId &&
                                                                    member.Team.Id == request.TeamId);

            if (ownerMember is null)
            {
                throw new ArgumentException("User not found.", nameof(request.OwnerUserId));
            }

            var createdStatus = context.TodoStatuses.FirstOrDefault(status => status.StatusName == "CREATED") ?? new TodoStatus{StatusName="CREATED"};

            //TODO: Need to initalize db with states
            var todoState = new TodoState
            {
                Title = request.Title,
                Description = request.Description,
                Status = createdStatus,
                AssigneeId = ownerMember.Id,
                TeamId = request.TeamId
            };


            await context.TodoStates.AddAsync(todoState);

            var todo = new Todo
            {
                Owner = ownerMember,
                TodoState = todoState
            };

            await context.Todos.AddAsync(todo);

            await context.SaveChangesAsync();

            return await context.Todos
            .Include(t => t.Owner)
            .Include(t => t.TodoState)
                .ThenInclude(ts => ts.Assignee)
                    .ThenInclude(a => a.User)
            .Include(t => t.TodoState)
                .ThenInclude(ts => ts.Team)
                .ThenInclude(team => team.TeamLead)
            .FirstOrDefaultAsync(t => t.Id == todo.Id) ?? throw new Exception("User was not created");
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while creating the team.", ex);
        }
    }

    internal async Task<TodoHistory> CreateTodoHistoryAsync(CreateTodoHistoryRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);
        ArgumentNullException.ThrowIfNull(request.OldState);
        try
        {
            var todoHistory = new TodoHistory
            {
                Todo = request.Todo,
                Date = request.Date,
                Reporter = request.Reporter,
                OldStateId = request.OldState.Id,
                UpdatedState = request.UpdatedState
            };

            await context.TodoHistory.AddAsync(todoHistory);
            await context.SaveChangesAsync();

            return todoHistory;
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while creating the team.", ex);
        }
    }

    internal async Task UpdateTodoStateAsync(Todo todo, TodoState updatedTodoState)
    {
        try
        {
            todo.TodoState = updatedTodoState;
            context.Todos.Update(todo);
            await context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while updating the todo state.", ex);
        }
    }
}
