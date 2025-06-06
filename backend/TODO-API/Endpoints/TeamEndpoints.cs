using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using TODO_API.Models;
using TODO_API.Models.Requests;
using TODO_API.Services;

namespace TODO_API.Endpoints;

public static class TeamEndpoints
{
    private static readonly JsonSerializerOptions CachedJsonSerializerOptions = new() { PropertyNameCaseInsensitive = true };

    public static IEndpointRouteBuilder AddTeamEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("/team", CreateTeamHandler)
        .Accepts<CreateTeamRequest>("application/json")
        .Produces(StatusCodes.Status201Created, typeof(Team))
        .Produces(StatusCodes.Status400BadRequest)
        .RequireAuthorization("RequireTeamLeadRole")
        .WithName("CreateTeam")
        .WithTags("Team");

        return endpoints;
    }

    public async static Task<IResult> CreateTeamHandler([FromServices] TeamService teamService, [FromBody] CreateTeamRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        try
        {
            var team = await teamService.CreateTeamAsync(request);

            return Results.Created($"/team/{team.Id}", team);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = ex.Message });
        }
    }
}
