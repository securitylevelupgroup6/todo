using Microsoft.AspNetCore.Mvc;
using TODO_API.Models;

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
}
