import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { getSession } from '@/data-access/auth'
import { DashboardHeader } from '@/components/DashboardHeader'

export const Route = createFileRoute('/client-dashboard')({
  beforeLoad: async ({ location }) => {
    const session = await getSession()

    if (!session) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }



    if (session.user_type !== 'cliente') {
      throw redirect({
        to: '/dashboard',
      })
    }




    return { session }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <Outlet />
    </div>
  )
} 