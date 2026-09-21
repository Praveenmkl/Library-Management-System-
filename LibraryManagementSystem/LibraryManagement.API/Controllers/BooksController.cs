using LibraryManagement.API.Models;
using LibraryManagement.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly BookService _service;

    public BooksController(BookService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var books = await _service.GetAllAsync();
        return Ok(books);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var book = await _service.GetByIdAsync(id);
        if (book == null)
        {
            return NotFound(new { message = "Book not found" });
        }

        return Ok(book);
    }

    [Authorize(Roles = "Admin,Librarian")]
    [HttpPost]
    public async Task<IActionResult> Create(Book book)
    {
        await _service.CreateAsync(book);
        return CreatedAtAction(nameof(GetById), new { id = book.Id }, book);
    }

    [Authorize(Roles = "Admin,Librarian")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, Book book)
    {
        var existingBook = await _service.GetByIdAsync(id);
        if (existingBook == null)
        {
            return NotFound(new { message = "Book not found" });
        }

        book.Id = id;
        await _service.UpdateAsync(id, book);
        return Ok(book);
    }

    [Authorize(Roles = "Admin,Librarian")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var book = await _service.GetByIdAsync(id);
        if (book == null)
        {
            return NotFound(new { message = "Book not found" });
        }

        await _service.DeleteAsync(id);
        return Ok(new { message = "Book deleted successfully" });
    }
}