using System.Text.RegularExpressions;
using LibraryManagement.API.Database;
using LibraryManagement.API.Models;
using MongoDB.Bson;
using MongoDB.Driver;

namespace LibraryManagement.API.Repositories;

public class UserRepository
{
    private readonly IMongoCollection<User> _users;

    public UserRepository(MongoDbContext context)
    {
        _users = context.GetCollection<User>("users");
    }

    public async Task<List<User>> GetAllAsync()
    {
        return await _users.Find(_ => true).ToListAsync();
    }

    public async Task<List<User>> GetByRoleAsync(string role)
    {
        var filter = Builders<User>.Filter.Regex(
            u => u.Role,
            new BsonRegularExpression($"^{Regex.Escape(role)}$", "i")
        );
        return await _users.Find(filter).ToListAsync();
    }

    public async Task<User?> GetByIdAsync(string id)
    {
        return await _users
            .Find(user => user.Id == id)
            .FirstOrDefaultAsync();
    }

    public async Task<User?> GetByUsernameAsync(string username)
    {
        var filter = Builders<User>.Filter.Or(
            Builders<User>.Filter.Regex(u => u.Username, new BsonRegularExpression($"^{Regex.Escape(username)}$", "i")),
            Builders<User>.Filter.Regex(u => u.Email, new BsonRegularExpression($"^{Regex.Escape(username)}$", "i"))
        );
        return await _users.Find(filter).FirstOrDefaultAsync();
    }

    public async Task CreateAsync(User user)
    {
        await _users.InsertOneAsync(user);
    }

    public async Task UpdateAsync(string id, User user)
    {
        await _users.ReplaceOneAsync(u => u.Id == id, user);
    }

    public async Task DeleteAsync(string id)
    {
        await _users.DeleteOneAsync(u => u.Id == id);
    }
}
