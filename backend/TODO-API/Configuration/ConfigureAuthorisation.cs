namespace TODO_API.Configuration;

public static class ConfigureAuthorisation
{
    public static void ConfigureAuth(this IServiceCollection services)
    {
        services.AddAuthorization(options =>
        {
            options.AddPolicy("RequireAdministratorRole", policy => policy.RequireRole("Administrator"));
            options.AddPolicy("RequireUserRole", policy => policy.RequireRole("User"));
            options.AddPolicy("RequireTeamMemberRole", policy => policy.RequireRole("TeamMember"));
            options.AddPolicy("RequireTeamLeadRole", policy => policy.RequireRole("TeamLead"));
            options.AddPolicy("RequireTwoFactorEnabled", policy => policy.RequireClaim("TwoFactorEnabled", "true"));
        });
    }
}
