using Microsoft.AspNetCore.Mvc;
using TODO_API.Models;
using TODO_API.Models.Requests;

namespace TODO_API.Repositories;

public class TeamRepository([FromServices] TodoContext context)
{
    public async Task<Team> CreateTeam(CreateTeamRequest createTeamRequest)
    {
        ArgumentNullException.ThrowIfNull(createTeamRequest);

        try
        {
            var teamLead = await context.Users.FindAsync(createTeamRequest.TeamLeadUserId);

            if (teamLead is null)
            {
                throw new ArgumentException("Team lead user not found.", nameof(createTeamRequest.TeamLeadUserId));
            }

            var team = new Team
            {
                Name = createTeamRequest.Name,
                TeamLead = teamLead,
            };

            await context.Teams.AddAsync(team);
            await context.SaveChangesAsync();

            return team;
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while creating the team.", ex);
        }
    }

    public async Task<TeamMember> AddUserToTeam(AddUserToTeamRequest addUserToTeamRequest)
    {
        ArgumentNullException.ThrowIfNull(addUserToTeamRequest.UserId);
        try
        {
            var user = await context.Users.FindAsync(addUserToTeamRequest.UserId);
            var team = await context.Teams.FindAsync(addUserToTeamRequest.TeamId);

            if (user is null || team is null)
            {
                throw new ArgumentException("User not found.", nameof(addUserToTeamRequest.UserId));
            }
            var teamMember = new TeamMember
            {
                User = user,
                Team = team
            };

            await context.TeamMembers.AddAsync(teamMember);
            await context.SaveChangesAsync();
            return teamMember;
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while adding the user to the team.", ex);
        }
    }
}
