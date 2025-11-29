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
import { GRADE_LEVELS, PRIMARY_SUBJECTS, SECONDARY_SUBJECTS, COMMON_SUBJECTS } from "@/types";

const studentRegistrationSchema = z.object({
  fullName: z.string().min(2, "姓名至少需要2個字符"),
  email: z.string().email("請輸入有效的電子郵件地址"),
  password: z.string().min(6, "密碼至少需要6個字符"),
  phone: z.string().min(8, "請輸入有效的電話號碼"),
  gradeLevel: z.string().min(1, "請選擇年級"),
  subjectsNeeded: z.array(z.string()).min(1, "請至少選擇一個科目"),
  specialNeedsDescription: z.string().min(10, "請詳細描述您的特殊需要（至少10個字符）"),
  verificationDocuments: z.any().optional(),
});

type StudentRegistrationForm = z.infer<typeof studentRegistrationSchema>;

export default function StudentRegister() {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedGradeLevel, setSelectedGradeLevel] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get subjects based on selected grade level
  const getAvailableSubjects = () => {
    if (selectedGradeLevel.includes("小學")) {
      return PRIMARY_SUBJECTS;
    } else if (selectedGradeLevel.includes("中學")) {
      return SECONDARY_SUBJECTS;
    } else {
      return COMMON_SUBJECTS;
    }
  };

  const availableSubjects = getAvailableSubjects();

  // Get grade category for display
  const getGradeCategory = () => {
    if (selectedGradeLevel.includes("小學")) return "小學科目";
    if (selectedGradeLevel.includes("中學")) return "中學科目";
    if (selectedGradeLevel.includes("幼稚園")) return "幼稚園科目";
    if (selectedGradeLevel.includes("大專")) return "大專科目";
    return "通用科目";
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<StudentRegistrationForm>({
    resolver: zodResolver(studentRegistrationSchema),
  });

  const toggleSubject = (subject: string) => {
    const newSubjects = selectedSubjects.includes(subject)
      ? selectedSubjects.filter((s) => s !== subject)
      : [...selectedSubjects, subject];

    setSelectedSubjects(newSubjects);
    setValue("subjectsNeeded", newSubjects);
  };

  const onSubmit = async (data: StudentRegistrationForm) => {
    setIsSubmitting(true);

    try {
      // Step 1: Register student and get userId
      const registerResponse = await fetch('/api/auth/register/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          fullName: data.fullName,
          phone: data.phone,
          gradeLevel: data.gradeLevel,
          subjectsNeeded: data.subjectsNeeded,
          specialNeedsDescription: data.specialNeedsDescription,
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
        formData.append('fileType', 'student');

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
          // Step 3: Update student profile with document URLs
          await fetch('/api/auth/update-documents', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId,
              userType: 'student',
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
          <Badge variant="secondary" className="mb-4">學生註冊</Badge>
          <h1 className="text-4xl font-bold mb-2">學生註冊</h1>
          <p className="text-muted-foreground">填寫以下資料以申請成為學生用戶</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>個人資料</CardTitle>
            <CardDescription>請如實填寫您的個人資料</CardDescription>
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

              {/* Grade Level */}
              <div className="space-y-2">
                <Label htmlFor="gradeLevel">年級 *</Label>
                <select
                  id="gradeLevel"
                  {...register("gradeLevel")}
                  onChange={(e) => {
                    setSelectedGradeLevel(e.target.value);
                    setSelectedSubjects([]); // Clear selected subjects when grade changes
                    setValue("subjectsNeeded", []);
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">請選擇年級</option>
                  {GRADE_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                {errors.gradeLevel && (
                  <p className="text-sm text-destructive">{errors.gradeLevel.message}</p>
                )}
              </div>

              {/* Subjects Needed */}
              <div className="space-y-2">
                <Label>需要補習的科目 *</Label>
                {selectedGradeLevel && (
                  <p className="text-xs text-muted-foreground mb-2">
                    {getGradeCategory()}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {availableSubjects.map((subject) => (
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
                {errors.subjectsNeeded && (
                  <p className="text-sm text-destructive">{errors.subjectsNeeded.message}</p>
                )}
              </div>

              {/* Special Needs Description */}
              <div className="space-y-2">
                <Label htmlFor="specialNeedsDescription">特殊需要說明 *</Label>
                <Textarea
                  id="specialNeedsDescription"
                  {...register("specialNeedsDescription")}
                  placeholder="請詳細描述您的特殊需要，例如：學習障礙類型、所需支援等"
                  rows={5}
                />
                {errors.specialNeedsDescription && (
                  <p className="text-sm text-destructive">
                    {errors.specialNeedsDescription.message}
                  </p>
                )}
              </div>

              {/* Verification Documents */}
              <div className="space-y-2">
                <Label htmlFor="verificationDocuments">驗證文件 *</Label>
                <Input
                  id="verificationDocuments"
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  {...register("verificationDocuments")}
                />
                <p className="text-sm text-muted-foreground">
                  請上傳相關證明文件（如：IEP、醫生證明、學校信件等）
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
