using LibraryManagement.API.DTOs;
using LibraryManagement.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        var result = await _authService.RegisterStudentAsync(dto);
        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var result = await _authService.LoginAsync(dto);
        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("librarians")]
    public async Task<IActionResult> GetLibrarians()
    {
        var librarians = await _authService.GetLibrariansAsync();
        return Ok(librarians);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("librarians")]
    public async Task<IActionResult> CreateLibrarian([FromBody] CreateLibrarianDto dto)
    {
        var librarian = await _authService.CreateLibrarianAsync(dto);
        return Ok(librarian);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("librarians/{id}/toggle")]
    public async Task<IActionResult> ToggleLibrarianStatus(string id)
    {
        var updated = await _authService.ToggleLibrarianStatusAsync(id);
        return Ok(updated);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("librarians/{id}")]
    public async Task<IActionResult> DeleteLibrarian(string id)
    {
        await _authService.DeleteLibrarianAsync(id);
        return Ok(new { message = "Librarian deleted successfully." });
    }
}
