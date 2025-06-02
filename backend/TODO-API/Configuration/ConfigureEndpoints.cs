using TODO_API.Endpoints;

namespace TODO_API.Configuration;

public static class ConfigureEndpoints
{
    public static void AddEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.AddCreateUserEndpoint();
    }
}
