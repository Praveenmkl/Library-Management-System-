using LibraryManagement.API.Database;
using LibraryManagement.API.Repositories;
using LibraryManagement.API.Services;
using LibraryManagement.API.Settings;

var builder = WebApplication.CreateBuilder(args);

// Register MongoDB settings
builder.Services.Configure<MongoDBSettings>(
    builder.Configuration.GetSection("MongoDB"));

builder.Services.AddSingleton<MongoDbContext>();

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<BookRepository>();
builder.Services.AddScoped<BookService>();
builder.Services.AddScoped<MemberRepository>();
builder.Services.AddScoped<MemberService>();
builder.Services.AddScoped<BorrowingRepository>();
builder.Services.AddScoped<BorrowingService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();