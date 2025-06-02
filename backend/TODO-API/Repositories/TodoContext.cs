using Microsoft.EntityFrameworkCore;
using TODO_API.Models;

namespace TODO_API.Repositories;

public class TodoContext : DbContext
{
    public DbSet<User> Users { get; set; }
}