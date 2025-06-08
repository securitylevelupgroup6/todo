using System.ComponentModel.DataAnnotations.Schema;

namespace TODO_API.Models;

[Table("team_members")]
public class TeamMember
{
    [Column("id")]
    public int Id { get; set; }

    [Column("user_id")]
    public int UserId { get; set; }

    [Column("team_id")]
    public int TeamId { get; set; }

    public User User { get; set; } = new User();
    public Team Team { get; set; } = new Team();
}
