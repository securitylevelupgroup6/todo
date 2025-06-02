using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text.Json.Nodes;
using TODO_API.Models;

namespace TODO_API.Endpoints;

public static class CreateUser
{
    private static readonly JsonSerializerOptions CachedJsonSerializerOptions = new() { PropertyNameCaseInsensitive = true };

    public static void AddCreateUserEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("/users", CreateUserHandler)
        .WithName("CreateUser")
        .WithTags("Users");
    }

    public static void CreateUserHandler([FromBody] JsonObject request)
    {
        ArgumentNullException.ThrowIfNull(request);

        try
        {
            var createUserRequest = JsonSerializer.Deserialize<CreateUserRequest>(request.ToJsonString(), CachedJsonSerializerOptions);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("An error occurred while creating the user.", ex);
        }
    }
}
