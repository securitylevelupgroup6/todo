namespace TODO_API.Models.Requests;

public class CreateTeamRequest
{
    public string Name { get; set; }
    public int TeamLeadUserId { get; set; }
}
