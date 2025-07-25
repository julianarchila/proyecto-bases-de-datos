import { createFileRoute } from '@tanstack/react-router'
import { CodeVerificationForm } from '@/components/auth/CodeVerificationForm'
import { z } from 'zod'

// Search params schema for email
const verifySearchSchema = z.object({
  email: z.string().email('Invalid email format'),
})

export const Route = createFileRoute('/auth/verify')({
  validateSearch: verifySearchSchema,
  component: VerifyPage,
})

function VerifyPage() {
  const { email } = Route.useSearch()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Check Your Email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the verification code we sent to your email
          </p>
        </div>
        <CodeVerificationForm email={email} />
      </div>
    </div>
  )
} 