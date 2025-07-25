import { createFileRoute } from '@tanstack/react-router'
import { useSession } from '@/data-access/auth'
import { useDashboardOverview } from '@/data-access/dashboard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Package, 
  ShoppingCart, 
  AlertTriangle, 
  TrendingUp,
  Users,
  DollarSign,
  Loader2
} from 'lucide-react'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
})

function DashboardPage() {
  const { data: session } = useSession()
  const { stats, recentOrders, lowStockCount, isLoading, error } = useDashboardOverview()

  if (error) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-destructive">Error al cargar el panel</h2>
          <p className="text-muted-foreground">No se pudieron cargar los datos del panel. Por favor, inténtalo de nuevo más tarde.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          ¡Bienvenido de vuelta, {session?.nombre}!
        </h2>
        <p className="text-muted-foreground">
          Esto es lo que está pasando con tu tienda hoy.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Cargando...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.total_products?.toLocaleString() || '0'}</div>
                <p className="text-xs text-muted-foreground">
                  Productos totales en catálogo
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Activos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Cargando...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.active_orders?.toLocaleString() || '0'}</div>
                <p className="text-xs text-muted-foreground">
                  Pedidos pendientes y en proceso
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas de Stock Bajo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Cargando...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.low_stock_count?.toLocaleString() || '0'}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.low_stock_count === 0 ? '¡Todo bien!' : 'Requiere atención'}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos de Hoy</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Cargando...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.today_revenue || '$0.00'}</div>
                <p className="text-xs text-muted-foreground">
                  Ingresos totales de hoy
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Pedidos Recientes</CardTitle>
            <CardDescription>
              Últimos pedidos de clientes que necesitan atención
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2 text-sm text-muted-foreground">Cargando pedidos recientes...</span>
              </div>
            ) : recentOrders && recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id_orden} className="flex items-center justify-between border-b pb-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">#{order.id_orden}</p>
                      <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{order.total_orden}</p>
                      <p className="text-xs text-muted-foreground">{order.estado_pedido}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">No se encontraron pedidos recientes</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Tareas comunes y accesos directos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <button className="flex items-center gap-2 p-2 text-left hover:bg-muted rounded-md transition-colors">
                <Package className="h-4 w-4" />
                <span className="text-sm">Agregar Nuevo Producto</span>
              </button>
              <button className="flex items-center gap-2 p-2 text-left hover:bg-muted rounded-md transition-colors">
                <ShoppingCart className="h-4 w-4" />
                <span className="text-sm">Procesar Pedidos</span>
              </button>
              <button className="flex items-center gap-2 p-2 text-left hover:bg-muted rounded-md transition-colors">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">Verificar Stock Bajo</span>
              </button>
              <button className="flex items-center gap-2 p-2 text-left hover:bg-muted rounded-md transition-colors">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">Ver Reportes</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 