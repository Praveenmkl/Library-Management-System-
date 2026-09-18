using LibraryManagement.API.Models;
using LibraryManagement.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace LibraryManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BorrowingsController : ControllerBase
{
    private readonly BorrowingService _service;

    public BorrowingsController(BorrowingService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var borrowings = await _service.GetAllAsync();
        return Ok(borrowings);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var borrowing = await _service.GetByIdAsync(id);

        if (borrowing == null)
        {
            return NotFound(new { message = "Borrowing record not found" });
        }

        return Ok(borrowing);
    }

    [HttpPost("borrow")]
    public async Task<IActionResult> Borrow(Borrowing borrowing)
    {
        try
        {
            var result = await _service.BorrowBookAsync(borrowing);
            return CreatedAtAction(
                nameof(GetById),
                new { id = result.Id },
                result
            );
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("return/{id}")]
    public async Task<IActionResult> Return(string id)
    {
        try
        {
            var result = await _service.ReturnBookAsync(id);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
