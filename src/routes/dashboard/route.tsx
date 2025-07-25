import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { getSession } from '@/data-access/auth'
import { DashboardHeader } from '@/components/DashboardHeader'

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export const Route = createFileRoute('/dashboard')({
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

    if (session.user_type === 'cliente') {
      throw redirect({
        to: '/client-dashboard',
      })
    }

    return { session }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <DashboardHeader />
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 
