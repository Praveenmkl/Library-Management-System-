using LibraryManagement.API.Models;
using LibraryManagement.API.Repositories;

namespace LibraryManagement.API.Services;

public class BookService
{
    private readonly BookRepository _repository;

    public BookService(BookRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<Book>> GetAllAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<Book?> GetByIdAsync(string id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task CreateAsync(Book book)
    {
        book.AvailableCopies = book.TotalCopies;

        await _repository.CreateAsync(book);
    }

    public async Task UpdateAsync(string id, Book book)
    {
        await _repository.UpdateAsync(id, book);
    }

    public async Task DeleteAsync(string id)
    {
        await _repository.DeleteAsync(id);
    }
}