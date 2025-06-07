using System.ComponentModel.DataAnnotations.Schema;

namespace TODO_API.Models;

[Table("todos")]
public class Todo
{
    [Column("id")]
    public int Id { get; set; }

    [Column("current_state_id")]
    public int TodoStateId {get; set;}

    [Column("team_owner_member_id")]
    public int OwnerId {get; set;}

    public TodoState TodoState { get; set; }
    public TeamMember Owner { get; set; }
}
