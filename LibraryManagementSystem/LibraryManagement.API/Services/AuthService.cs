using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LibraryManagement.API.DTOs;
using LibraryManagement.API.Models;
using LibraryManagement.API.Repositories;
using LibraryManagement.API.Settings;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace LibraryManagement.API.Services;

public class AuthService
{
    private readonly UserRepository _userRepository;
    private readonly MemberRepository _memberRepository;
    private readonly JwtSettings _jwtSettings;

    public AuthService(
        UserRepository userRepository,
        MemberRepository memberRepository,
        IOptions<JwtSettings> jwtSettings)
    {
        _userRepository = userRepository;
        _memberRepository = memberRepository;
        _jwtSettings = jwtSettings.Value;
    }

    public async Task<AuthResponseDto> RegisterStudentAsync(RegisterDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Username))
            throw new ArgumentException("Username is required.");
        if (string.IsNullOrWhiteSpace(dto.Password))
            throw new ArgumentException("Password is required.");

        var existingUser = await _userRepository.GetByUsernameAsync(dto.Username.Trim());
        if (existingUser != null)
            throw new InvalidOperationException("Username is already taken.");

        if (!string.IsNullOrWhiteSpace(dto.Email))
        {
            var existingEmail = await _userRepository.GetByUsernameAsync(dto.Email.Trim());
            if (existingEmail != null)
                throw new InvalidOperationException("Email address is already in use.");
        }

        // 1. Create Member profile atomically for this Student
        var member = new Member
        {
            Name = !string.IsNullOrWhiteSpace(dto.FullName) ? dto.FullName.Trim() : dto.Username.Trim(),
            Email = !string.IsNullOrWhiteSpace(dto.Email) ? dto.Email.Trim() : $"{dto.Username.Trim()}@student.edu",
            Phone = !string.IsNullOrWhiteSpace(dto.Phone) ? dto.Phone.Trim() : string.Empty,
            Address = !string.IsNullOrWhiteSpace(dto.Address) ? dto.Address.Trim() : string.Empty,
            IsActive = true,
            RegisteredAt = DateTime.UtcNow
        };
        await _memberRepository.CreateAsync(member);

        // 2. Create User login credentials linked to Member profile
        var user = new User
        {
            Username = dto.Username.Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = "Student",
            Email = member.Email,
            FullName = member.Name,
            MemberId = member.Id,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        await _userRepository.CreateAsync(user);

        var token = GenerateJwtToken(user);

        return new AuthResponseDto
        {
            Token = token,
            User = new UserProfileDto
            {
                Id = user.Id ?? string.Empty,
                Username = user.Username,
                Role = user.Role,
                FullName = user.FullName ?? user.Username,
                Email = user.Email ?? string.Empty,
                MemberId = user.MemberId ?? string.Empty
            }
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
            throw new ArgumentException("Username and password are required.");

        var user = await _userRepository.GetByUsernameAsync(dto.Username.Trim());
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid username or password.");
        }

        if (!user.IsActive)
        {
            throw new UnauthorizedAccessException("This account has been deactivated. Please contact the administrator.");
        }

        // Ensure student has a linked Member record
        if (string.IsNullOrEmpty(user.MemberId) && (user.Role.Equals("Student", StringComparison.OrdinalIgnoreCase) || user.Role.Equals("Member", StringComparison.OrdinalIgnoreCase)))
        {
            var members = await _memberRepository.GetAllAsync();
            var matched = members.FirstOrDefault(m =>
                string.Equals(m.Email, user.Email, StringComparison.OrdinalIgnoreCase) ||
                string.Equals(m.Email, user.Username, StringComparison.OrdinalIgnoreCase) ||
                string.Equals(m.Name, user.FullName, StringComparison.OrdinalIgnoreCase));

            if (matched != null)
            {
                user.MemberId = matched.Id;
                await _userRepository.UpdateAsync(user.Id!, user);
            }
            else
            {
                var newMember = new Member
                {
                    Name = user.FullName ?? user.Username,
                    Email = user.Email ?? (user.Username.Contains("@") ? user.Username : $"{user.Username}@student.edu"),
                    Phone = string.Empty,
                    Address = string.Empty,
                    IsActive = true,
                    RegisteredAt = DateTime.UtcNow
                };
                await _memberRepository.CreateAsync(newMember);
                user.MemberId = newMember.Id;
                await _userRepository.UpdateAsync(user.Id!, user);
            }
        }

        var token = GenerateJwtToken(user);

        return new AuthResponseDto
        {
            Token = token,
            User = new UserProfileDto
            {
                Id = user.Id ?? string.Empty,
                Username = user.Username,
                Role = user.Role,
                FullName = user.FullName ?? user.Username,
                Email = user.Email ?? string.Empty,
                MemberId = user.MemberId ?? string.Empty
            }
        };
    }

    public async Task<LibrarianDto> CreateLibrarianAsync(CreateLibrarianDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
            throw new ArgumentException("Email and password are required.");

        var existingUser = await _userRepository.GetByUsernameAsync(dto.Email.Trim());
        if (existingUser != null)
            throw new InvalidOperationException("An account with this email already exists.");

        var user = new User
        {
            Username = dto.Email.Trim(),
            Email = dto.Email.Trim(),
            FullName = !string.IsNullOrWhiteSpace(dto.Name) ? dto.Name.Trim() : dto.Email.Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = "Librarian",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        await _userRepository.CreateAsync(user);

        return new LibrarianDto
        {
            Id = user.Id ?? string.Empty,
            Name = user.FullName,
            Email = user.Email,
            Role = user.Role,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt.ToString("yyyy-MM-dd")
        };
    }

    public async Task<List<LibrarianDto>> GetLibrariansAsync()
    {
        var librarians = await _userRepository.GetByRoleAsync("Librarian");
        return librarians.Select(u => new LibrarianDto
        {
            Id = u.Id ?? string.Empty,
            Name = u.FullName ?? u.Username,
            Email = u.Email ?? u.Username,
            Role = u.Role,
            IsActive = u.IsActive,
            CreatedAt = u.CreatedAt.ToString("yyyy-MM-dd")
        }).ToList();
    }

    public async Task<LibrarianDto> ToggleLibrarianStatusAsync(string id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null || !user.Role.Equals("Librarian", StringComparison.OrdinalIgnoreCase))
            throw new KeyNotFoundException("Librarian not found.");

        user.IsActive = !user.IsActive;
        await _userRepository.UpdateAsync(id, user);

        return new LibrarianDto
        {
            Id = user.Id ?? string.Empty,
            Name = user.FullName ?? user.Username,
            Email = user.Email ?? user.Username,
            Role = user.Role,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt.ToString("yyyy-MM-dd")
        };
    }

    public async Task DeleteLibrarianAsync(string id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null || !user.Role.Equals("Librarian", StringComparison.OrdinalIgnoreCase))
            throw new KeyNotFoundException("Librarian not found.");

        await _userRepository.DeleteAsync(id);
    }

    private string GenerateJwtToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id ?? string.Empty),
            new(ClaimTypes.Name, user.Username),
            new(ClaimTypes.Role, user.Role),
            new("fullName", user.FullName ?? user.Username),
            new("email", user.Email ?? string.Empty)
        };

        if (!string.IsNullOrEmpty(user.MemberId))
        {
            claims.Add(new("memberId", user.MemberId));
        }

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
