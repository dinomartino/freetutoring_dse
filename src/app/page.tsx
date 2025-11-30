"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PlatformStats {
  students: number;
  tutors: number;
  openRequests: number;
  totalMatches: number;
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

export default function Home() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [requests, setRequests] = useState<TutoringRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(true);

  useEffect(() => {
    // Fetch stats
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch stats:", error);
        setLoading(false);
      });

    // Fetch open requests
    fetch("/api/tutor/requests?status=OPEN")
      .then((res) => res.json())
      .then((data) => {
        setRequests(data.requests || []);
        setRequestsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch requests:", error);
        setRequestsLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge variant="secondary" className="text-sm px-4 py-1.5">
            免費補習配對平台
          </Badge>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            歡迎來到 FreeTutor
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            連接有特殊需要的學生與合資格的義教導師
            <br />
            <span className="text-base">讓每一位學生都能獲得適切的學習支援</span>
          </p>

          {/* Platform Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-12">
            <Card className="text-center">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">已註冊學生</CardDescription>
                <CardTitle className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {loading ? "..." : stats?.students || 0}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">已註冊導師</CardDescription>
                <CardTitle className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {loading ? "..." : stats?.tutors || 0}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">開放申請</CardDescription>
                <CardTitle className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {loading ? "..." : stats?.openRequests || 0}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">成功配對</CardDescription>
                <CardTitle className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {loading ? "..." : stats?.totalMatches || 0}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Login / Register CTA */}
          <div className="mt-12 p-8 border-2 border-primary/20 rounded-lg bg-card max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">開始使用 FreeTutor</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto">
                  登入帳戶
                </Button>
              </Link>
              <div className="flex gap-2">
                <Link href="/register/student" className="flex-1 sm:flex-none">
                  <Button size="lg" variant="outline" className="w-full">
                    學生註冊
                  </Button>
                </Link>
                <Link href="/register/tutor" className="flex-1 sm:flex-none">
                  <Button size="lg" variant="outline" className="w-full">
                    導師註冊
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Requests Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">最新補習需求</h2>
            <p className="text-muted-foreground text-lg">
              瀏覽學生發佈的補習需求，立即申請成為他們的導師
            </p>
          </div>

          {requestsLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">載入中...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📚</span>
              </div>
              <p className="text-muted-foreground text-lg mb-2">暫時沒有開放的補習需求</p>
              <p className="text-sm text-muted-foreground">學生註冊並發佈需求後，內容將顯示於此</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.slice(0, 6).map((req) => (
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
                    <CardDescription className="line-clamp-2">
                      {req.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {req.subjects.slice(0, 3).map((subject, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                      {req.subjects.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{req.subjects.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="text-xs text-muted-foreground">
                    發佈於 {new Date(req.createdAt).toLocaleDateString("zh-HK")}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {requests.length > 6 && (
            <div className="text-center mt-8">
              <Link href="/login">
                <Button size="lg">
                  登入查看更多需求
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">運作方式</h2>
            <p className="text-muted-foreground text-lg">簡單四步，開展學習之旅</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📝</span>
                </div>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Badge variant="outline">1</Badge>
                  註冊
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  創建您的帳戶並上傳驗證文件
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">✅</span>
                </div>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Badge variant="outline">2</Badge>
                  身份驗證
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  我們的團隊會審核您的文件並進行批准
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📢</span>
                </div>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Badge variant="outline">3</Badge>
                  發佈需求
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  學生發佈補習需求，導師瀏覽並申請
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🤝</span>
                </div>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Badge variant="outline">4</Badge>
                  配對成功
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  學生選擇合適的導師，開展學習旅程
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">平台特色</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 hover:border-primary/50 transition-all">
              <CardHeader className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <CardTitle className="text-xl">學生主導配對</CardTitle>
                <CardDescription>
                  學生發佈自己的學習需求，由合資格導師主動申請，確保找到最合適的配對
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all">
              <CardHeader className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <CardTitle className="text-xl">嚴格資格審核</CardTitle>
                <CardDescription>
                  所有學生及導師均需上傳驗證文件，經人工審核後方可使用平台服務
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all">
              <CardHeader className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <CardTitle className="text-xl">完全免費</CardTitle>
                <CardDescription>
                  所有服務完全免費，讓每一位有需要的學生都能獲得學習支援
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all">
              <CardHeader className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <CardTitle className="text-xl">靈活配對</CardTitle>
                <CardDescription>
                  學生可比較多位導師申請，選擇最符合需求的導師開展補習
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground text-sm">
          <p>© 2025 FreeTutor. 致力於為每位學生提供平等的學習機會</p>
        </div>
      </footer>
    </div>
  );
}
