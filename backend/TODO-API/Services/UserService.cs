using TODO_API.Models;
using TODO_API.Models.Requests;
using TODO_API.Repositories;

namespace TODO_API.Services;

public class UserService(UserRepository userRepository)
{
    public async Task<User> CreateUserAsync(CreateUserRequest createUserRequest)
    {
        try
        {
            var user = await userRepository.CreateUser(createUserRequest);

            return user;
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while creating the user.", ex);
        }
    }
}
