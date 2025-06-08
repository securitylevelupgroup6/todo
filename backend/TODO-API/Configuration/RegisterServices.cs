using TODO_API.Repositories;
using TODO_API.Services;

namespace TODO_API.Configuration;

public static class RegisterServices
{
    public static IServiceCollection AddServices(this IServiceCollection services)
    {
        services.AddScoped<UserRepository>();
        services.AddScoped<UserService>();
        services.AddScoped<TeamRepository>();
        services.AddScoped<TodoRepository>();
        services.AddScoped<TeamService>();
        services.AddScoped<RoleService>();
        services.AddScoped<TodoService>();

        return services;
    }
}
