export interface UserDto {
  username: string;
  password: string;
  fullName?: string;
  email?: string;
  role?: string;
}

export interface RegisterStudentDto {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token?: string;
  message?: string;
  id?: string;
  user?: {
    id?: string;
    username?: string;
    role?: string;
  };
}

export interface UserSession {
  username: string;
  role: string;
  token: string;
}
