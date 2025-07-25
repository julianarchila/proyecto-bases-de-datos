import { 
  LayoutDashboard, 
  Package, 
  Warehouse, 
  ShoppingCart, 
  Users, 
  BarChart3,
  Building2
} from "lucide-react"
import { Link, useLocation } from "@tanstack/react-router"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"

// Employee dashboard menu items
const dashboardItems = [
  {
    title: "Resumen",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Productos",
    url: "/dashboard/products",
    icon: Package,
  },
  {
    title: "Inventario",
    url: "/dashboard/inventory",
    icon: Warehouse,
  },
  {
    title: "Pedidos",
    url: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "Clientes",
    url: "/dashboard/customers",
    icon: Users,
  },
  {
    title: "Reportes",
    url: "/dashboard/reports",
    icon: BarChart3,
  },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Building2 className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Tienda PBD</span>
            <span className="text-xs text-muted-foreground">Portal de Empleados</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Panel de Control</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dashboardItems.map((item) => {
                const isActive = location.pathname === item.url || 
                  (item.url !== "/dashboard" && location.pathname.startsWith(item.url))
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.url}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
