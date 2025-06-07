using Microsoft.AspNetCore.Mvc;
using TODO_API.Mappers;
using TODO_API.Models;
using TODO_API.Models.Requests;
using TODO_API.Services;

namespace TODO_API.Endpoints;

public static class TodoEndpoints
{
    public static IEndpointRouteBuilder AddTodoEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("/todo", CreateTodoHandler)
        .Accepts<CreateTodoRequest>("application/json")
        .Produces(StatusCodes.Status201Created, typeof(Todo))
        .Produces(StatusCodes.Status400BadRequest)
        .WithName("CreateTodo")
        .WithTags("Todo");

        endpoints.MapPut("/todo/{todoId}", UpdateTodoHandler)
        .Accepts<UpdateTodoRequest>("application/json")
        .Produces(StatusCodes.Status201Created, typeof(Todo))
        .Produces(StatusCodes.Status400BadRequest)
        .WithName("UpdateTodo")
        .WithTags("Todo");

        endpoints.MapGet("/todo", GetUsersTodos)
        .Produces(StatusCodes.Status200OK)
        .WithName("GetTodos")
        .WithTags("Todo");

        return endpoints;
    }

    public async static Task<IResult> GetUsersTodos(HttpContext http, TodoService todoService) {
        var jwt = http.Request.Cookies["access_token"];
        if (jwt == null) {
            return Results.BadRequest("No jwt");
        }
        return Results.Ok(await todoService.GetUserTodosAsync(jwt));
    }

    public async static Task<IResult> CreateTodoHandler([FromServices] TodoService todoService, [FromBody] CreateTodoRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        try
        {
            var todo = await todoService.CreateTodoAsync(request);

            return Results.Created($"/team/{todo.Id}", todo);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = ex.Message });
        }
    }

    public async static Task<IResult> UpdateTodoHandler([FromServices] TodoService todoService, [FromBody] UpdateTodoRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        try
        {
            var todo = await todoService.UpdateTodoAsync(request);

            var todoResponse = todo.MapToTodoResponse();

            return Results.Ok(todoResponse);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = ex.Message });
        }
    }
}
