using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.InteropServices;

namespace TODO_API.Models;

[Table("refresh_tokens")]
public class RefreshToken
{
    [Column("id")]
    public int Id { get; set; }

    [ForeignKey("user_id")]
    public User User { get; set; }

    [Column("refresh_token")]
    public string RefreshTokenHash { get; set; }

    [Column("expires_at")]
    public DateTime ExpiresAt { get; set; }

    [Column("revoked")]
    public bool Revoked { get; set; }
}