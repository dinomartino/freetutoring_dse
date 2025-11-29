import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const adminPath = process.env.ADMIN_SECRET_PATH || 'admin';
  const pathname = request.nextUrl.pathname;

  // Check if accessing protected routes
  const isAdminRoute = pathname.startsWith(`/${adminPath}`) || pathname.startsWith('/api/admin');
  const isDashboardRoute = pathname.startsWith('/dashboard');

  if (isAdminRoute || isDashboardRoute) {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    // Create Supabase client for server-side rendering
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            request.cookies.set({
              name,
              value,
              ...options,
            });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: any) {
            request.cookies.set({
              name,
              value: '',
              ...options,
            });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({
              name,
              value: '',
              ...options,
            });
          },
        },
      }
    );

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Not logged in -> redirect to login page
    if (!user) {
      const redirectUrl = new URL(`/login`, request.url);
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Get user role
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const userRole = profile?.role;

    // Protect admin routes - ONLY admins can access
    if (isAdminRoute) {
      if (userRole !== 'ADMIN') {
        // Non-admin trying to access admin area -> redirect based on their role
        if (userRole === 'STUDENT') {
          return NextResponse.redirect(new URL('/dashboard/student', request.url));
        } else if (userRole === 'TUTOR') {
          return NextResponse.redirect(new URL('/dashboard/tutor', request.url));
        } else {
          return NextResponse.redirect(new URL('/?error=unauthorized', request.url));
        }
      }
    }

    // Protect dashboard routes - users can only access their own dashboard
    if (isDashboardRoute) {
      if (pathname.startsWith('/dashboard/student') && userRole !== 'STUDENT') {
        // Non-student trying to access student dashboard
        if (userRole === 'TUTOR') {
          return NextResponse.redirect(new URL('/dashboard/tutor', request.url));
        } else if (userRole === 'ADMIN') {
          return NextResponse.redirect(new URL(`/${adminPath}`, request.url));
        }
      } else if (pathname.startsWith('/dashboard/tutor') && userRole !== 'TUTOR') {
        // Non-tutor trying to access tutor dashboard
        if (userRole === 'STUDENT') {
          return NextResponse.redirect(new URL('/dashboard/student', request.url));
        } else if (userRole === 'ADMIN') {
          return NextResponse.redirect(new URL(`/${adminPath}`, request.url));
        }
      }
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
