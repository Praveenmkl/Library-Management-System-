using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace LibraryManagement.API.Models;

public class Borrowing
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public string BookId { get; set; } = string.Empty;

    public string MemberId { get; set; } = string.Empty;

    public DateTime BorrowedAt { get; set; }

    public DateTime DueDate { get; set; }

    public DateTime? ReturnedAt { get; set; }

    public string Status { get; set; } = "Borrowed";

    public decimal FineAmount { get; set; }
}