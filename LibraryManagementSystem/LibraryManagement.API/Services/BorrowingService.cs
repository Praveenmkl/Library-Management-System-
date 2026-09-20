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
        var book = await _bookService.GetByIdAsync(borrowing.BookId);
        if (book == null)
            throw new Exception("Book not found.");

        if (book.AvailableCopies <= 0)
            throw new Exception("Book is not available for borrowing.");

        Member? member = null;
        if (!string.IsNullOrEmpty(borrowing.MemberId))
        {
            member = await _memberService.GetByIdAsync(borrowing.MemberId);
        }

        if (member == null)
        {
            var allMembers = await _memberService.GetAllAsync();
            member = allMembers.FirstOrDefault(m => 
                m.Id == borrowing.MemberId || 
                string.Equals(m.Email, borrowing.MemberId, StringComparison.OrdinalIgnoreCase) || 
                string.Equals(m.Name, borrowing.MemberId, StringComparison.OrdinalIgnoreCase));
        }

        if (member == null && !string.IsNullOrEmpty(borrowing.MemberId))
        {
            member = new Member
            {
                Name = borrowing.MemberId,
                Email = borrowing.MemberId.Contains("@") ? borrowing.MemberId : $"{borrowing.MemberId}@student.edu",
                Phone = "+1 555-0100",
                Address = "Campus Quad",
                IsActive = true,
                RegisteredAt = DateTime.UtcNow
            };
            await _memberService.CreateAsync(member);
        }

        if (member == null)
            throw new Exception("Member not found.");

        if (!member.IsActive)
            throw new Exception("Member is not active.");

        borrowing.MemberId = member.Id!;

        // Set default values
        borrowing.BorrowedAt = DateTime.UtcNow;
        borrowing.DueDate = DateTime.UtcNow.AddDays(14); // 14 days default
        borrowing.Status = "Borrowed";

        await _borrowingRepository.CreateAsync(borrowing);

        // Update book available copies
        book.AvailableCopies -= 1;
        await _bookService.UpdateAsync(book.Id!, book);

        return borrowing;
    }

    public async Task<Borrowing> ReturnBookAsync(string id)
    {
        var borrowing = await _borrowingRepository.GetByIdAsync(id);
        if (borrowing == null)
            throw new Exception("Borrowing record not found.");

        if (borrowing.Status == "Returned")
            throw new Exception("Book has already been returned.");

        borrowing.ReturnedAt = DateTime.UtcNow;
        borrowing.Status = "Returned";

        // Calculate fine (e.g., $1 per day late)
        if (borrowing.ReturnedAt > borrowing.DueDate)
        {
            var lateDays = (borrowing.ReturnedAt.Value - borrowing.DueDate).Days;
            if (lateDays > 0)
            {
                borrowing.FineAmount = lateDays * 1.0m; // $1 per day
            }
        }

        await _borrowingRepository.UpdateAsync(id, borrowing);

        // Update book available copies
        var book = await _bookService.GetByIdAsync(borrowing.BookId);
        if (book != null)
        {
            book.AvailableCopies += 1;
            await _bookService.UpdateAsync(book.Id!, book);
        }

        return borrowing;
    }
}
