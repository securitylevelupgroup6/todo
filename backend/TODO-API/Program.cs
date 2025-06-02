using Microsoft.EntityFrameworkCore;
using TODO_API.Configuration;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContextPool<TODO_API.Repositories.TodoContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("TodoDatabase")), poolSize: 128);

var app = builder.Build();

app.AddEndpoints();

app.Run();
