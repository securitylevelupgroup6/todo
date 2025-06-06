namespace TODO_API.Models;

public class Team
{
    public int Id { get; set; }
    public string Name { get; set; }
    public User TeamLead { get; set; }
}
