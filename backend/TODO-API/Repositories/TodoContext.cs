using Microsoft.EntityFrameworkCore;
using TODO_API.Models;

namespace TODO_API.Repositories;

public class TodoContext : DbContext
{

    public TodoContext(DbContextOptions<TodoContext> options)
        : base(options)
    {
    }
    public DbSet<User> Users { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
}