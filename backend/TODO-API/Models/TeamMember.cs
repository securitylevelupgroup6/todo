namespace TODO_API.Models;

public class TeamMember
{
    public int Id { get; set; }
    public User User { get; set; } = new User();
    public Team Team { get; set; } = new Team();
}
