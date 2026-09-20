using LibraryManagement.API.Services;
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

    public class UserDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = "Member";
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserDto userDto)
    {
        try
        {
            var user = await _authService.RegisterAsync(userDto.Username, userDto.Password, userDto.Role);
            return Ok(new { message = "User registered successfully", id = user.Id });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserDto userDto)
    {
        try
        {
            var result = await _authService.LoginAsync(userDto.Username, userDto.Password);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }
}
