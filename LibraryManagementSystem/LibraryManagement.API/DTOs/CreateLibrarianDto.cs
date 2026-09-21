namespace LibraryManagement.API.DTOs;

public class CreateLibrarianDto
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LibrarianDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = "Librarian";
    public bool IsActive { get; set; } = true;
    public string CreatedAt { get; set; } = string.Empty;
}
