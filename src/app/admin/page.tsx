'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

interface StudentProfile {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  gradeLevel: string;
  subjectsNeeded: string[];
  specialNeedsDescription: string;
  verificationDocuments: string[];
  verificationStatus: string;
  verificationNotes: string | null;
  email: string;
  createdAt: string;
}

interface TutorProfile {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  educationLevel: string;
  subjectsTaught: string[];
  bio: string;
  availability: any;
  examResults: any;
  verificationDocuments: string[];
  verificationStatus: string;
  verificationNotes: string | null;
  email: string;
  createdAt: string;
}

interface VerificationData {
  students: StudentProfile[];
  tutors: TutorProfile[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<VerificationData>({ students: [], tutors: [] });
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'students' | 'tutors'>('students');

  const handleViewDocument = async (documentUrl: string) => {
    try {
      // Request a signed URL from the backend
      const response = await fetch('/api/documents/signed-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentUrl }),
      });

      if (response.ok) {
        const { signedUrl } = await response.json();
        // Open the signed URL in a new tab
        window.open(signedUrl, '_blank');
      } else {
        alert('無法載入文件');
      }
    } catch (error) {
      console.error('Error viewing document:', error);
      alert('載入文件時發生錯誤');
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      const response = await fetch('/api/admin/verifications?status=PENDING');
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (profileId: string, profileType: 'student' | 'tutor', action: 'approve' | 'reject') => {
    try {
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId,
          profileType,
          action,
          notes: notes || null,
        }),
      });

      if (response.ok) {
        alert(action === 'approve' ? '已批准' : '已拒絕');
        setSelectedProfile(null);
        setNotes('');
        fetchVerifications();
      } else {
        alert('操作失敗');
      }
    } catch (error) {
      console.error('Error verifying:', error);
      alert('操作失敗');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">載入中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">驗證管理</h2>
        <p className="text-gray-600 mt-2">審核學生和導師的註冊申請</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('students')}
          className={`pb-4 px-4 font-medium ${
            activeTab === 'students'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          學生申請 ({data.students.length})
        </button>
        <button
          onClick={() => setActiveTab('tutors')}
          className={`pb-4 px-4 font-medium ${
            activeTab === 'tutors'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          導師申請 ({data.tutors.length})
        </button>
      </div>

      {/* Student List */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          {data.students.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                暫無待審核的學生申請
              </CardContent>
            </Card>
          ) : (
            data.students.map((student) => (
              <Card key={student.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{student.fullName}</CardTitle>
                      <CardDescription>{student.email}</CardDescription>
                    </div>
                    <Badge variant="secondary">{student.gradeLevel}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-700">電話</p>
                      <p className="text-gray-600">{student.phone}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">需要科目</p>
                      <p className="text-gray-600">{student.subjectsNeeded.join(', ')}</p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-gray-700 mb-1">特殊需求描述</p>
                    <p className="text-gray-600 text-sm">{student.specialNeedsDescription}</p>
                  </div>

                  <div>
                    <p className="font-medium text-gray-700 mb-2">驗證文件</p>
                    <div className="space-y-2">
                      {student.verificationDocuments.map((doc, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleViewDocument(doc)}
                          className="block text-sm text-blue-600 hover:underline cursor-pointer text-left"
                        >
                          文件 {idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedProfile?.id === student.id ? (
                    <div className="space-y-3 border-t pt-4">
                      <Textarea
                        placeholder="備註（選填）"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                      />
                      <div className="flex space-x-3">
                        <Button
                          onClick={() => handleVerify(student.id, 'student', 'approve')}
                          className="flex-1"
                        >
                          批准
                        </Button>
                        <Button
                          onClick={() => handleVerify(student.id, 'student', 'reject')}
                          variant="outline"
                          className="flex-1"
                        >
                          拒絕
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedProfile(null);
                            setNotes('');
                          }}
                          variant="outline"
                        >
                          取消
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setSelectedProfile(student)}
                      className="w-full"
                    >
                      開始審核
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Tutor List */}
      {activeTab === 'tutors' && (
        <div className="space-y-4">
          {data.tutors.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                暫無待審核的導師申請
              </CardContent>
            </Card>
          ) : (
            data.tutors.map((tutor) => (
              <Card key={tutor.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{tutor.fullName}</CardTitle>
                      <CardDescription>{tutor.email}</CardDescription>
                    </div>
                    <Badge variant="secondary">{tutor.educationLevel}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-700">電話</p>
                      <p className="text-gray-600">{tutor.phone}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">可教科目</p>
                      <p className="text-gray-600">{tutor.subjectsTaught.join(', ')}</p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-gray-700 mb-1">個人簡介</p>
                    <p className="text-gray-600 text-sm">{tutor.bio}</p>
                  </div>

                  {tutor.examResults && Array.isArray(tutor.examResults) && tutor.examResults.length > 0 && (
                    <div>
                      <p className="font-medium text-gray-700 mb-2">考試成績</p>
                      <div className="space-y-1">
                        {tutor.examResults.map((result: any, idx: number) => (
                          <p key={idx} className="text-sm text-gray-600">
                            {result.examType} - {result.subject}: {result.grade}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="font-medium text-gray-700 mb-2">驗證文件</p>
                    <div className="space-y-2">
                      {tutor.verificationDocuments.map((doc, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleViewDocument(doc)}
                          className="block text-sm text-blue-600 hover:underline cursor-pointer text-left"
                        >
                          文件 {idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedProfile?.id === tutor.id ? (
                    <div className="space-y-3 border-t pt-4">
                      <Textarea
                        placeholder="備註（選填）"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                      />
                      <div className="flex space-x-3">
                        <Button
                          onClick={() => handleVerify(tutor.id, 'tutor', 'approve')}
                          className="flex-1"
                        >
                          批准
                        </Button>
                        <Button
                          onClick={() => handleVerify(tutor.id, 'tutor', 'reject')}
                          variant="outline"
                          className="flex-1"
                        >
                          拒絕
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedProfile(null);
                            setNotes('');
                          }}
                          variant="outline"
                        >
                          取消
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setSelectedProfile(tutor)}
                      className="w-full"
                    >
                      開始審核
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
