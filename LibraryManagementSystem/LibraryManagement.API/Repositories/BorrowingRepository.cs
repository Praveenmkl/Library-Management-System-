using LibraryManagement.API.Database;
using LibraryManagement.API.Models;
using MongoDB.Driver;

namespace LibraryManagement.API.Repositories;

public class BorrowingRepository
{
    private readonly IMongoCollection<Borrowing> _borrowings;

    public BorrowingRepository(MongoDbContext context)
    {
        _borrowings = context.GetCollection<Borrowing>("borrowings");
    }

    public async Task<List<Borrowing>> GetAllAsync()
    {
        return await _borrowings.Find(_ => true).ToListAsync();
    }

    public async Task<Borrowing?> GetByIdAsync(string id)
    {
        return await _borrowings
            .Find(borrowing => borrowing.Id == id)
            .FirstOrDefaultAsync();
    }

    public async Task CreateAsync(Borrowing borrowing)
    {
        await _borrowings.InsertOneAsync(borrowing);
    }

    public async Task UpdateAsync(string id, Borrowing borrowing)
    {
        await _borrowings.ReplaceOneAsync(
            x => x.Id == id,
            borrowing
        );
    }
}
