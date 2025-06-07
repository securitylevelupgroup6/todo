using TODO_API.Models;
using TODO_API.Models.Responses;

namespace TODO_API.Mappers;

public static class ResponseMappers
{
    public static UserResponse MapToUserResponse(this User user)
    {
        if (user == null)
        {
            throw new ArgumentNullException(nameof(user), "No user provided for mapping.");
        }

        return new UserResponse
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Username = user.Username
        };
    }

    public static TodoResponse MapToTodoResponse(this Todo todo)
    {
        if (todo == null)
        {
            throw new ArgumentNullException(nameof(todo), "No todo provided for mapping.");
        }

        return new TodoResponse
        {
            Id = todo.Id,
            Title = todo.TodoState.Title,
            Description = todo.TodoState.Description,
            Status = todo.TodoState.Status.StatusName,
            Owner = todo.Owner.User.MapToUserResponse(),
            Assignee = todo.TodoState.Assignee?.User.MapToUserResponse(),
        };
    }
}
