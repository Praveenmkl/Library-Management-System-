using LibraryManagement.API.Database;
using LibraryManagement.API.Models;
using MongoDB.Driver;

namespace LibraryManagement.API.Repositories;

public class MemberRepository
{
    private readonly IMongoCollection<Member> _members;

    public MemberRepository(MongoDbContext context)
    {
        _members = context.GetCollection<Member>("members");
    }

    public async Task<List<Member>> GetAllAsync()
    {
        return await _members.Find(_ => true).ToListAsync();
    }

    public async Task<Member?> GetByIdAsync(string id)
    {
        return await _members
            .Find(member => member.Id == id)
            .FirstOrDefaultAsync();
    }

    public async Task CreateAsync(Member member)
    {
        await _members.InsertOneAsync(member);
    }

    public async Task UpdateAsync(string id, Member member)
    {
        await _members.ReplaceOneAsync(
            x => x.Id == id,
            member
        );
    }

    public async Task DeleteAsync(string id)
    {
        await _members.DeleteOneAsync(
            x => x.Id == id
        );
    }
}
