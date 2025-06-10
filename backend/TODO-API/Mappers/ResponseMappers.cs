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
            Username = user.Username,
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

    public static TodoHistoryResponse MapToTodoHistoryResponse(this IEnumerable<TodoHistory> todoHistories, Todo todo)
    {
        var response = new TodoHistoryResponse
        {
            Todo = todo.MapToTodoResponse(),
            History = new List<string>()
        };

        foreach (var history in todoHistories.OrderBy(h => h.Date))
        {
            var changes = new List<string>();
            var oldState = history.OldState;
            var newState = history.UpdatedState;

            if (oldState != null && oldState.Status?.StatusName != newState.Status?.StatusName)
            {
                changes.Add($"state from '{oldState.Status?.StatusName}' to '{newState.Status?.StatusName}'");
            }

            if (oldState != null && oldState.Title != newState.Title)
            {
                changes.Add($"title from '{oldState.Title}' to '{newState.Title}'");
            }

            if (oldState != null && oldState.Description != newState.Description)
            {
                changes.Add($"description from '{oldState.Description}' to '{newState.Description}'");
            }

            var oldAssignee = oldState?.Assignee?.User;
            var newAssignee = newState.Assignee?.User;
            if (oldAssignee?.Id != newAssignee?.Id)
            {
                var oldAssigneeName = oldAssignee != null ? $"{oldAssignee.FirstName} {oldAssignee.LastName}" : "none";
                var newAssigneeName = newAssignee != null ? $"{newAssignee.FirstName} {newAssignee.LastName}" : "none";
                changes.Add($"assignee from '{oldAssigneeName}' to '{newAssigneeName}'");
            }

            if (changes.Count > 0)
            {
                var username = history.Reporter?.User?.FirstName + ' ' + history.Reporter?.User?.LastName ?? "Unknown";
                var changeString = $"{username} changed the {string.Join(", ", changes)} on {history.Date:yyyy-MM-dd HH:mm}";
                response.History.Add(changeString);
            }
        }

        return response;
    }
}
