export interface User {
  _id?: string; // Optional if you're generating it server-side
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string; // ISO date string (e.g., "2025-05-25")
  password: string; // e.g., "13:42"
  role: boolean; // Same as above
}