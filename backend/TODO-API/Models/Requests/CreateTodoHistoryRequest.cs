namespace TODO_API.Models.Requests;

public class CreateTodoHistoryRequest
{
    public Todo Todo { get; set; }
    public TeamMember Reporter { get; set; }
    public DateTime Date { get; set; }
    public int TeamId { get; set; }
    public TodoState? OldState { get; set; }
    public TodoState UpdatedState { get; set; }
}
