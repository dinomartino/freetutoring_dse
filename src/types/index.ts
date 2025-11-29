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

export interface ExamResult {
  examType: string; // HKDSE, IGCSE, A-Level, IB, SAT, AP
  subject: string;
  grade: string;
}

export interface TimeSlot {
  start: string; // HH:MM format
  end: string;   // HH:MM format
}

export interface WeeklyAvailability {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

export interface TutorProfile {
  id: string;
  userId: string;
  fullName: string;
  educationLevel: string;
  subjectsTaught: string[];
  availability: WeeklyAvailability;
  bio: string;
  examResults?: ExamResult[];
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
  // 幼稚園
  "幼稚園 K1",
  "幼稚園 K2",
  "幼稚園 K3",
  // 小學
  "小學 P1",
  "小學 P2",
  "小學 P3",
  "小學 P4",
  "小學 P5",
  "小學 P6",
  // 中學
  "中學 S1",
  "中學 S2",
  "中學 S3",
  "中學 S4",
  "中學 S5",
  "中學 S6",
  // 大專
  "大專",
] as const;

export const EDUCATION_LEVELS = [
  "中學文憑",
  "副學士學位",
  "學士學位",
  "碩士學位",
  "博士學位",
  "專業資格證書",
] as const;

// 小學科目
export const PRIMARY_SUBJECTS = [
  // 核心科目
  "中國語文",
  "英國語文",
  "數學",
  "常識",
  "科學科",
  "人文科",
  // 其他科目
  "音樂",
  "視覺藝術",
  "體育",
  "電腦（資訊科技）",
  "普通話",
] as const;

// 中學科目
export const SECONDARY_SUBJECTS = [
  // 核心科目
  "中國語文",
  "英國語文",
  "數學",
  "公民與社會發展",
  // 選修科目 - 文學
  "中國文學",
  "英語文學",
  // 選修科目 - 人文
  "中國歷史",
  "經濟",
  "倫理與宗教",
  "地理",
  "歷史",
  "旅遊與款待",
  // 選修科目 - 科學
  "生物",
  "化學",
  "物理",
  // 選修科目 - 商業/科技
  "企業、會計與財務概論",
  "設計與應用科技",
  "健康管理與社會關懷",
  "資訊及通訊科技",
  "科技與生活",
  // 選修科目 - 藝術/體育
  "音樂",
  "視覺藝術",
  "體育",
] as const;

// 通用科目（適用於幼稚園和大專）
export const COMMON_SUBJECTS = [
  // 語言
  "中文",
  "英文",
  "普通話",
  // 數學/科學
  "數學",
  "物理",
  "化學",
  "生物",
  // 人文
  "歷史",
  "地理",
  // 藝術
  "音樂",
  "美術",
  // 其他
  "電腦",
  "體育",
  "考試準備",
  "學習技巧",
  "特殊教育",
] as const;

// HKDSE 科目
export const HKDSE_SUBJECTS = [
  // 核心科目 (4科)
  "中國語文",
  "英國語文",
  "數學（必修部分）",
  "公民與社會發展",

  // 選修科目 - 延伸數學
  "數學（延伸部分 - 單元一）",
  "數學（延伸部分 - 單元二）",

  // 選修科目 - 科學
  "物理",
  "化學",
  "生物",
  "組合科學",
  "綜合科學",

  // 選修科目 - 人文
  "中國歷史",
  "歷史",
  "地理",
  "經濟",
  "倫理與宗教",
  "旅遊與款待",

  // 選修科目 - 商業
  "企業、會計與財務概論",

  // 選修科目 - 科技
  "資訊及通訊科技",
  "設計與應用科技",
  "健康管理與社會關懷",
  "科技與生活",

  // 選修科目 - 藝術
  "視覺藝術",
  "音樂",
  "體育",

  // 選修科目 - 語言
  "中國文學",
  "英語文學",
] as const;

// HKDSE 成績等級
export const HKDSE_LEVELS = [
  "5**",
  "5*",
  "5",
  "4",
  "3",
  "2",
  "1",
  "ungraded",
] as const;

// HKCEE 成績等級 (香港中學會考)
export const HKCEE_GRADES = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "U",
] as const;

// HKALE 成績等級 (香港高級程度會考)
export const HKALE_GRADES = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "U",
] as const;

// Exam Types
export const EXAM_TYPES = [
  { value: "HKDSE", label: "HKDSE (香港中學文憑)" },
  { value: "HKCEE", label: "HKCEE (香港中學會考)" },
  { value: "HKALE", label: "HKALE (香港高級程度會考)" },
  { value: "A-Level", label: "A-Level (英國高級程度會考)" },
  { value: "GCSE/IGCSE", label: "GCSE/IGCSE (英國普通中學教育文憑)" },
  { value: "IB", label: "IB (國際文憑)" },
] as const;

// IGCSE/GCSE Grades
export const IGCSE_GRADES = [
  "A*",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "U",
] as const;

// A-Level Grades
export const A_LEVEL_GRADES = [
  "A*",
  "A",
  "B",
  "C",
  "D",
  "E",
  "U",
] as const;

// IB Grades (out of 7)
export const IB_GRADES = [
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
  "1",
] as const;

// HKCEE 科目 (香港中學會考)
export const HKCEE_SUBJECTS = [
  // 必修科目
  "中國語文",
  "英國語文",
  "數學",
  // 選修科目 - 科學
  "物理",
  "化學",
  "生物",
  "綜合科學",
  "人類生物學",
  // 選修科目 - 人文
  "中國歷史",
  "歷史",
  "地理",
  "經濟及公共事務",
  "政府及公共事務",
  // 選修科目 - 商業
  "會計學原理",
  "商業學",
  "經濟",
  // 選修科目 - 語言
  "中國文學",
  "英國文學",
  // 選修科目 - 其他
  "電腦",
  "設計與科技",
  "家政",
  "音樂",
  "視覺藝術",
  "體育",
  "宗教",
  "普通話",
] as const;

// HKALE 科目 (香港高級程度會考)
export const HKALE_SUBJECTS = [
  // AS 科目
  "中國語文及文化",
  "英語運用",
  // AL 科目 - 語言
  "中國文學",
  "英國文學",
  // AL 科目 - 科學
  "純粹數學",
  "應用數學",
  "物理",
  "化學",
  "生物",
  // AL 科目 - 人文
  "中國歷史",
  "歷史",
  "地理",
  "經濟",
  "政府及公共事務",
  // AL 科目 - 商業
  "會計學原理",
  "企業概論",
  // AL 科目 - 其他
  "電腦應用",
  "美術",
  "音樂",
] as const;

// A-Level 科目
export const A_LEVEL_SUBJECTS = [
  // Core subjects
  "Mathematics",
  "Further Mathematics",
  "English Language",
  "English Literature",
  // Sciences
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  // Humanities
  "History",
  "Geography",
  "Economics",
  "Politics",
  "Psychology",
  "Sociology",
  // Business
  "Business Studies",
  "Accounting",
  // Languages
  "Chinese",
  "French",
  "German",
  "Spanish",
  // Arts
  "Art & Design",
  "Music",
  "Drama & Theatre",
  // Other
  "Philosophy",
  "Religious Studies",
  "Physical Education",
] as const;

// GCSE/IGCSE 科目
export const GCSE_SUBJECTS = [
  // Core subjects
  "English Language",
  "English Literature",
  "Mathematics",
  "Science (Double Award)",
  "Science (Single Award)",
  // Separate Sciences
  "Biology",
  "Chemistry",
  "Physics",
  // Humanities
  "History",
  "Geography",
  "Religious Studies",
  // Languages
  "Chinese",
  "French",
  "German",
  "Spanish",
  // Arts
  "Art & Design",
  "Music",
  "Drama",
  // Technology
  "Computer Science",
  "Design & Technology",
  "Food Preparation & Nutrition",
  // Business & Social
  "Business Studies",
  "Economics",
  "Psychology",
  "Sociology",
  // Other
  "Physical Education",
] as const;

// IB 科目
export const IB_SUBJECTS = [
  // Group 1: Language & Literature
  "English A: Language & Literature",
  "Chinese A: Language & Literature",
  // Group 2: Language Acquisition
  "English B",
  "Chinese B",
  "French B",
  "Spanish B",
  "Mandarin ab initio",
  // Group 3: Individuals & Societies
  "Economics",
  "Business Management",
  "Psychology",
  "History",
  "Geography",
  "Global Politics",
  // Group 4: Sciences
  "Biology",
  "Chemistry",
  "Physics",
  "Computer Science",
  "Design Technology",
  "Environmental Systems & Societies",
  // Group 5: Mathematics
  "Mathematics: Analysis & Approaches",
  "Mathematics: Applications & Interpretation",
  // Group 6: The Arts
  "Visual Arts",
  "Music",
  "Theatre",
  "Film",
] as const;

// Helper function to get subjects by exam type
export const getSubjectsByExamType = (examType: string): readonly string[] => {
  switch (examType) {
    case "HKDSE":
      return HKDSE_SUBJECTS;
    case "HKCEE":
      return HKCEE_SUBJECTS;
    case "HKALE":
      return HKALE_SUBJECTS;
    case "A-Level":
      return A_LEVEL_SUBJECTS;
    case "GCSE/IGCSE":
      return GCSE_SUBJECTS;
    case "IB":
      return IB_SUBJECTS;
    default:
      return [];
  }
};

// Helper function to get grades by exam type
export const getGradesByExamType = (examType: string): readonly string[] => {
  switch (examType) {
    case "HKDSE":
      return HKDSE_LEVELS;
    case "HKCEE":
      return HKCEE_GRADES;
    case "HKALE":
      return HKALE_GRADES;
    case "A-Level":
      return A_LEVEL_GRADES;
    case "GCSE/IGCSE":
      return IGCSE_GRADES;
    case "IB":
      return IB_GRADES;
    default:
      return [];
  }
};
