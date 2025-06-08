using System.ComponentModel.DataAnnotations.Schema;

namespace TODO_API.Models;

[Table("todo_states")]
public class TodoState
{
    [Column("id")]
    public int Id { get; set; }

    [Column("title")]
    public string Title { get; set; }

    [Column("description")]
    public string Description { get; set; }

    [Column("status_id")]
    public int StatusId { get; set; }

    [Column("team_id")]
    public int TeamId { get; set; }

    [Column("assignee_member_id")]
    public int AssigneeId { get;  set;}
    
    public TodoStatus Status { get; set; }
    public Team Team { get; set; }
    public TeamMember? Assignee { get; set; }
}
