using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TODO_API.Models;
using TODO_API.Models.Requests;
using TODO_API.Services;

namespace TODO_API.Endpoints;

public static class UserEndpoints
{
    public static IEndpointRouteBuilder AddUserEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("/users/{username}/role", AddRoleHandler)
        .WithName("Assign Role")
        .WithTags("Assign Roles to User");

        endpoints.MapPost("/user", CreateUserHandler)
        .Accepts<CreateUserRequest>("application/json")
        .Produces<User>(StatusCodes.Status201Created)
        .Produces(StatusCodes.Status400BadRequest)
        .WithName("CreateUser")
        .WithTags("Users");

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

    public async static Task<IResult> CreateUserHandler(
        [FromServices] UserService userService,
        [FromBody] CreateUserRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        try
        {
            var user = await userService.CreateUserAsync(request);
            return Results.Created($"/users/{user.Id}", user);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = ex.Message });
        }
    }
}