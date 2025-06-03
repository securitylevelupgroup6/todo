namespace TODO_API.Models;
using System.ComponentModel.DataAnnotations.Schema;

[Table("users")]
public class User
{
    [Column("id")]
    public int Id { get; set; }

    [Column("username")]
    public string Username { get; set; }

    [Column("password_hash")]
    public string Password { get; set; }

    [Column("first_name")]
    public string FirstName { get; set; }

    [Column("last_name")]
    public string LastName { get; set; }

    [Column("two_factor_secret")]
    public string TwoFactorKey { get; set; }

    public List<RefreshToken> RefreshTokens { get; set; } = [];

    public ICollection<UserRole> UserRoles { get; set; } = [];

}
