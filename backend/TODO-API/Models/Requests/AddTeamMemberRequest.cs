namespace TODO_API.Models.Requests;

public class AddTeamMemberRequest
{
    public int? UserId { get; set; }
    public string? Username { get; set; }
}