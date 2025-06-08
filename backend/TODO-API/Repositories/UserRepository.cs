using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TODO_API.Models;
using TODO_API.Models.Requests;

namespace TODO_API.Repositories;

public class UserRepository([FromServices] TodoContext context)
{
    public async Task<User> CreateUser(CreateUserRequest createUserRequest)
    {
        ArgumentNullException.ThrowIfNull(createUserRequest);

        try
        {
            var user = new User
            {
                Username = createUserRequest.Username,
                Password = createUserRequest.Password,
                FirstName = createUserRequest.FirstName,
                LastName = createUserRequest.LastName,
                TwoFactorKey = "Two factor key"
            };

            await context.Users.AddAsync(user);
            await context.SaveChangesAsync();

            return user;
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while creating the user.", ex);
        }
    }

    internal async Task<IEnumerable<Team>> GetUserTeamsAsync(User user)
    {
        try
        {
            var userTeams = await context.TeamMembers
                .Where(teamMember => teamMember.UserId == user.Id)
                .Select(teamMember => teamMember.Team)
                .ToListAsync();

            return userTeams;
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while retrieving user teams.", ex);
        }
    }
}
