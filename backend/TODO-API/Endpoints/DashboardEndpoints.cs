// using Microsoft.AspNetCore.Mvc;
// using TODO_API.Models;
// using TODO_API.Repositories;
// using TODO_API.Services;

// namespace TODO_API.Endpoints;

// public static class DashboardEndpoints
// {
//     public static void MapDashboardEndpoints(this IEndpointRouteBuilder app)
//     {
//         var group = app.MapGroup("/api")
//             .WithTags("Dashboard")
//             .WithOpenApi();

//         // Get all teams
//         group.MapGet("/teams", async (
//             [FromServices] ITeamRepository teamRepository) =>
//         {
//             var teams = await teamRepository.GetAllTeamsAsync();
//             return Results.Ok(teams);
//         })
//         .WithName("GetTeams")
//         .WithSummary("Get all teams");

//         // Get all todos
//         group.MapGet("/todos", async (
//             [FromServices] ITodoRepository todoRepository) =>
//         {
//             var todos = await todoRepository.GetAllTodosAsync();
//             return Results.Ok(todos);
//         })
//         .WithName("GetTodos")
//         .WithSummary("Get all todos");

//         // Get all todo states
//         group.MapGet("/todo-states", async (
//             [FromServices] ITodoStateRepository todoStateRepository) =>
//         {
//             var states = await todoStateRepository.GetAllTodoStatesAsync();
//             return Results.Ok(states);
//         })
//         .WithName("GetTodoStates")
//         .WithSummary("Get all todo states");

//         // Get all todo statuses
//         group.MapGet("/todo-statuses", async (
//             [FromServices] ITodoStatusRepository todoStatusRepository) =>
//         {
//             var statuses = await todoStatusRepository.GetAllTodoStatusesAsync();
//             return Results.Ok(statuses);
//         })
//         .WithName("GetTodoStatuses")
//         .WithSummary("Get all todo statuses");

//         // Get todo history
//         group.MapGet("/todo-history", async (
//             [FromServices] ITodoHistoryRepository todoHistoryRepository) =>
//         {
//             var history = await todoHistoryRepository.GetTodoHistoryAsync();
//             return Results.Ok(history);
//         })
//         .WithName("GetTodoHistory")
//         .WithSummary("Get todo history");
//     }
// } 