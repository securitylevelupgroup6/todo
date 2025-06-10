using Ganss.Xss;
using TODO_API.Models;
using TODO_API.Models.Requests;

namespace TODO_API.Utilities;

public static class Sanitizers
{
    public static readonly HtmlSanitizer Sanitizer = new HtmlSanitizer();

    public static CreateTodoRequest Sanitize(this CreateTodoRequest request)
    {
        if (request == null)
            return null;

        request.Title = Sanitizer.Sanitize(request.Title);
        request.Description = Sanitizer.Sanitize(request.Description);

        return request;
    }

    public static UpdateTodoRequest Sanitize(this UpdateTodoRequest request)
    {
        if (request == null)
            return null;

        request.Title = request.Title != null ? Sanitizer.Sanitize(request.Title) : null;
        request.Description = request.Description != null ? Sanitizer.Sanitize(request.Description) : null;
        request.Description = request.Status != null ? Sanitizer.Sanitize(request.Status) : null;

        return request;
    }

    public static CreateTeamRequest Sanitize(this CreateTeamRequest request)
    {
        if (request == null)
            return null;

        request.Name = Sanitizer.Sanitize(request.Name);

        return request;
    }

    public static RegisterUserRequest Sanitize(this RegisterUserRequest request)
    {
        if (request == null)
            return null;

        request.Username = Sanitizer.Sanitize(request.Username);
        request.FirstName = Sanitizer.Sanitize(request.FirstName);
        request.LastName = Sanitizer.Sanitize(request.LastName);

        return request;
    }

    public static AddTeamMemberRequest Sanitize(this AddTeamMemberRequest request)
    {
        if (request == null)
            return null;

        request.Username = request.Username != null ? Sanitizer.Sanitize(request.Username) : null;

        return request;
    }
}
