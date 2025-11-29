import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const cookieStore = await cookies();
    const response = NextResponse.json({ success: false });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
            // Also set on response
            response.cookies.set(name, value, options);
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options });
            // Also remove from response
            response.cookies.set(name, '', options);
          },
        },
      }
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Check user role
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    // Return success response with cookies
    return NextResponse.json(
      {
        success: true,
        role: profile?.role,
        user: data.user,
      },
      {
        headers: response.headers,
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: '登入過程發生錯誤' },
      { status: 500 }
    );
  }
}
