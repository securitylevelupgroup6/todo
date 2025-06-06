using Microsoft.AspNetCore.DataProtection;
using TODO_API.Models;
using TODO_API.Repositories;

namespace TODO_API.Services;

public class RoleService(TodoContext dbContext, IDataProtectionProvider provider)
{
    private readonly IDataProtectionProvider _provider = provider;

    private readonly TodoContext _todoContext = dbContext;

    public List<Role> GetRoles()
    {
        return [.. _todoContext.Roles];
    }
}