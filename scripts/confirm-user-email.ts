import { createClient } from '@supabase/supabase-js';

// Load environment variables
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

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

async function confirmUserEmail() {
  try {
    console.log('\n=== Confirm User Email in Supabase Auth ===\n');

    // Get email from command line argument
    const email = process.argv[2];

    if (!email) {
      console.error('❌ Usage: npm run confirm-email <email>');
      console.error('   Example: npm run confirm-email user@example.com');
      process.exit(1);
    }

    // Get user by email
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.error('❌ Error fetching users:', listError.message);
      process.exit(1);
    }

    const user = users.find((u) => u.email === email);

    if (!user) {
      console.error(`❌ User with email ${email} not found`);
      process.exit(1);
    }

    console.log(`Found user: ${user.email}`);
    console.log(`User ID: ${user.id}`);
    console.log(`Email confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);

    if (user.email_confirmed_at) {
      console.log('\n✅ Email is already confirmed!');
      process.exit(0);
    }

    // Update user to confirm email
    const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { email_confirm: true }
    );

    if (updateError) {
      console.error('❌ Error confirming email:', updateError.message);
      process.exit(1);
    }

    console.log('\n✅ Email confirmed successfully!');
    console.log(`User ${email} can now log in.\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

confirmUserEmail();
