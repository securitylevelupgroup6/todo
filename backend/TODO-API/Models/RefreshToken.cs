namespace TODO_API.Models;

public class RefreshToken
{
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
