"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ExamResultsInput } from "@/components/forms/ExamResultsInput";
import { AvailabilityInput } from "@/components/forms/AvailabilityInput";
import type { WeeklyAvailability } from "@/components/forms/AvailabilityInput";
import { EDUCATION_LEVELS, PRIMARY_SUBJECTS, SECONDARY_SUBJECTS, COMMON_SUBJECTS } from "@/types";
import type { ExamResult } from "@/types";

const tutorRegistrationSchema = z.object({
  fullName: z.string().min(2, "姓名至少需要2個字符"),
  email: z.string().email("請輸入有效的電子郵件地址"),
  password: z.string().min(6, "密碼至少需要6個字符"),
  phone: z.string().min(8, "請輸入有效的電話號碼"),
  educationLevel: z.string().min(1, "請選擇教育程度"),
  subjectsTaught: z.array(z.string()).min(1, "請至少選擇一個科目"),
  bio: z.string().min(20, "個人簡介至少需要20個字符"),
  availability: z.object({
    monday: z.array(z.object({ start: z.string(), end: z.string() })),
    tuesday: z.array(z.object({ start: z.string(), end: z.string() })),
    wednesday: z.array(z.object({ start: z.string(), end: z.string() })),
    thursday: z.array(z.object({ start: z.string(), end: z.string() })),
    friday: z.array(z.object({ start: z.string(), end: z.string() })),
    saturday: z.array(z.object({ start: z.string(), end: z.string() })),
    sunday: z.array(z.object({ start: z.string(), end: z.string() })),
  }).refine(
    (data) => {
      // Check if at least one day has at least one valid time slot
      const hasAtLeastOneSlot = Object.values(data).some(
        (slots) => slots.length > 0 && slots.some(slot => slot.start && slot.end)
      );
      return hasAtLeastOneSlot;
    },
    { message: "請至少設定一個可用時段" }
  ),
  examResults: z.array(z.object({
    examType: z.string(),
    subject: z.string(),
    grade: z.string(),
  })).optional(),
  verificationDocuments: z.any().optional(),
});

type TutorRegistrationForm = z.infer<typeof tutorRegistrationSchema>;

const initialAvailability: WeeklyAvailability = {
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: [],
};

export default function TutorRegister() {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [availability, setAvailability] = useState<WeeklyAvailability>(initialAvailability);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TutorRegistrationForm>({
    resolver: zodResolver(tutorRegistrationSchema),
  });

  const toggleSubject = (subject: string) => {
    const newSubjects = selectedSubjects.includes(subject)
      ? selectedSubjects.filter((s) => s !== subject)
      : [...selectedSubjects, subject];

    setSelectedSubjects(newSubjects);
    setValue("subjectsTaught", newSubjects);
  };

  const handleExamResultsChange = (results: ExamResult[]) => {
    setExamResults(results);
    setValue("examResults", results);
  };

  const handleAvailabilityChange = (newAvailability: WeeklyAvailability) => {
    setAvailability(newAvailability);
    setValue("availability", newAvailability);
  };

  const onSubmit = async (data: TutorRegistrationForm) => {
    setIsSubmitting(true);

    try {
      // Step 1: Register user and get userId
      const registerResponse = await fetch('/api/auth/register/tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          fullName: data.fullName,
          phone: data.phone,
          educationLevel: data.educationLevel,
          subjectsTaught: data.subjectsTaught,
          bio: data.bio,
          availability: data.availability,
          examResults: examResults.length > 0 ? examResults : undefined,
          verificationDocuments: [], // Will be updated after file upload
        }),
      });

      const registerResult = await registerResponse.json();

      if (!registerResponse.ok) {
        alert(`註冊失敗：${registerResult.error}`);
        return;
      }

      const userId = registerResult.userId;

      // Step 2: Upload verification documents if any
      const fileInput = document.getElementById('verificationDocuments') as HTMLInputElement;
      if (fileInput && fileInput.files && fileInput.files.length > 0) {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('fileType', 'tutor');

        for (let i = 0; i < fileInput.files.length; i++) {
          formData.append('files', fileInput.files[i]);
        }

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok) {
          console.error('File upload failed:', uploadResult.error);
          alert(`註冊成功，但文件上傳失敗：${uploadResult.error}。請稍後在個人資料中上傳。`);
        } else {
          // Step 3: Update user profile with document URLs
          await fetch('/api/auth/update-documents', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId,
              userType: 'tutor',
              documentUrls: uploadResult.urls,
            }),
          });
        }
      }

      alert("註冊成功！請查收驗證郵件。我們會在 3-5 個工作天內審核您的申請。");
      window.location.href = '/';
    } catch (error) {
      console.error('Registration error:', error);
      alert('註冊過程發生錯誤，請稍後重試。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4">導師註冊</Badge>
          <h1 className="text-4xl font-bold mb-2">導師註冊</h1>
          <p className="text-muted-foreground">填寫以下資料以申請成為義教導師</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>個人資料</CardTitle>
            <CardDescription>請如實填寫您的個人資料及教學背景</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">全名 *</Label>
                <Input
                  id="fullName"
                  {...register("fullName")}
                  placeholder="請輸入您的全名"
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">電子郵件 *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="example@email.com"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">密碼 *</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="至少6個字符"
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">聯絡電話 *</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                  placeholder="12345678"
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>

              {/* Education Level */}
              <div className="space-y-2">
                <Label htmlFor="educationLevel">教育程度 *</Label>
                <select
                  id="educationLevel"
                  {...register("educationLevel")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">請選擇教育程度</option>
                  {EDUCATION_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                {errors.educationLevel && (
                  <p className="text-sm text-destructive">{errors.educationLevel.message}</p>
                )}
              </div>

              {/* Subjects Taught */}
              <div className="space-y-2">
                <Label>可教授科目 *</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  選擇您可以教授的科目（可選擇多個）
                </p>

                {/* Primary School Subjects */}
                <div className="space-y-2 p-3 border rounded-md">
                  <h4 className="text-sm font-medium">小學科目</h4>
                  <div className="flex flex-wrap gap-2">
                    {PRIMARY_SUBJECTS.map((subject) => (
                      <Badge
                        key={subject}
                        variant={selectedSubjects.includes(subject) ? "default" : "outline"}
                        className="cursor-pointer hover:opacity-80"
                        onClick={() => toggleSubject(subject)}
                      >
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Secondary School Subjects */}
                <div className="space-y-2 p-3 border rounded-md">
                  <h4 className="text-sm font-medium">中學科目</h4>
                  <div className="flex flex-wrap gap-2">
                    {SECONDARY_SUBJECTS.map((subject) => (
                      <Badge
                        key={subject}
                        variant={selectedSubjects.includes(subject) ? "default" : "outline"}
                        className="cursor-pointer hover:opacity-80"
                        onClick={() => toggleSubject(subject)}
                      >
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Other Subjects */}
                <div className="space-y-2 p-3 border rounded-md">
                  <h4 className="text-sm font-medium">其他科目</h4>
                  <div className="flex flex-wrap gap-2">
                    {["考試準備", "學習技巧", "特殊教育"].map((subject) => (
                      <Badge
                        key={subject}
                        variant={selectedSubjects.includes(subject) ? "default" : "outline"}
                        className="cursor-pointer hover:opacity-80"
                        onClick={() => toggleSubject(subject)}
                      >
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>

                {selectedSubjects.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    已選擇 {selectedSubjects.length} 個科目
                  </p>
                )}

                {errors.subjectsTaught && (
                  <p className="text-sm text-destructive">{errors.subjectsTaught.message}</p>
                )}
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">個人簡介 *</Label>
                <Textarea
                  id="bio"
                  {...register("bio")}
                  placeholder="請介紹您的教學經驗、專長領域、教學風格等"
                  rows={5}
                />
                {errors.bio && (
                  <p className="text-sm text-destructive">{errors.bio.message}</p>
                )}
              </div>

              {/* Availability */}
              <div className="space-y-2">
                <Label>可用時間 *</Label>
                <AvailabilityInput
                  value={availability}
                  onChange={handleAvailabilityChange}
                  error={errors.availability?.message}
                />
              </div>

              {/* Exam Results */}
              <div className="space-y-2">
                <Label>公開考試成績（選填）</Label>
                <ExamResultsInput
                  value={examResults}
                  onChange={handleExamResultsChange}
                  error={errors.examResults?.message}
                />
                <p className="text-sm text-muted-foreground">
                  如您有公開考試成績（HKDSE、HKCEE、A-Level、IB 等），請添加以展示您的學術能力
                </p>
              </div>

              {/* Verification Documents */}
              <div className="space-y-2">
                <Label htmlFor="verificationDocuments">學歷證明文件 *</Label>
                <Input
                  id="verificationDocuments"
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  {...register("verificationDocuments")}
                />
                <p className="text-sm text-muted-foreground">
                  請上傳相關證明文件（如：學歷證書、成績單、專業證照等）
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "提交中..." : "提交註冊"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                >
                  返回
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>* 為必填項目</p>
          <p className="mt-2">提交後，我們的團隊會在 3-5 個工作天內審核您的申請</p>
        </div>
      </div>
    </div>
  );
}
