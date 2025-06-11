using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TODO_API.Common;
using TODO_API.Models.Requests;
using TODO_API.Services;

namespace TODO_API.Endpoints;

public static class UserEndpoints
{
    public static IEndpointRouteBuilder AddUserEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("/api/users/{username}/role", AddRoleHandler)
        .WithName("Assign Roles")
        .WithTags("Assign Roles to User");

        endpoints.MapGet("/api/users/roles", GetUserRoles)
        .WithName("Get User Roles")
        .WithTags("Get User's Roles");

        endpoints.MapGet("/api/users/teams", GetUserTeamsHandler)
        .WithName("Get Teams")
        .WithTags("Get a user's teams");

        return endpoints;
    }

    // TODO: Things like role names need to be in a constants file
    [Authorize(Roles = "ADMIN")]
    public static IResult AddRoleHandler(string username, [FromBody] AssignRolesRequest request, UserService userService)
    {
        if (request == null || request.RoleIds.Count == 0)
            return Results.BadRequest("Role ids are required.");

        try
        {
            userService.AddRoles(username, request.RoleIds);
        }
        catch (UserNotFoundException)
        {
            return Results.NotFound("The user could not be found.");
        }

        return Results.Created();
    }

    [Authorize(Roles = Roles.USER)]
    public static IResult GetUserRoles(HttpContext http, UserService userService)
    {
        var jwt = http.Request.Cookies["access_token"];

        if (string.IsNullOrEmpty(jwt))
            return Results.BadRequest("JWT token is required.");

        try
        {
            return Results.Ok(new { Roles = userService.GetRoles(jwt) });
        }
        catch (UserNotFoundException)
        {
            return Results.BadRequest("User in jwt could not be found");
        }
        catch (Exception)
        {
            return Results.InternalServerError();
        }
    }

    private static async Task<IResult> GetUserTeamsHandler(HttpContext http, UserService userService)
    {
        var jwt = http.Request.Cookies["access_token"];

        if (string.IsNullOrEmpty(jwt))
            return Results.BadRequest("JWT token is required.");

        try
        {
            var teams = await userService.GetUserTeamsAsync(jwt);
            return Results.Ok(new { Teams = teams });
        }
        catch (UserNotFoundException)
        {
            return Results.BadRequest("User in jwt could not be found");
        }
        catch (Exception)
        {
            return Results.InternalServerError();
        }
    }
}