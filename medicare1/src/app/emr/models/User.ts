export interface DoctorDetails {
  usualStartingTime: string;
  usualEndingTime: string;
  experience: number;
  highestQualifications: string;
  registrationNumber: string;
  registrationAuthority: string;
  registrationDate: string;
  feeForAppointment: number;
}

export interface User {
  _id?: string; // Optional if you're generating it server-side
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string; // ISO date string (e.g., "2025-05-25")
  password: string; // e.g., "13:42"
  role: boolean; // Same as above
  doctorDetails?: DoctorDetails; // Optional, only for doctors
}

export interface GetUserDTO{
  email: string;
  password: string;
}

export interface SigninUserResponse{
  _id: string;
  firstName: string;
}