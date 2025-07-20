export interface User {
  id?: string; // Optional if you're generating it server-side
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string; // ISO date string (e.g., "2025-05-25")
  password: string; // e.g., "13:42"
  role: boolean; // Same as above
}

export interface GetUserDTO{
  email: string;
  password: string;
}

export interface SigninUserResponse{
  id: string;
  firstName: string;
  lastName: string;
  role: boolean;
}