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

public static class TeamEndpoints
{
    public static IEndpointRouteBuilder AddTeamEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("/teams", CreateTeamHandler)
        .Accepts<CreateTeamRequest>("application/json")
        .Produces(StatusCodes.Status201Created, typeof(Team))
        .Produces(StatusCodes.Status400BadRequest)
        .WithName("CreateTeam")
        .WithTags("Team");

        endpoints.MapPost("/teams/{teamId}/members", AddTeamMemberHandler)
        .Accepts<AddTeamMemberRequest>("application/json")
        .Produces(StatusCodes.Status200OK, typeof(TeamMember))
        .Produces(StatusCodes.Status400BadRequest)
        .WithName("AddTeamMember")
        .WithTags("Team");

        endpoints.MapGet("/teams/{teamId}/members", GetTeamMembersHandler)
        .Produces(StatusCodes.Status200OK, typeof(IEnumerable<UserResponse>))
        .Produces(StatusCodes.Status400BadRequest)
        .WithName("GetTeamUsers")
        .WithTags("Team");

        return endpoints;
    }

    [Authorize(Roles = $"{Roles.USER},{Roles.TEAMLEAD}")]
    private static async Task<IResult> GetTeamMembersHandler([FromServices] TeamService teamService, int teamId)
    {
        try
        {
            var teamUsers = await teamService.GetTeamUsersAsync(teamId);

            var response = teamUsers.Select(user => user.MapToUserResponse());

            return Results.Ok(response);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = ex.Message });
        }
    }

    [Authorize(Roles = Roles.TEAMLEAD)]
    public async static Task<IResult> CreateTeamHandler([FromServices] TeamService teamService, [FromBody] CreateTeamRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        try
        {
            request.Sanitize();

            var team = await teamService.CreateTeamAsync(request);

            return Results.Created($"/team/{team.Id}", team);
        }
        catch (Exception ex)
        {

            return Results.BadRequest(new { error = ex.Message });
        }
    }

    [Authorize(Roles = Roles.TEAMLEAD)]
    public async static Task<IResult> AddTeamMemberHandler([FromServices] TeamService teamService, int teamId, [FromBody] AddTeamMemberRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);
        try
        {
            request.Sanitize();

            var teamMember = await teamService.AddTeamMemberAsync(request, teamId);

            return Results.Ok(teamMember);
        }
        catch (UserNotFoundException)
        {
            return Results.BadRequest("The user specified does not exist.");
        }
        catch (TeamNotFoundException)
        {
            return Results.BadRequest("The Team specified does not exist");
        }

        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return Results.BadRequest(new { error = ex.Message });
        }
    }
}
