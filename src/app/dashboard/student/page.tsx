"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createBrowserClient } from "@supabase/ssr";

interface StudentProfile {
  fullName: string;
  phone: string;
  gradeLevel: string;
  subjectsNeeded: string[];
  specialNeedsDescription: string;
  verificationStatus: string;
  verificationNotes?: string;
}

interface TutorApplication {
  id: string;
  message: string;
  status: string;
  createdAt: string;
  tutor: {
    id: string;
    fullName: string;
    educationLevel: string;
    subjectsTaught: string[];
    bio: string;
  };
}

interface TutoringRequest {
  id: string;
  title: string;
  subjects: string[];
  description: string;
  status: string;
  createdAt: string;
  applications: TutorApplication[];
  selectedTutor?: {
    id: string;
    fullName: string;
    phone: string;
    educationLevel: string;
  };
}

export default function StudentDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [requests, setRequests] = useState<TutoringRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    subjects: [] as string[],
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push('/login');
        return;
      }

      // Fetch profile
      const profileRes = await fetch(`/api/student/profile?userId=${user.id}`);
      const profileData = await profileRes.json();

      if (profileData.error) {
        setError(profileData.error);
        setIsLoading(false);
        return;
      }

      setProfile(profileData.profile);

      // Fetch tutoring requests
      const requestsRes = await fetch('/api/student/requests');
      const requestsData = await requestsRes.json();

      if (!requestsData.error) {
        setRequests(requestsData.requests);
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('載入資料失敗');
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/student/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
      } else {
        alert('補習需求已成功發佈！');
        setFormData({ title: "", subjects: [], description: "" });
        setShowCreateForm(false);
        fetchData(); // Refresh
      }
    } catch (err) {
      alert('發佈失敗，請稍後再試');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptApplication = async (applicationId: string) => {
    if (!confirm('確定要接受這位導師的申請嗎？接受後，其他申請將被自動拒絕。')) {
      return;
    }

    try {
      const res = await fetch(`/api/student/applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'accept' }),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
      } else {
        alert(`已成功配對！導師聯絡資料：${data.tutorContact.fullName} - ${data.tutorContact.phone}`);
        fetchData(); // Refresh
      }
    } catch (err) {
      alert('操作失敗，請稍後再試');
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    if (!confirm('確定要拒絕這位導師的申請嗎？')) {
      return;
    }

    try {
      const res = await fetch(`/api/student/applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject' }),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
      } else {
        alert('已拒絕申請');
        fetchData(); // Refresh
      }
    } catch (err) {
      alert('操作失敗，請稍後再試');
    }
  };

  const handleCloseRequest = async (requestId: string) => {
    if (!confirm('確定要關閉此補習需求嗎？')) {
      return;
    }

    try {
      const res = await fetch(`/api/student/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CLOSED' }),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
      } else {
        alert('已關閉補習需求');
        fetchData();
      }
    } catch (err) {
      alert('操作失敗，請稍後再試');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">載入中...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>錯誤</CardTitle>
            <CardDescription>{error || '無法載入資料'}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push('/')}>返回首頁</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-green-600">已批准</Badge>;
      case "PENDING":
        return <Badge className="bg-yellow-600">審核中</Badge>;
      case "REJECTED":
        return <Badge className="bg-red-600">已拒絕</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRequestStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return <Badge className="bg-green-600">開放申請</Badge>;
      case "MATCHED":
        return <Badge className="bg-purple-600">已配對</Badge>;
      case "CLOSED":
        return <Badge variant="secondary">已關閉</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">學生儀表板</h1>
            <p className="text-muted-foreground">歡迎，{profile.fullName}</p>
          </div>
          <Button onClick={handleLogout} variant="outline">登出</Button>
        </div>

        {/* Profile Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>個人資料</CardTitle>
              {getStatusBadge(profile.verificationStatus)}
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">姓名</p>
                <p className="font-medium">{profile.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">聯絡電話</p>
                <p className="font-medium">{profile.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">年級</p>
                <p className="font-medium">{profile.gradeLevel}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">需要科目</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {profile.subjectsNeeded.map((subject, idx) => (
                    <Badge key={idx} variant="outline">{subject}</Badge>
                  ))}
                </div>
              </div>
            </div>
            {profile.verificationStatus === "REJECTED" && profile.verificationNotes && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/10 rounded border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-800 dark:text-red-200">
                  <strong>管理員備註：</strong> {profile.verificationNotes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {profile.verificationStatus !== "APPROVED" && (
          <Card className="mb-8 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10">
            <CardHeader>
              <CardTitle className="text-yellow-800 dark:text-yellow-200">等待審核</CardTitle>
              <CardDescription>
                您的帳戶正在審核中，批准後即可發佈補習需求。
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {profile.verificationStatus === "APPROVED" && (
          <>
            {/* Create Request Button */}
            <div className="mb-8">
              <Button onClick={() => setShowCreateForm(!showCreateForm)} size="lg" className="w-full md:w-auto">
                {showCreateForm ? '取消' : '+ 發佈新的補習需求'}
              </Button>
            </div>

            {/* Create Request Form */}
            {showCreateForm && (
              <Card className="mb-8">
                <form onSubmit={handleCreateRequest}>
                  <CardHeader>
                    <CardTitle>發佈補習需求</CardTitle>
                    <CardDescription>填寫您的補習需求，導師將會看到並申請</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">標題</label>
                      <Input
                        required
                        placeholder="例如：需要中三數學補習"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">需要科目（用逗號分隔）</label>
                      <Input
                        required
                        placeholder="例如：數學, 英文"
                        value={formData.subjects.join(", ")}
                        onChange={(e) => setFormData({ ...formData, subjects: e.target.value.split(",").map(s => s.trim()) })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">詳細說明</label>
                      <Textarea
                        required
                        rows={5}
                        placeholder="請詳細說明您的學習需求、目標、時間安排等..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? '發佈中...' : '發佈需求'}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            )}

            {/* My Requests */}
            <div>
              <h2 className="text-2xl font-bold mb-4">我的補習需求</h2>
              {requests.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-muted-foreground">您還沒有發佈任何補習需求</p>
                    <Button className="mt-4" onClick={() => setShowCreateForm(true)}>發佈第一個需求</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {requests.map((request) => (
                    <Card key={request.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2">{request.title}</CardTitle>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {request.subjects.map((subject, idx) => (
                                <Badge key={idx} variant="outline">{subject}</Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 items-end">
                            {getRequestStatusBadge(request.status)}
                            {request.status === "OPEN" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCloseRequest(request.id)}
                              >
                                關閉需求
                              </Button>
                            )}
                          </div>
                        </div>
                        <CardDescription>{request.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          發佈於 {new Date(request.createdAt).toLocaleString("zh-HK")}
                        </p>

                        {request.status === "MATCHED" && request.selectedTutor && (
                          <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-800">
                            <p className="font-semibold text-purple-900 dark:text-purple-100 mb-2">✨ 已配對導師</p>
                            <p className="text-sm"><strong>姓名：</strong>{request.selectedTutor.fullName}</p>
                            <p className="text-sm"><strong>聯絡電話：</strong>{request.selectedTutor.phone}</p>
                            <p className="text-sm"><strong>學歷：</strong>{request.selectedTutor.educationLevel}</p>
                          </div>
                        )}

                        {request.applications.length > 0 && (
                          <div>
                            <h3 className="font-semibold mb-3">導師申請 ({request.applications.length})</h3>
                            <div className="space-y-3">
                              {request.applications.map((app) => (
                                <div key={app.id} className="border rounded-lg p-4">
                                  <div className="flex items-start justify-between gap-4 mb-2">
                                    <div>
                                      <p className="font-medium">{app.tutor.fullName}</p>
                                      <p className="text-sm text-muted-foreground">{app.tutor.educationLevel}</p>
                                    </div>
                                    <Badge variant={app.status === "PENDING" ? "default" : app.status === "ACCEPTED" ? "secondary" : "outline"}>
                                      {app.status === "PENDING" ? "待處理" : app.status === "ACCEPTED" ? "已接受" : "已拒絕"}
                                    </Badge>
                                  </div>
                                  <p className="text-sm mb-2">{app.message}</p>
                                  <div className="flex flex-wrap gap-1 mb-3">
                                    {app.tutor.subjectsTaught.map((subject, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs">{subject}</Badge>
                                    ))}
                                  </div>
                                  {app.status === "PENDING" && request.status === "OPEN" && (
                                    <div className="flex gap-2">
                                      <Button size="sm" onClick={() => handleAcceptApplication(app.id)}>
                                        接受
                                      </Button>
                                      <Button size="sm" variant="outline" onClick={() => handleRejectApplication(app.id)}>
                                        拒絕
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {request.applications.length === 0 && request.status === "OPEN" && (
                          <p className="text-sm text-muted-foreground">暫時還沒有導師申請</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
