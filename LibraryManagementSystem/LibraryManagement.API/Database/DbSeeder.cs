using LibraryManagement.API.Models;
using MongoDB.Driver;

namespace LibraryManagement.API.Database;

public static class DbSeeder
{
    public static async Task SeedDefaultAdminAsync(MongoDbContext context, ILogger logger)
    {
        var usersCollection = context.GetCollection<User>("users");

        var filter = Builders<User>.Filter.Or(
            Builders<User>.Filter.Eq(u => u.Username, "admin@library.org"),
            Builders<User>.Filter.Eq(u => u.Username, "admin")
        );

        var admin = await usersCollection.Find(filter).FirstOrDefaultAsync();

        if (admin == null)
        {
            var defaultAdmin = new User
            {
                Username = "admin@library.org",
                Email = "admin@library.org",
                FullName = "System Administrator",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                Role = "Admin",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            await usersCollection.InsertOneAsync(defaultAdmin);
            logger.LogInformation("Default Admin created: admin@library.org / Admin@123");
        }
        else
        {
            admin.Username = "admin@library.org";
            admin.Email = "admin@library.org";
            admin.Role = "Admin";
            admin.IsActive = true;
            admin.PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123");
            await usersCollection.ReplaceOneAsync(u => u.Id == admin.Id, admin);
            logger.LogInformation("Default Admin refreshed: admin@library.org / Admin@123");
        }
    }
}
