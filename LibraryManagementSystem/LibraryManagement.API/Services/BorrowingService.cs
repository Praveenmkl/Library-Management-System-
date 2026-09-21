using LibraryManagement.API.Models;
using LibraryManagement.API.Repositories;

namespace LibraryManagement.API.Services;

public class BorrowingService
{
    private readonly BorrowingRepository _borrowingRepository;
    private readonly BookService _bookService;
    private readonly MemberService _memberService;

    public BorrowingService(
        BorrowingRepository borrowingRepository,
        BookService bookService,
        MemberService memberService)
    {
        _borrowingRepository = borrowingRepository;
        _bookService = bookService;
        _memberService = memberService;
    }

    public async Task<List<Borrowing>> GetAllAsync()
    {
        return await _borrowingRepository.GetAllAsync();
    }

    public async Task<Borrowing?> GetByIdAsync(string id)
    {
        return await _borrowingRepository.GetByIdAsync(id);
    }

    public async Task<Borrowing> BorrowBookAsync(Borrowing borrowing)
    {
        if (string.IsNullOrWhiteSpace(borrowing.BookId))
            throw new ArgumentException("Book ID is required.");
        if (string.IsNullOrWhiteSpace(borrowing.MemberId))
            throw new ArgumentException("Member ID is required.");

        var book = await _bookService.GetByIdAsync(borrowing.BookId);
        if (book == null)
            throw new KeyNotFoundException("Book not found.");

        if (book.AvailableCopies <= 0)
            throw new InvalidOperationException("This book has no available copies left for borrowing.");

        // Find member by ID or by email/username
        Member? member = await _memberService.GetByIdAsync(borrowing.MemberId);
        if (member == null)
        {
            var allMembers = await _memberService.GetAllAsync();
            member = allMembers.FirstOrDefault(m =>
                m.Id == borrowing.MemberId ||
                string.Equals(m.Email, borrowing.MemberId, StringComparison.OrdinalIgnoreCase) ||
                string.Equals(m.Name, borrowing.MemberId, StringComparison.OrdinalIgnoreCase));
        }

        if (member == null)
            throw new KeyNotFoundException("Member record not found. Please ensure the student is registered.");

        if (!member.IsActive)
            throw new InvalidOperationException("Member account is deactivated.");

        borrowing.MemberId = member.Id!;
        borrowing.BorrowedAt = DateTime.UtcNow;
        if (borrowing.DueDate == default)
        {
            borrowing.DueDate = DateTime.UtcNow.AddDays(14);
        }
        borrowing.Status = "Borrowed";
        borrowing.FineAmount = 0;

        await _borrowingRepository.CreateAsync(borrowing);

        // Decrement available copies
        book.AvailableCopies = Math.Max(0, book.AvailableCopies - 1);
        await _bookService.UpdateAsync(book.Id!, book);

        return borrowing;
    }

    public async Task<Borrowing> ReturnBookAsync(string id)
    {
        var borrowing = await _borrowingRepository.GetByIdAsync(id);
        if (borrowing == null)
            throw new KeyNotFoundException("Borrowing record not found.");

        if (borrowing.Status == "Returned")
            throw new InvalidOperationException("This book loan has already been marked as returned.");

        borrowing.ReturnedAt = DateTime.UtcNow;
        borrowing.Status = "Returned";

        // Accurate late day calculation based on calendar days
        if (borrowing.ReturnedAt.Value.Date > borrowing.DueDate.Date)
        {
            var lateDays = (borrowing.ReturnedAt.Value.Date - borrowing.DueDate.Date).Days;
            if (lateDays > 0)
            {
                borrowing.FineAmount = lateDays * 1.0m; // $1.00 fine per day overdue
            }
        }

        await _borrowingRepository.UpdateAsync(id, borrowing);

        // Increment available copies
        var book = await _bookService.GetByIdAsync(borrowing.BookId);
        if (book != null)
        {
            book.AvailableCopies = Math.Min(book.TotalCopies, book.AvailableCopies + 1);
            await _bookService.UpdateAsync(book.Id!, book);
        }

        return borrowing;
    }
}
