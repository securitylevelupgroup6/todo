namespace TODO_API.Models.Requests;

public class CreateTodoRequest
{
    public string Title { get; set; }
    public string Description { get; set; }
    public int TeamId { get; set; }
    public int OwnerUserId { get; set; }
}