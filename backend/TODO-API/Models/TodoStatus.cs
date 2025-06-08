using System.ComponentModel.DataAnnotations.Schema;

namespace TODO_API.Models;

[Table("todo_statuses")]
public class TodoStatus
{
    [Column("id")]
    public int Id { get; set; }

    [Column("status_name")]
    public string StatusName { get; set; }
}