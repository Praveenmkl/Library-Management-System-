namespace LibraryManagement.API.DTOs;

public class BorrowRequestDto
{
    public string BookId { get; set; } = string.Empty;
    public string MemberId { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
}
