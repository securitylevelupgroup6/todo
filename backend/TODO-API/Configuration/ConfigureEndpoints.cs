using TODO_API.Endpoints;

namespace TODO_API.Configuration;

public static class ConfigureEndpoints
{
    public static void AddEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.AddUserEndpoints()
            .AddTeamEndpoints();
        endpoints.AddAuthEndpoints();
        endpoints.AddRoleEndpoints();
        endpoints.AddUserEndpoints();
    }
}
