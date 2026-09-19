export interface Borrowing {
  id?: string;
  bookId: string;
  memberId: string;
  borrowedAt?: string;
  dueDate: string;
  returnedAt?: string | null;
  status: string; // 'Borrowed' | 'Returned' | 'Overdue'
  fineAmount: number;
  
  // Populated UI metadata
  bookTitle?: string;
  memberName?: string;
}
