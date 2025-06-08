using System.ComponentModel.DataAnnotations.Schema;

namespace TODO_API.Models;

[Table("todo_history")]
public class TodoHistory
{
    [Column("id")]
    public int Id { get; set; }

    [Column("todo_id")]
    public int TodoId { get; set; }

    public Todo Todo { get; set; }

    [Column("reporter_member_id")]
    public int ReporterId { get; set; }

    public TeamMember Reporter { get; set; }

    [Column("change_date")]
    public DateTime Date { get; set; }

    [Column("old_state_id")]
    public int OldStateId{ get; set; }

    [Column("updated_state_id")]
    public int UpdatedStateId { get; set; }

    public TodoState? OldState { get; set; }

    public TodoState UpdatedState { get; set; }
}
