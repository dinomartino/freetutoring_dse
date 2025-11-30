"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { createBrowserClient } from "@supabase/ssr";

interface TutorProfile {
  fullName: string;
  phone: string;
  educationLevel: string;
  subjectsTaught: string[];
  bio: string;
  verificationStatus: string;
  verificationNotes?: string;
}

interface TutoringRequest {
  id: string;
  title: string;
  subjects: string[];
  gradeLevel: string;
  description: string;
  createdAt: string;
  _count: {
    applications: number;
  };
}

interface MyApplication {
  id: string;
  message: string;
  status: string;
  createdAt: string;
  request: {
    id: string;
    title: string;
    subjects: string[];
    status: string;
  };
}

export default function TutorDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<TutorProfile | null>(null);
  const [availableRequests, setAvailableRequests] = useState<TutoringRequest[]>([]);
  const [myApplications, setMyApplications] = useState<MyApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Application form state
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Filter state
  const [subjectFilter, setSubjectFilter] = useState("");
  const [gradeLevelFilter, setGradeLevelFilter] = useState("");

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
      const profileRes = await fetch(`/api/tutor/profile?userId=${user.id}`);
      const profileData = await profileRes.json();

      if (profileData.error) {
        setError(profileData.error);
        setIsLoading(false);
        return;
      }

      setProfile(profileData.profile);

      // Fetch available requests
      const requestsRes = await fetch('/api/tutor/requests?status=OPEN');
      const requestsData = await requestsRes.json();

      if (!requestsData.error) {
        setAvailableRequests(requestsData.requests);
      }

      // Fetch my applications
      const appsRes = await fetch('/api/tutor/applications');
      const appsData = await appsRes.json();

      if (!appsData.error) {
        setMyApplications(appsData.applications);
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

  const handleApply = async (requestId: string) => {
    setSelectedRequest(requestId);
    setApplicationMessage("");
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    setSubmitting(true);

    try {
      const res = await fetch('/api/tutor/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: selectedRequest,
          message: applicationMessage,
        }),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
      } else {
        alert('申請已成功提交！');
        setSelectedRequest(null);
        setApplicationMessage("");
        fetchData(); // Refresh
      }
    } catch (err) {
      alert('提交失敗，請稍後再試');
    } finally {
      setSubmitting(false);
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

  const getApplicationStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-yellow-600">待處理</Badge>;
      case "ACCEPTED":
        return <Badge className="bg-green-600">已接受</Badge>;
      case "REJECTED":
        return <Badge variant="secondary">已拒絕</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Check if already applied to a request
  const hasApplied = (requestId: string) => {
    return myApplications.some(app => app.request.id === requestId);
  };

  // Filter requests
  const filteredRequests = availableRequests.filter(req => {
    if (subjectFilter && !req.subjects.some(s => s.includes(subjectFilter))) {
      return false;
    }
    if (gradeLevelFilter && !req.gradeLevel.includes(gradeLevelFilter)) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">導師儀表板</h1>
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
                <p className="text-sm text-muted-foreground">學歷</p>
                <p className="font-medium">{profile.educationLevel}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">教授科目</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {profile.subjectsTaught.map((subject, idx) => (
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
                您的帳戶正在審核中，批准後即可申請補習需求。
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {profile.verificationStatus === "APPROVED" && (
          <>
            {/* My Applications Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">我的申請</h2>
              {myApplications.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">您還沒有提交任何申請</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {myApplications.map((app) => (
                    <Card key={app.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-lg line-clamp-1">{app.request.title}</CardTitle>
                          {getApplicationStatusBadge(app.status)}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {app.request.subjects.map((subject, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">{subject}</Badge>
                          ))}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-2"><strong>我的申請：</strong></p>
                        <p className="text-sm text-muted-foreground line-clamp-3">{app.message}</p>
                      </CardContent>
                      <CardFooter className="text-xs text-muted-foreground">
                        申請於 {new Date(app.createdAt).toLocaleString("zh-HK")}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Available Requests Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">可申請的補習需求</h2>
                <div className="flex gap-2">
                  <Input
                    placeholder="篩選科目..."
                    className="w-32"
                    value={subjectFilter}
                    onChange={(e) => setSubjectFilter(e.target.value)}
                  />
                  <Input
                    placeholder="篩選年級..."
                    className="w-32"
                    value={gradeLevelFilter}
                    onChange={(e) => setGradeLevelFilter(e.target.value)}
                  />
                </div>
              </div>

              {filteredRequests.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">📚</span>
                    </div>
                    <p className="text-muted-foreground">暫時沒有符合條件的補習需求</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRequests.map((req) => (
                    <Card key={req.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <Badge variant="secondary">{req.gradeLevel}</Badge>
                          {req._count.applications > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {req._count.applications} 位導師申請
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg line-clamp-2">{req.title}</CardTitle>
                        <CardDescription className="line-clamp-3">
                          {req.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {req.subjects.map((subject, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                        {hasApplied(req.id) ? (
                          <Button variant="outline" disabled className="w-full">
                            已申請
                          </Button>
                        ) : selectedRequest === req.id ? (
                          <form onSubmit={handleSubmitApplication} className="space-y-3">
                            <Textarea
                              required
                              rows={4}
                              placeholder="請說明您為何適合這個補習需求..."
                              value={applicationMessage}
                              onChange={(e) => setApplicationMessage(e.target.value)}
                            />
                            <div className="flex gap-2">
                              <Button type="submit" disabled={submitting} className="flex-1">
                                {submitting ? '提交中...' : '提交申請'}
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setSelectedRequest(null)}
                              >
                                取消
                              </Button>
                            </div>
                          </form>
                        ) : (
                          <Button onClick={() => handleApply(req.id)} className="w-full">
                            立即申請
                          </Button>
                        )}
                      </CardContent>
                      <CardFooter className="text-xs text-muted-foreground">
                        發佈於 {new Date(req.createdAt).toLocaleDateString("zh-HK")}
                      </CardFooter>
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
