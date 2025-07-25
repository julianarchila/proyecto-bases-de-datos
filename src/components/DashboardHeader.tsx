import { Link, useRouteContext } from '@tanstack/react-router'
import { Button } from './ui/button'
import { useLogoutAction } from '@/data-access/auth'
import { SidebarTrigger } from './ui/sidebar'
import { Separator } from './ui/separator'
import { Bell, LogOut } from 'lucide-react'

export function DashboardHeader() {
  const { session } = useRouteContext({ from: '__root__' })
  const logout = useLogoutAction()

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Panel de Empleados</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
          </Button>

          <Separator orientation="vertical" className="h-4" />

          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end text-sm">
              <span className="font-medium">
                {session?.nombre} {session?.apellido}
              </span>
              <span className="text-xs text-muted-foreground">
                {session?.user_type === 'empleado' ? 'Empleado' : 'Cliente'}
              </span>
            </div>
            
            <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
              <span className="text-sm font-medium text-primary">
                {session?.nombre?.[0]}{session?.apellido?.[0]}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </header>
  )
} 
