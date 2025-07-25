#!/usr/bin/env tsx

import { sendAuthCodeEmail } from '../server/email/service'
import { env } from '../env'

async function testEmailService() {
  console.log('🧪 Testing email service...')
  
  // Check if RESEND_API_KEY is configured
  if (!env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY is not configured in environment variables')
    process.exit(1)
  }

  console.log('✅ RESEND_API_KEY is configured')

  // Test email parameters
  const testParams = {
    to: 'your-email@example.com', // Replace with your actual email address
    code: '123456',
    userName: 'Test User'
  }

  try {
    console.log(`📧 Sending test email to: ${testParams.to}`)
    await sendAuthCodeEmail(testParams)
    console.log('✅ Email sent successfully!')
    console.log('📝 Check your email inbox and spam folder')
  } catch (error) {
    console.error('❌ Failed to send email:', error)
    
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      
      // Common Resend errors and solutions
      if (error.message.includes('domain')) {
        console.log('\n💡 Solution: Make sure to:')
        console.log('1. Verify your domain in Resend dashboard')
        console.log('2. Update the "from" address in src/server/email/service.ts')
        console.log('3. Use a verified domain (e.g., noreply@yourdomain.com)')
      }
      
      if (error.message.includes('API key')) {
        console.log('\n💡 Solution: Check your RESEND_API_KEY in .env file')
      }
    }
    
    process.exit(1)
  }
}

// Run the test
testEmailService().catch(console.error) 