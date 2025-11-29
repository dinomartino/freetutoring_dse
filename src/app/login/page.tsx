"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();
  const redirect = searchParams.get("redirect") || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Call the server-side login API to properly set cookies
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setError("登入失敗：" + (data.error || '未知錯誤'));
        setIsLoading(false);
        return;
      }

      // Redirect based on role
      if (data.role === 'ADMIN') {
        // Admin - redirect to admin panel
        const adminPath = process.env.NEXT_PUBLIC_ADMIN_SECRET_PATH || 'admin';
        window.location.href = `/${adminPath}`;
      } else if (data.role === 'STUDENT') {
        // Student - redirect to student dashboard
        const redirectUrl = (redirect && redirect !== '/login' && redirect !== '/') ? redirect : '/dashboard/student';
        window.location.href = redirectUrl;
      } else if (data.role === 'TUTOR') {
        // Tutor - redirect to tutor dashboard
        const redirectUrl = (redirect && redirect !== '/login' && redirect !== '/') ? redirect : '/dashboard/tutor';
        window.location.href = redirectUrl;
      } else {
        setError(`無法識別用戶角色: ${data.role || '(未定義)'}`);
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.error('Login error:', error);
      setError("登入過程發生錯誤，請稍後重試");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">FreeTutor 登入</CardTitle>
          <CardDescription className="text-center">
            請使用你的帳號登入
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">電子郵件</Label>
              <Input
                id="email"
                type="email"
                placeholder="your-email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">密碼</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "登入中..." : "登入"}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => router.push('/')}
                className="text-sm text-muted-foreground"
              >
                返回首頁
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">載入中...</div>}>
      <LoginForm />
    </Suspense>
  );
}
