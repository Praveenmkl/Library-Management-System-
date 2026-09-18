using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace LibraryManagement.API.Models;

public class Book
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Author { get; set; } = string.Empty;

    public string ISBN { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public int TotalCopies { get; set; }

    public int AvailableCopies { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}