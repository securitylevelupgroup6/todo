namespace TODO_API.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

public record UserRecord(int Id, string UserName, string FirstName, string LastName, List<string> Roles);

[Table("users")]
public class User
{
    [Column("id")]
    public int Id { get; set; }

    [Column("username")]
    public string Username { get; set; }

    [JsonIgnore]
    [Column("password_hash")]
    public string Password { get; set; }

    [Column("first_name")]
    public string FirstName { get; set; }

    [Column("last_name")]
    public string LastName { get; set; }

    [JsonIgnore]
    [Column("two_factor_secret")]
    public string TwoFactorKey { get; set; }

    [JsonIgnore]
    public List<RefreshToken> RefreshTokens { get; set; } = [];

    [JsonIgnore]
    public ICollection<UserRole> UserRoles { get; set; } = [];

}
