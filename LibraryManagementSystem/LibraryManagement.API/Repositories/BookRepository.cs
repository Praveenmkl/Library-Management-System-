using LibraryManagement.API.Database;
using LibraryManagement.API.Models;
using MongoDB.Driver;

namespace LibraryManagement.API.Repositories;

public class BookRepository
{
    private readonly IMongoCollection<Book> _books;

    public BookRepository(MongoDbContext context)
    {
        _books = context.GetCollection<Book>("books");
    }

    public async Task<List<Book>> GetAllAsync()
    {
        return await _books.Find(_ => true).ToListAsync();
    }

    public async Task<Book?> GetByIdAsync(string id)
    {
        return await _books
            .Find(book => book.Id == id)
            .FirstOrDefaultAsync();
    }

    public async Task CreateAsync(Book book)
    {
        await _books.InsertOneAsync(book);
    }

    public async Task UpdateAsync(string id, Book book)
    {
        await _books.ReplaceOneAsync(
            x => x.Id == id,
            book
        );
    }

    public async Task DeleteAsync(string id)
    {
        await _books.DeleteOneAsync(
            x => x.Id == id
        );
    }
}