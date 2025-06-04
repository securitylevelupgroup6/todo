namespace TODO_API.Models.Requests;

public class AddUserToTeamRequest
{
    public int TeamId { get; set; }
    public int UserId { get; set; }
}
