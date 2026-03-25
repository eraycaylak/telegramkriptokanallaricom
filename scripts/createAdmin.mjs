import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function run() {
  console.log('Admin user creating...')
  const { data, error } = await supabase.auth.signUp({
    email: 'eraycayylak1@gmail.com',
    password: '6603166',
    options: {
      data: {
        username: 'admin_eray'
      }
    }
  })
  
  if (error) {
    console.error('Sign up error:', error)
  } else {
    console.log('User created:', data.user?.email)
  }
}

run()
