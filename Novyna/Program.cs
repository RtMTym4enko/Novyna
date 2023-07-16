using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Novyna.Data;
using Novyna.Data.Entities;
using Novyna.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<NovynaDbContext>(contextBuilder =>
{
    contextBuilder.UseSqlServer(builder.Configuration["ConnectionStrings:NovynaDbConnectionString"]);
});
builder.Services.AddScoped<IRepository<News>, NewsRepository>();
builder.Services.AddScoped<IRepository<Tag>, Repository<Tag>>();
builder.Services.AddScoped<IRepository<Image>, Repository<Image>>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddSingleton<IImagePathProvider, ImagePathProvider>();
builder.Services.AddSingleton<IImageUrlProvider, ImageUrlProvider>();

builder.Services.AddControllers(options =>
{
    options.ReturnHttpNotAcceptable = true;
});

builder.Services.AddAutoMapper(typeof(Program).Assembly);

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<NovynaDbContext>();
    //dbContext.Database.EnsureDeleted();
    dbContext.Database.EnsureCreated();
}

if(builder.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler(appBuilder =>
    {
        appBuilder.Run(async context =>
        {
            context.Response.StatusCode = 500;
            await context.Response.WriteAsync("Ooopsie!");
        });
    });
}
var picturesDir = Path.Combine(builder.Environment.ContentRootPath, "Pictures");
if (!Directory.Exists(picturesDir))
{
    Directory.CreateDirectory(picturesDir);
}
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(picturesDir),
    RequestPath = "/Pictures"
});

app.UseHttpsRedirection();

app.UseHttpsRedirection();
app.MapControllers();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();

