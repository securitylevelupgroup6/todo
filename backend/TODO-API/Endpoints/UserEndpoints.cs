using Microsoft.AspNetCore.Mvc;
using TODO_API.Models;
using TODO_API.Models.Requests;
using TODO_API.Services;

namespace TODO_API.Endpoints;

public static class UserEndpoints
{
    public static IEndpointRouteBuilder AddUserEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("/user", CreateUserHandler)
        .Accepts<CreateUserRequest>("application/json")
        .Produces(StatusCodes.Status201Created, typeof(User))
        .Produces(StatusCodes.Status400BadRequest)
        .RequireAuthorization("RequireUserRole")
        .WithName("CreateUser")
        .WithTags("Users");

        return endpoints;
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
