using System.IO;
using Oracle.ManagedDataAccess.Client;


var builder = WebApplication.CreateBuilder(args);


builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });   
});

builder.WebHost.UseUrls("http://localhost:5081");

var app = builder.Build();
app.UseCors();

