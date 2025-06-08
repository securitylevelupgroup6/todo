namespace TODO_API.Models.Requests;

public class PasswordResetRequest
{
    public int UserId { get; set; }
    public string NewPassword { get; set; }
}
