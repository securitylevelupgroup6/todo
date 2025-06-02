using TODO_API.Models;

namespace TODO_API.Services;

public class UserService
{
    public static User CreateUser(CreateUserRequest createUserRequest)
    {
        ArgumentNullException.ThrowIfNull(createUserRequest);



    }
}
