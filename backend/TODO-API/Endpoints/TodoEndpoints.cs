using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TODO_API.Common;
using TODO_API.Mappers;
using TODO_API.Models.Requests;
using TODO_API.Models.Responses;
using TODO_API.Services;
using TODO_API.Utilities;

namespace TODO_API.Endpoints;

public static class TodoEndpoints
{
    public static IEndpointRouteBuilder AddTodoEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("/api/todo", CreateTodoHandler)
            .Accepts<CreateTodoRequest>("application/json")
            .Produces(StatusCodes.Status201Created, typeof(TodoResponse))
            .Produces(StatusCodes.Status400BadRequest)
            .WithName("CreateTodo")
            .WithTags("Todo");

        endpoints.MapPut("/api/todo", UpdateTodoHandler)
            .Accepts<UpdateTodoRequest>("application/json")
            .Produces(StatusCodes.Status200OK, typeof(TodoResponse))
            .Produces(StatusCodes.Status400BadRequest)
            .WithName("UpdateTodo")
            .WithTags("Todo");

        endpoints.MapGet("/api/todo/history/{todoId}", GetTodoHistoryHandler)
            .Produces(StatusCodes.Status200OK, typeof(TodoHistoryResponse))
            .Produces(StatusCodes.Status400BadRequest)
            .WithName("GetTodoHistory")
            .WithTags("Todo");

        endpoints.MapGet("/api/todo", GetUsersTodos)
            .Produces(StatusCodes.Status200OK)
            .WithName("GetTodos")
            .WithTags("Todo");

        endpoints.MapGet("/api/todo/team/{teamId}", GetTeamTodosHandler)
            .Produces(StatusCodes.Status200OK, typeof(IEnumerable<TodoResponse>))
            .Produces(StatusCodes.Status400BadRequest)
            .WithName("GetTeamTasks")
            .WithTags("Team");

        endpoints.MapDelete("/api/todo/delete/{todoId}", DeleteTodoHandler)
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status400BadRequest)
            .WithName("DeleteTodo")
            .WithTags("Todo");

        return endpoints;
    }

    [Authorize(Roles = $"{Roles.USER},{Roles.TEAMLEAD}")]
    public async static Task<IResult> GetUsersTodos(HttpContext http, TodoService todoService, bool? includeAll)
    {
        var jwt = http.Request.Cookies["access_token"];
        return Results.Ok(await todoService.GetUserTodosAsync(jwt, includeAll ?? false));
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
    public async static Task<IResult> UpdateTodoHandler(HttpContext http, [FromServices] TodoService todoService, [FromBody] UpdateTodoRequest request)
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
    public async static Task<IResult> GetTeamTodosHandler(HttpContext http, [FromServices] TodoService todoService, [FromRoute] int teamId)
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
    public async static Task<IResult> DeleteTodoHandler(HttpContext http, [FromServices] TodoService todoService, [FromRoute] int todoId)
    {
        var jwt = http.Request.Cookies["access_token"];

        try
        {
            await todoService.DeleteTodoAsync(jwt, todoId);
            return Results.NoContent();
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return Results.BadRequest(new { error = ex.Message });
        }
    }

    [Authorize(Roles = Roles.USER)]
    public async static Task<IResult> GetTodoHistoryHandler(HttpContext http, [FromServices] TodoService todoService, [FromRoute] int todoId)
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
