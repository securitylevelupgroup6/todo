namespace TODO_API.Models;

public class TodoState
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public TodoStatus Status { get; set; }
    public Team Team { get; set; }
    public TeamMember? Assignee { get; set; }
}
