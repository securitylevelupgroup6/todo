namespace TODO_API.Models.Responses;

public class TodoResponse
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string Status { get; set; }
    public UserResponse? Assignee { get; set; }
    public UserResponse Owner { get; set; }
}
