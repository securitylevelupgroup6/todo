namespace TODO_API.Models;

public class Role
{
    public int Id { get; set; }

    [Column("name")]
    public string Name { get; set; }

    public ICollection<UserRole> UserRoles { get; set; } = []; 
}
