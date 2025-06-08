using System.ComponentModel.DataAnnotations.Schema;

namespace TODO_API.Models;

[Table("teams")]
public class Team
{
    [Column("id")]
    public int Id { get; set; }

    [Column("name")]
    public string Name { get; set; }

    [Column("lead_user_id")]
    public int TeamLeadId { get; set; }

    [Column("team_lead")]
    public User TeamLead { get; set; }
}
