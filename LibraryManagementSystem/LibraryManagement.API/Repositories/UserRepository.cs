using LibraryManagement.API.Database;
using LibraryManagement.API.Models;
using MongoDB.Driver;

namespace LibraryManagement.API.Repositories;

public class UserRepository
{
    private readonly IMongoCollection<User> _users;

    public UserRepository(MongoDbContext context)
    {
        _users = context.GetCollection<User>("users");
    }

    public async Task<User?> GetByUsernameAsync(string username)
    {
        return await _users
            .Find(user => user.Username == username)
            .FirstOrDefaultAsync();
    }

    public async Task CreateAsync(User user)
    {
        await _users.InsertOneAsync(user);
    }
}
