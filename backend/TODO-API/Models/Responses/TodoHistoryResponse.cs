namespace TODO_API.Models.Responses;

public class TodoHistoryResponse
{
    public TodoResponse Todo { get; set; }
    public List<string> History { get; set; } = new List<string>();
}
