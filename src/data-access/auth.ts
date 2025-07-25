import { queryOptions, useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { sendAuthCode, verifyAuthCode, fetchUser, logoutUser } from '@/server/auth/actions'
import * as TanstackQuery from '@/integrations/tanstack-query/root-provider'

// Query options for session management with caching
export function getSessionQueryOptions() {
  return queryOptions({
    queryKey: ['auth', 'session'] as const,
    staleTime: 0, // Always refetch to ensure fresh auth state
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes after component unmounts
    queryFn: async () => {
      return await fetchUser()
    },
  })
}

// Server-side session fetching (for beforeLoad)
export async function getSession() {
  const { queryClient } = TanstackQuery.getContext()
  // Force a fresh fetch instead of using potentially stale cached data
  return await queryClient.fetchQuery(getSessionQueryOptions())
}

// Session invalidation helper
export const invalidateSessionData = async () => {
  const { queryClient } = TanstackQuery.getContext()
  await queryClient.invalidateQueries({
    queryKey: ['auth']
  })
}

// Hook for client-side session access
export function useSession() {
  return useSuspenseQuery(getSessionQueryOptions())
}

// Auth mutations
export function useSendAuthCode() {
  return useMutation({
    mutationFn: sendAuthCode,
    onSuccess: (data) => {
      if (data.success) {
        console.log('✅ Code sent successfully')
      } else {
        console.error('❌ Failed to send code:', data.message)
      }
    },
    onError: (error) => {
      console.error('❌ Error sending auth code:', error)
    }
  })
}

export function useVerifyAuthCode() {
  const router = useRouter()
  
  return useMutation({
    mutationFn: verifyAuthCode,
    onSuccess: async (data) => {
      if (data.success && data.user) {
        console.log(`✅ Authentication successful! User type: ${data.user.user_type}`)
        
        // Invalidate and refetch session data
        await invalidateSessionData()
        
        // Check for redirect parameter from URL search params
        const searchParams = new URLSearchParams(window.location.search)
        const redirectTo = searchParams.get('redirect')
        
        // Default to dashboard, but use redirect parameter if available
        const redirectPath = redirectTo || '/dashboard'
        
        console.log(`✅ Redirecting to: ${redirectPath}`)
        
        router.navigate({ to: redirectPath as any })
      } else {
        console.error('❌ Verification failed:', data.message)
      }
    },
    onError: (error) => {
      console.error('❌ Error verifying auth code:', error)
    }
  })
}

export function useLogout() {
  const router = useRouter()
  
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: async (data) => {
      if (data.success) {
        console.log('✅ Logged out successfully')
        
        // Invalidate session data
        await invalidateSessionData()
        
        // Redirect to login
        router.navigate({ to: '/login' })
      } else {
        console.error('❌ Logout failed:', data.message)
      }
    },
    onError: (error) => {
      console.error('❌ Error during logout:', error)
    }
  })
}

// Helper function to trigger logout
export function useLogoutAction() {
  const logout = useLogout()
  
  return () => {
    logout.mutate({})
  }
}

// Helper function to check if user is authenticated
export function useIsAuthenticated() {
  try {
    const { data: session } = useSession()
    return !!session
  } catch {
    return false
  }
}

// Helper function to get current user type
export function useUserType() {
  try {
    const { data: session } = useSession()
    return session?.user_type || null
  } catch {
    return null
  }
}

// Helper function to check if user is an employee
export function useIsEmployee() {
  const userType = useUserType()
  return userType === 'empleado'
}

// Helper function to check if user is a client
export function useIsClient() {
  const userType = useUserType()
  return userType === 'cliente'
} 