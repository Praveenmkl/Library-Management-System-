export interface UserDto {
  username: string;
  password: string;
  fullName?: string;
  email?: string;
  role?: string;
}

export interface RegisterStudentDto {
  username?: string;
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  message?: string;
  user: {
    id: string;
    username: string;
    role: string;
    fullName: string;
    email: string;
    memberId: string;
  };
}

export interface LibrarianAccount {
  id: string;
  name: string;
  email: string;
  role: 'Librarian' | string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateLibrarianDto {
  name: string;
  email: string;
  password: string;
}

export interface UserSession {
  username: string;
  role: string;
  token: string;
}
