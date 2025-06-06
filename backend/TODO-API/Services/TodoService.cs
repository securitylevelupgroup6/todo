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
                UpdatedState = todo.TodoState
            };

            await todoRepository.CreateTodoHistoryAsync(todoHistoryRequest);

            return todo;
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while creating the todo.", ex);
        }
    }

    internal async Task<Todo> UpdateTodoAsync(UpdateTodoRequest request)
    {
        try
        {
            var todo = await dbContext.Todos.FindAsync(request.TodoId);

            if (todo == null)
            {
                throw new ArgumentException("Todo not found.", nameof(request.TodoId));
            }

            var teamId = request.TeamId != null ? request.TeamId : todo.TodoState.Team.Id;

            var reporter = await dbContext.TeamMembers.FirstAsync(teamMember => teamMember.User.Id == request.ReporterId
                                                               && teamMember.Team.Id == teamId);

            var team = teamId != null ? await dbContext.Teams.FindAsync(teamId) : todo.TodoState.Team;

            if (team == null)
            {
                throw new ArgumentException("Team not found.", nameof(request.TeamId));
            }

            var updatedTodoState = new TodoState
            {
                Title = request.Title != null ? request.Title : todo.TodoState.Title,
                Description = request.Description != null ? request.Description : todo.TodoState.Description,
                Status = new TodoStatus { StatusName = request.Status != null ? request.Status : todo.TodoState.Status.StatusName },
                Assignee = request.AssigneeId != null ? await dbContext.TeamMembers.FirstOrDefaultAsync(teamMember => teamMember.Team.Id == teamId
                                                               && teamMember.User.Id == request.AssigneeId.Value) : null,
                Team = team
            };

            await todoRepository.UpdateTodoStateAsync(todo, updatedTodoState);

            var todoHistoryRequest = new CreateTodoHistoryRequest
            {
                Todo = todo,
                Date = DateTime.UtcNow,
                Reporter = reporter,
                OldState = todo.TodoState,
                UpdatedState = updatedTodoState
            };

            await todoRepository.CreateTodoHistoryAsync(todoHistoryRequest);

            return todo;
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while creating the todo.", ex);
        }
    }
}
