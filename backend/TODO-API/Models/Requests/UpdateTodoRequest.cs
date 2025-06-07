namespace TODO_API.Models.Requests;

public class UpdateTodoRequest
{
    public int TodoId { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Status { get; set; }
    public int? AssigneeId { get; set; }
    public int? TeamId { get; set; }
}
