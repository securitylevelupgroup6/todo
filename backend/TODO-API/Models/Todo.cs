namespace TODO_API.Models;

public class Todo
{
    public int Id { get; set; }
    public TodoState TodoState { get; set; }
    public TeamMember Owner { get; set; }
}
