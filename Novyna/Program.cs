using Microsoft.EntityFrameworkCore;
using Novyna.Data;
using Novyna.Data.Entities;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddDbContext<NovynaDbContext>(contextBuilder =>
{
    contextBuilder.UseSqlServer(builder.Configuration["ConnectionStrings:NovynaDbConnectionString"]);
});
builder.Services.AddScoped<IRepository<News>, NewsRepository>();
builder.Services.AddScoped<IRepository<Tag>, Repository<Tag>>();
builder.Services.AddScoped<IRepository<Image>, Repository<Image>>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<NovynaDbContext>();
    //dbContext.Database.EnsureDeleted();
    dbContext.Database.EnsureCreated();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
