import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
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

          {/* CTA Cards */}
          <div className="grid md:grid-cols-2 gap-6 mt-12 max-w-3xl mx-auto">
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <CardTitle className="text-2xl">學生專區</CardTitle>
                <CardDescription className="text-base">
                  尋找合資格的導師，助您在學業上精益求精
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href="/register/student" className="w-full">
                  <Button className="w-full" size="lg">
                    學生註冊
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl">導師專區</CardTitle>
                <CardDescription className="text-base">
                  分享您的知識，為學生的生命帶來改變
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href="/register/tutor" className="w-full">
                  <Button className="w-full" size="lg" variant="secondary">
                    導師註冊
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">運作方式</h2>
            <p className="text-muted-foreground text-lg">簡單三步，開展學習之旅</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
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
                <p className="text-muted-foreground">
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
                <p className="text-muted-foreground">
                  我們的團隊會審核您的文件並進行批准
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🤝</span>
                </div>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Badge variant="outline">3</Badge>
                  配對
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  學生與導師互相連繫，開展有意義的學習
                </p>
              </CardContent>
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
