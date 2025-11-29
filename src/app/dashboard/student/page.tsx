"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

interface ConnectionRequest {
  id: string;
  status: string;
  message: string;
  createdAt: string;
  tutor: {
    fullName: string;
    subjectsTaught: string[];
  };
}

export default function StudentDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [connections, setConnections] = useState<ConnectionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          router.push('/login');
          return;
        }

        // Fetch student profile
        const response = await fetch(`/api/student/profile?userId=${user.id}`);
        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          setProfile(data.profile);
          setConnections(data.connections || []);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError("載入資料時發生錯誤");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.push('/');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-green-500">已批准</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-500">審核中</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive">已拒絕</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getConnectionStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return <Badge className="bg-green-500">已接受</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-500">等待回應</Badge>;
      case 'DECLINED':
        return <Badge variant="destructive">已拒絕</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">載入中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>錯誤</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{error}</p>
            <Button onClick={() => router.push('/')} className="mt-4">
              返回首頁
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">FreeTutor - 學生專區</h1>
          <Button onClick={handleLogout} variant="outline">登出</Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">歡迎，{profile?.fullName || '學生'}</h2>
          <p className="text-muted-foreground">這是你的個人儀表板</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>個人資料</CardTitle>
              <CardDescription>你的基本資訊及驗證狀態</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">驗證狀態</p>
                <div className="mt-1">{getStatusBadge(profile?.verificationStatus || 'PENDING')}</div>
              </div>

              {profile?.verificationStatus === 'PENDING' && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    你的帳戶正在審核中，請耐心等待管理員批准。
                  </p>
                </div>
              )}

              {profile?.verificationStatus === 'REJECTED' && profile?.verificationNotes && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">審核備註</p>
                  <p className="text-sm text-red-700 dark:text-red-300">{profile.verificationNotes}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-muted-foreground">姓名</p>
                <p className="mt-1">{profile?.fullName}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">電話</p>
                <p className="mt-1">{profile?.phone}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">年級</p>
                <p className="mt-1">{profile?.gradeLevel}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">需要補習的科目</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile?.subjectsNeeded.map((subject, index) => (
                    <Badge key={index} variant="secondary">{subject}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>快捷功能</CardTitle>
              <CardDescription>探索及聯繫導師</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {profile?.verificationStatus === 'APPROVED' ? (
                <>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => router.push('/tutors')}
                  >
                    瀏覽導師
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push('/dashboard/student/profile')}
                  >
                    編輯個人資料
                  </Button>
                </>
              ) : (
                <div className="p-4 bg-muted rounded-md text-center">
                  <p className="text-sm text-muted-foreground">
                    你的帳戶需要通過驗證後才能瀏覽及聯繫導師
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Connection Requests */}
        {profile?.verificationStatus === 'APPROVED' && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>配對申請</CardTitle>
              <CardDescription>你與導師的配對申請記錄</CardDescription>
            </CardHeader>
            <CardContent>
              {connections.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>暫時沒有配對申請</p>
                  <Button
                    className="mt-4"
                    onClick={() => router.push('/tutors')}
                  >
                    開始尋找導師
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {connections.map((connection) => (
                    <div
                      key={connection.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{connection.tutor.fullName}</p>
                          <p className="text-sm text-muted-foreground">
                            {connection.tutor.subjectsTaught.join('、')}
                          </p>
                        </div>
                        {getConnectionStatusBadge(connection.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        申請日期：{new Date(connection.createdAt).toLocaleDateString('zh-HK')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
