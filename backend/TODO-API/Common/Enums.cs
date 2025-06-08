
namespace TODO_API.Common;

public enum RegistrationResult
{
    Success,
    UsernameAlreadyTaken,
    InvalidPassword,
    DatabaseError,
    UnknownError
}

public enum LoginResult
{
    Success,
    UsernameDoesNotExist,
    IncorrectPassword,
    OtpFailed,
    DatabaseError,
    UnknownError
}

public enum ResetPasswordResult
{
    Success,
    UserDoesNotExist,
    InvalidPassword,
    DatabaseError,
    UnknownError
}