namespace TODO_API.Models;

public class TodoHistory
{
    public int Id { get; set; }
    public Todo Todo { get; set; } = new Todo();
    public TeamMember Reporter { get; set; } = new TeamMember();
    public DateTime Date { get; set; }
    public TodoState OldState { get; set; }
    public TodoState UpdatedState { get; set; }
}
