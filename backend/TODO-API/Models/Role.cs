using System.ComponentModel.DataAnnotations.Schema;

namespace TODO_API.Models;

[Table("roles")]
public class Role
{
    [Column("id")]
    public int Id { get; set; }

    [Column("name")]
    public string Name { get; set; }

    public ICollection<UserRole> UserRoles { get; set; } = []; 
}