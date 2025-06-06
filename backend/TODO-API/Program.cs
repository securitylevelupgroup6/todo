using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using System.Threading.RateLimiting;
using TODO_API.Common;
using TODO_API.Configuration;

EnvironmentConfiguration.JwtKey = Environment.GetEnvironmentVariable("JWT_KEY")
    ?? throw new InvalidOperationException("JWT_KEY environment variable is not set.");

EnvironmentConfiguration.JwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER")
    ?? throw new InvalidOperationException("JWT_ISSUER environment variable is not set");

EnvironmentConfiguration.JwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE")
    ?? throw new InvalidOperationException("JWT_AUDIENCE environment variable is not set");


var builder = WebApplication.CreateBuilder(args);


builder.Services.AddDbContextPool<TODO_API.Repositories.TodoContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("TodoDatabase")), poolSize: 128);

builder.Services.AddRateLimiter(rateLimiterOptions =>
{
    rateLimiterOptions.AddFixedWindowLimiter("RegisterEndpointLimiter", options =>
    {
        options.PermitLimit = 5;
        options.Window = TimeSpan.FromSeconds(30);
        options.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        options.QueueLimit = 0;
    });
});

builder.Services.AddDbContextPool<TODO_API.Repositories.TodoContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")), poolSize: 128);

builder.Services.AddServices();

builder.Services.ConfigureAuth();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddRateLimiter(rateLimiterOptions =>
{
    rateLimiterOptions.AddFixedWindowLimiter("RegisterEndpointLimiter", options =>
    {
        options.PermitLimit = 5;
        options.Window = TimeSpan.FromSeconds(30);
        options.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        options.QueueLimit = 0;
    });
});

builder.Services.AddDataProtection()
    .SetApplicationName("TodoApp")
    .PersistKeysToFileSystem(new DirectoryInfo(@"./keys"));



builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = EnvironmentConfiguration.JwtIssuer,
            ValidAudience = EnvironmentConfiguration.JwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(EnvironmentConfiguration.JwtKey)),
            ClockSkew = TimeSpan.Zero,
            RoleClaimType = ClaimTypes.Role
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Cookies["access_token"];
                if (!string.IsNullOrEmpty(accessToken))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };

    });

builder.Services.AddAuthorization((options) =>
{
    options.AddPolicy("RequireAdminRole", policy => policy.RequireRole("ADMIN"));
    options.AddPolicy("RequireTeamRole", policy => policy.RequireRole("TEAM_LEAD"));
    options.AddPolicy("RequireUserRole", policy => policy.RequireRole("USER"));
});

string AllowSpecificOrigins = "AllowAngularDevelopmentServer";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: AllowSpecificOrigins,
                      policy  =>
                      {
                          policy.WithOrigins("http://localhost:4200");
                      });
});

var app = builder.Build();
app.UseCors(AllowSpecificOrigins);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.AddEndpoints();
app.UseAuthentication();
app.UseAuthorization();
app.Run();
