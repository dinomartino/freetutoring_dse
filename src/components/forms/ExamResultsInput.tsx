"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EXAM_TYPES, getGradesByExamType, getSubjectsByExamType } from "@/types";
import type { ExamResult } from "@/types";
import { X } from "lucide-react";

interface ExamResultsInputProps {
  value: ExamResult[];
  onChange: (results: ExamResult[]) => void;
  error?: string;
}

export function ExamResultsInput({ value, onChange, error }: ExamResultsInputProps) {
  const [selectedExamType, setSelectedExamType] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedGrade, setSelectedGrade] = useState<string>("");

  const addResult = () => {
    if (!selectedExamType || !selectedSubject || !selectedGrade) {
      alert("請填寫所有欄位");
      return;
    }

    // Check if this exam type + subject combination already exists
    if (value.some((r) => r.examType === selectedExamType && r.subject === selectedSubject)) {
      alert("此考試科目已添加");
      return;
    }

    const newResult: ExamResult = {
      examType: selectedExamType,
      subject: selectedSubject,
      grade: selectedGrade,
    };

    onChange([...value, newResult]);
    setSelectedSubject("");
    setSelectedGrade("");
  };

  const removeResult = (examType: string, subject: string) => {
    onChange(value.filter((r) => !(r.examType === examType && r.subject === subject)));
  };

  const getGradeColor = (examType: string, grade: string) => {
    // HKDSE grading
    if (examType === "HKDSE") {
      if (grade === "5**" || grade === "5*") return "bg-yellow-500 hover:bg-yellow-600";
      if (grade === "5" || grade === "4") return "bg-green-500 hover:bg-green-600";
      if (grade === "3" || grade === "2") return "bg-blue-500 hover:bg-blue-600";
      return "bg-gray-500 hover:bg-gray-600";
    }

    // A-Level, GCSE/IGCSE, HKCEE, HKALE grading
    if (["A-Level", "GCSE/IGCSE", "HKCEE", "HKALE"].includes(examType)) {
      if (grade === "A*" || grade === "A") return "bg-yellow-500 hover:bg-yellow-600";
      if (grade === "B" || grade === "C") return "bg-green-500 hover:bg-green-600";
      if (grade === "D" || grade === "E") return "bg-blue-500 hover:bg-blue-600";
      return "bg-gray-500 hover:bg-gray-600";
    }

    // IB grading
    if (examType === "IB") {
      const numGrade = parseInt(grade);
      if (numGrade >= 6) return "bg-yellow-500 hover:bg-yellow-600";
      if (numGrade >= 4) return "bg-green-500 hover:bg-green-600";
      return "bg-blue-500 hover:bg-blue-600";
    }

    return "bg-gray-500 hover:bg-gray-600";
  };

  const availableSubjects = selectedExamType ? getSubjectsByExamType(selectedExamType) : [];
  const availableGrades = selectedExamType ? getGradesByExamType(selectedExamType) : [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">考試類型</label>
          <select
            value={selectedExamType}
            onChange={(e) => {
              setSelectedExamType(e.target.value);
              setSelectedSubject(""); // Reset subject when exam type changes
              setSelectedGrade(""); // Reset grade when exam type changes
            }}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">選擇考試</option>
            {EXAM_TYPES.map((exam) => (
              <option key={exam.value} value={exam.value}>
                {exam.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">科目名稱</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={!selectedExamType}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">選擇科目</option>
            {availableSubjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">成績</label>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            disabled={!selectedExamType}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">選擇等級</option>
            {availableGrades.map((grade) => (
              <option key={grade} value={grade}>
                {grade === "ungraded" ? "未評級" : grade}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium invisible">添加</label>
          <Button
            type="button"
            onClick={addResult}
            disabled={!selectedExamType || !selectedSubject || !selectedGrade}
            className="w-full h-10"
          >
            添加
          </Button>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {value.length > 0 && (
        <Card className="p-4">
          <h4 className="text-sm font-medium mb-3">已添加的考試成績：</h4>
          <div className="space-y-2">
            {value.map((result, index) => (
              <div
                key={`${result.examType}-${result.subject}-${index}`}
                className="flex items-center justify-between p-2 bg-muted rounded-md"
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge variant="outline" className="font-normal">
                    {EXAM_TYPES.find(e => e.value === result.examType)?.label.split(" ")[0] || result.examType}
                  </Badge>
                  <span className="text-sm font-medium">{result.subject}</span>
                  <Badge className={`${getGradeColor(result.examType, result.grade)} text-white`}>
                    {result.grade === "ungraded" ? "未評級" : result.grade}
                  </Badge>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeResult(result.examType, result.subject)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            已添加 {value.length} 個科目成績
          </p>
        </Card>
      )}

      {value.length === 0 && (
        <p className="text-sm text-muted-foreground">
          還未添加任何考試成績。如您有公開考試成績（HKDSE、HKCEE、A-Level 等），請添加以增加您的競爭力。
        </p>
      )}
    </div>
  );
}
