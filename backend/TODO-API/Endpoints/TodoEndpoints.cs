using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TODO_API.Common;
using TODO_API.Mappers;
using TODO_API.Models;
using TODO_API.Models.Requests;
using TODO_API.Models.Responses;
using TODO_API.Services;
using TODO_API.Utilities;

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

        endpoints.MapGet("/todo/{todoId}/history", GetTodoHistoryHandler)
        .Produces(StatusCodes.Status200OK, typeof(TodoHistoryResponse))
        .Produces(StatusCodes.Status400BadRequest)
        .WithName("GetTodoHistory")
        .WithTags("Todo");

        endpoints.MapGet("/todo", GetUsersTodos)
        .Produces(StatusCodes.Status200OK)
        .WithName("GetTodos")
        .WithTags("Todo");

        endpoints.MapGet("/todo/team/{teamId}", GetTeamTodosHandler)
        .Produces(StatusCodes.Status200OK, typeof(IEnumerable<TodoResponse>))
        .Produces(StatusCodes.Status400BadRequest)
        .WithName("GetTeamTasks")
        .WithTags("Team");

        endpoints.MapDelete("/todo/{todoId}", DeleteTodoHandler)
        .Produces(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status400BadRequest)
        .WithName("DeleteTodo")
        .WithTags("Todo");

        return endpoints;
    }

    [Authorize(Roles = $"{Roles.USER},{Roles.TEAMLEAD}")]
    public async static Task<IResult> GetUsersTodos(HttpContext http, TodoService todoService)
    {
        var jwt = http.Request.Cookies["access_token"];
        return Results.Ok(await todoService.GetUserTodosAsync(jwt));
    }


    [Authorize(Roles = $"{Roles.USER},{Roles.TEAMLEAD}")]
    public async static Task<IResult> CreateTodoHandler(HttpContext http, [FromServices] TodoService todoService, [FromBody] CreateTodoRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);
        var jwt = http.Request.Cookies["access_token"];

        Console.WriteLine(!todoService.validateUserForCreation(jwt, request.OwnerUserId));
        if (!todoService.validateUserForCreation(jwt, request.OwnerUserId))
        {
            // User has insufficient roles to assign to the provided owner
            return Results.Forbid();
        }


        try
        {
            request.Sanitize();

            var todo = await todoService.CreateTodoAsync(request);

            return Results.Created($"/team/{todo.Id}", todo);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = ex.Message });
        }
    }

    [Authorize(Roles = Roles.USER)]
    public async static Task<IResult> UpdateTodoHandler(HttpContext http, [FromServices] TodoService todoService, [FromBody] UpdateTodoRequest request, int todoId)
    {
        ArgumentNullException.ThrowIfNull(request);
        var jwt = http.Request.Cookies["access_token"];

        try
        {
            request.Sanitize();

            var todo = await todoService.UpdateTodoAsync(jwt, request);

            var todoResponse = todo.MapToTodoResponse();

            return Results.Ok(todoResponse);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return Results.BadRequest(new { error = ex.Message });
        }
    }

    [Authorize(Roles = Roles.USER)]
    private static async Task<IResult> GetTeamTodosHandler([FromServices] TodoService todoService, int teamId)
    {
        try
        {
            var teamTodos = await todoService.GetTeamTodosAsync(teamId);
            var response = teamTodos.Select(todo => todo.MapToTodoResponse());
            return Results.Ok(response);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = ex.Message });
        }
    }

    [Authorize(Roles = Roles.USER)]
    private static async Task<IResult> DeleteTodoHandler(HttpContext http, [FromServices] TodoService todoService, int todoId)
    {
        var jwt = http.Request.Cookies["access_token"];

        try
        {
            await todoService.DeleteTodoAsync(jwt, todoId);
            return Results.Ok();
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return Results.BadRequest(new { error = ex.Message });
        }
    }

    [Authorize(Roles = Roles.USER)]
    private static async Task<IResult> GetTodoHistoryHandler([FromServices] TodoService todoService, int todoId)
    {
        try
        {
            var history = await todoService.GetTodoHistoryAsync(todoId);

            var todo = await todoService.GetTodoByIdAsync(todoId);

            var response = history.MapToTodoHistoryResponse(todo);
            return Results.Ok(response);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = ex.Message });
        }
    }
}
