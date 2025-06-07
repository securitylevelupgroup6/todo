using TODO_API.Models;
using TODO_API.Models.Requests;
using TODO_API.Repositories;

namespace TODO_API.Services;

public class TeamService(TeamRepository teamRepository)
{
    public async Task<Team> CreateTeamAsync(CreateTeamRequest createTeamRequest)
    {
        try
        {
            var team = await teamRepository.CreateTeamAsync(createTeamRequest);

            var addMemberRequest = new AddTeamMemberRequest
            {
                UserId = createTeamRequest.TeamLeadUserId,
            };

            var teamLeadMember = await teamRepository.AddTeamMemberAsync(addMemberRequest, team.Id);

            return team;
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while creating the team.", ex);
        }
    }

    internal async Task<TeamMember> AddTeamMemberAsync(AddTeamMemberRequest request, int teamId)
    {
        try
        {
            var teamMember = await teamRepository.AddTeamMemberAsync(request, teamId);

            return teamMember;
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while adding user to the team.", ex);
        }
    }

    internal async Task<IEnumerable<User>> GetTeamUsersAsync(int teamId)
    {
        try
        {
            var teamUsers = await teamRepository.GetTeamUsersAsync(teamId);

            return teamUsers;
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while getting team users.", ex);
        }
    }
}
