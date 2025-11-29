export type UserRole = "student" | "tutor" | "admin";

export type VerificationStatus = "pending" | "approved" | "rejected";

export type ConnectionStatus = "pending" | "accepted" | "declined";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentProfile {
  id: string;
  userId: string;
  fullName: string;
  gradeLevel: string;
  subjectsNeeded: string[];
  verificationDocuments: string[];
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  specialNeedsDescription: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TutorProfile {
  id: string;
  userId: string;
  fullName: string;
  educationLevel: string;
  subjectsTaught: string[];
  availability: Record<string, string[]>;
  bio: string;
  verificationDocuments: string[];
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  photoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConnectionRequest {
  id: string;
  studentId: string;
  tutorId: string;
  status: ConnectionStatus;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subject {
  id: string;
  name: string;
  category: string;
}

export const GRADE_LEVELS = [
  "Elementary (K-5)",
  "Middle School (6-8)",
  "High School (9-12)",
  "College/University",
  "Adult Education",
] as const;

export const EDUCATION_LEVELS = [
  "High School Diploma",
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD/Doctorate",
  "Professional Certification",
] as const;

export const COMMON_SUBJECTS = [
  // STEM
  "Mathematics",
  "Algebra",
  "Geometry",
  "Calculus",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  // Languages
  "English",
  "Spanish",
  "French",
  "Mandarin",
  // Humanities
  "History",
  "Geography",
  "Social Studies",
  "Literature",
  "Writing",
  // Arts
  "Music",
  "Art",
  // Other
  "Test Preparation",
  "Study Skills",
  "Special Education",
] as const;
