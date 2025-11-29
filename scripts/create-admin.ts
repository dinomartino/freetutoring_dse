/**
 * Script to create an admin user
 * Run with: npx tsx scripts/create-admin.ts
 */

import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as readline from 'readline';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Prisma with PostgreSQL adapter (same as lib/prisma.ts)
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function createAdmin() {
  console.log('=== FreeTutor Admin User Creation ===\n');

  try {
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password (min 6 chars): ');

    if (!email || !password) {
      console.error('❌ Email and password are required');
      process.exit(1);
    }

    if (password.length < 6) {
      console.error('❌ Password must be at least 6 characters');
      process.exit(1);
    }

    console.log('\nCreating admin user...');

    // 1. Create Supabase Auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
    });

    if (authError) {
      console.error('❌ Supabase auth error:', authError.message);
      process.exit(1);
    }

    if (!authData.user) {
      console.error('❌ Failed to create user');
      process.exit(1);
    }

    console.log('✅ Supabase auth user created:', authData.user.id);

    // 2. Create user profile with ADMIN role
    await prisma.userProfile.create({
      data: {
        id: authData.user.id,
        role: 'ADMIN',
      },
    });

    console.log('✅ Admin user profile created');
    console.log('\n=== Success! ===');
    console.log('Admin user created successfully!');
    console.log('Email:', email);
    console.log('You can now login at /login');
    console.log(`Admin panel: /admin (or /${process.env.ADMIN_SECRET_PATH || 'admin'})`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
    rl.close();
  }
}

createAdmin();
