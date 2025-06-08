using TODO_API.Models;
using TODO_API.Services;

namespace TODO_API.Endpoints;

public static class RoleEndpoints
{
    public static IEndpointRouteBuilder AddRoleEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/roles", GetRolesHandler)
        .WithName("Get Roles")
        .WithTags("Get All Roles")
        .Produces(StatusCodes.Status200OK, typeof(List<Role>));
        return endpoints;
    }

    public static IResult GetRolesHandler(RoleService roleService)
    {
        return Results.Ok(roleService.GetRoles().Select(role => new Role { Id = role.Id, Name = role.Name }));
    }
}