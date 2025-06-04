using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text.Json.Nodes;
using TODO_API.Models;
using TODO_API.Services;

namespace TODO_API.Endpoints;

public static class CreateUser
{
    private static readonly JsonSerializerOptions CachedJsonSerializerOptions = new() { PropertyNameCaseInsensitive = true };

    public static void AddCreateUserEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("/user", CreateUserHandler)
        .Accepts<CreateUserRequest>("application/json")
        .Produces<User>(StatusCodes.Status201Created)
        .Produces(StatusCodes.Status400BadRequest)
        .WithName("CreateUser")
        .WithTags("Users");
    }

    public async static void CreateUserHandler([FromServices] UserService userService, [FromBody] JsonObject request)
    {
        ArgumentNullException.ThrowIfNull(request);

        try
        {
            var createUserRequest = JsonSerializer.Deserialize<CreateUserRequest>(request.ToJsonString(), CachedJsonSerializerOptions);

            if (createUserRequest is null)
            {
                throw new ArgumentException("Invalid user creation request.", nameof(request));
            }

            var user = await userService.CreateUserAsync(createUserRequest);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("An error occurred while creating the user.", ex);
        }
    }
}
