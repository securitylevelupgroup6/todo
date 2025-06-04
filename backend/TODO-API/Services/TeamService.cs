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
            var team = await teamRepository.CreateTeam(createTeamRequest);

            var addMemberRequest = new AddUserToTeamRequest
            {
                UserId = createTeamRequest.TeamLeadUserId,
                TeamId = team.Id
            };

            var teamLeadMember = await teamRepository.AddUserToTeam(addMemberRequest);

            return team;
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while creating the team.", ex);
        }
    }
}
