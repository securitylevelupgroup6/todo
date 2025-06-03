using System.ComponentModel.DataAnnotations.Schema;

namespace TODO_API.Models;

[Table("user_roles")]
public class UserRole
{
    [Column("id")]
    public int Id { get; set; }

    [Column("user_id")]
    public int UserId { get; set; }

    [Column("role_id")]
    public int RoleId { get; set; }

    public User User { get; set; }
    public Role Role { get; set; }
}