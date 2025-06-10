using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TODO_API.Models;
using TODO_API.Models.Requests;

namespace TODO_API.Repositories;

public class TeamRepository([FromServices] TodoContext context)
{
    public async Task<Team> CreateTeamAsync(CreateTeamRequest createTeamRequest)
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
            Console.WriteLine(ex);
            throw new Exception("An error occurred while creating the team.", ex);
        }
    }

    public async Task<TeamMember> AddTeamMemberAsync(AddTeamMemberRequest request, int teamId)
    {
        try
        {
            var user = (request.UserId != null ? await context.Users.FindAsync(request.UserId) :
                request.Username != null ? await context.Users.FirstOrDefaultAsync(user => user.Username == request.Username) :
                throw new InvalidDataException()) ?? throw new UserNotFoundException();

            var team = await context.Teams.FindAsync(teamId) ?? throw new TeamNotFoundException();

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
            Console.WriteLine(ex);
            throw new Exception("An error occurred while adding the user to the team.", ex);
        }
    }

    internal async Task<IEnumerable<User>> GetTeamUsersAsync(int teamId)
    {
        try
        {
            var team = await context.Teams.FindAsync(teamId);

            if (team is null)
            {
                throw new ArgumentException("Invalid request.", nameof(teamId));
            }

            var teamMembers = await context.TeamMembers
                .Where(teamMember => teamMember.Team.Id == teamId)
                .Include(teamMember => teamMember.User)
                .ToListAsync();

            var teamUsers = teamMembers.Select(teamMember => teamMember.User).ToList();

            if (teamUsers.Count == 0)
            {
                return [];
            }

            return teamUsers;
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while getting team users.", ex);
        }
    }
}
