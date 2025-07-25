import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { useState } from 'react'
import { 
  useRecentOrders,
  useOrdersByDateRange,
  useOrdersByStatus,
  useOrdersByPaymentMethod
} from '@/data-access/dashboard'
import { OrderDetailModal } from '@/components/OrderDetailModal'
import { ProcessOrderModal } from '@/components/ProcessOrderModal'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  ShoppingCart, 
  Calendar, 
  Filter,
  Search,
  Package,
  CreditCard,
  Loader2,
  Eye,
  Edit,
  Truck
} from 'lucide-react'

const ordersSearchSchema = z.object({
  status: z.array(z.string()).optional().default([]),
  payment: z.string().optional().default('all'),
  dateFrom: z.string().optional().default(''),
  dateTo: z.string().optional().default(''),
  limit: z.number().optional().default(50),
  sort: z.enum(['date_desc', 'date_asc', 'amount_desc', 'amount_asc']).optional().default('date_desc'),
  page: z.number().optional().default(1),
})

export const Route = createFileRoute('/dashboard/orders')({
  validateSearch: ordersSearchSchema,
  component: OrdersPage,
})

function OrdersPage() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  
  // Modal states
  const [processOrdersOpen, setProcessOrdersOpen] = useState(false)
  const [orderDetailOpen, setOrderDetailOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
  
  // Data hooks - prioritize based on active filters
  const { data: recentOrders, isLoading: recentLoading } = useRecentOrders(search.limit)
  const { data: statusFilteredOrders, isLoading: statusLoading } = useOrdersByStatus(search.status)
  const { data: paymentFilteredOrders, isLoading: paymentLoading } = useOrdersByPaymentMethod(search.payment === 'all' ? '' : search.payment)
  const { data: dateFilteredOrders, isLoading: dateLoading } = useOrdersByDateRange(search.dateFrom, search.dateTo)

  // Determine which orders to show based on active filters
  const orders = search.dateFrom && search.dateTo 
    ? dateFilteredOrders
    : search.status.length > 0 
    ? statusFilteredOrders
    : search.payment && search.payment !== 'all'
    ? paymentFilteredOrders
    : recentOrders

  const isLoading = search.dateFrom && search.dateTo 
    ? dateLoading
    : search.status.length > 0 
    ? statusLoading
    : search.payment && search.payment !== 'all'
    ? paymentLoading
    : recentLoading

  // Status options - Updated to match actual database values
  const statusOptions = ['Entregado', 'En Tránsito', 'Procesando']
  const paymentOptions = ['Tarjeta de Crédito', 'PSE', 'Efectivo', 'Tarjeta Débito']

  // Calculate stats - Updated to match actual database values
  const totalOrders = orders?.length || 0
  const pendingOrders = orders?.filter(o => o.estado_pedido === 'Procesando').length || 0
  const processingOrders = orders?.filter(o => o.estado_pedido === 'En Tránsito').length || 0
  const completedOrders = orders?.filter(o => o.estado_pedido === 'Entregado').length || 0

  const totalRevenue = orders?.reduce((sum, order) => {
    const amount = parseFloat(order.total_orden.replace('$', '').replace(',', ''))
    return sum + amount
  }, 0) || 0

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Entregado': return 'default'
      case 'En Tránsito': return 'outline'
      case 'Procesando': return 'secondary'
      default: return 'secondary'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Entregado': return 'text-green-600'
      case 'En Tránsito': return 'text-purple-600'
      case 'Procesando': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pedidos</h2>
          <p className="text-muted-foreground">
            Gestiona pedidos de clientes, rastrea envíos y actualiza el estado de pedidos
          </p>
        </div>
        <Button onClick={() => setProcessOrdersOpen(true)}>
          <Package className="h-4 w-4 mr-2" />
          Procesar Pedidos
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {search.dateFrom && search.dateTo ? 'En el período seleccionado' : 'Pedidos recientes'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Package className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Esperando procesamiento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
            <Truck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processingOrders.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Siendo preparados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Valor total de pedidos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Pedidos</CardTitle>
          <CardDescription>
            Filtra pedidos por rango de fechas, estado o método de pago
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Date Range Filter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha de Inicio</label>
              <Input
                type="date"
                value={search.dateFrom}
                onChange={(e) => navigate({ search: { ...search, dateFrom: e.target.value } })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha de Fin</label>
              <Input
                type="date"
                value={search.dateTo}
                onChange={(e) => navigate({ search: { ...search, dateTo: e.target.value } })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Límite de Pedidos</label>
              <Select value={search.limit.toString()} onValueChange={(value) => navigate({ search: { ...search, limit: parseInt(value) } })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25 pedidos</SelectItem>
                  <SelectItem value="50">50 pedidos</SelectItem>
                  <SelectItem value="100">100 pedidos</SelectItem>
                  <SelectItem value="200">200 pedidos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status and Payment Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Filtrar por Estado</label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((status) => (
                  <Badge
                    key={status}
                    variant={search.status.includes(status) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      navigate({
                        search: {
                          ...search,
                          status: search.status.includes(status)
                            ? search.status.filter(s => s !== status)
                            : [...search.status, status]
                        }
                      })
                    }}
                  >
                    {status}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Método de Pago</label>
              <Select value={search.payment} onValueChange={(value) => navigate({ search: { ...search, payment: value } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los métodos de pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los métodos</SelectItem>
                  {paymentOptions.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Filters */}
          {(search.status.length > 0 || (search.payment && search.payment !== 'all') || search.dateFrom || search.dateTo) && (
            <Button
              variant="outline"
              onClick={() => {
                navigate({ search: { ...search, status: [], payment: 'all', dateFrom: '', dateTo: '' } })
              }}
            >
              Limpiar Todos los Filtros
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos</CardTitle>
          <CardDescription>
            {search.status.length > 0 && `Filtrado por estado: ${search.status.join(', ')}`}
            {search.payment && search.payment !== 'all' && `Método de pago: ${search.payment}`}
            {search.dateFrom && search.dateTo && `Rango de fechas: ${search.dateFrom} a ${search.dateTo}`}
            {!search.status.length && (!search.payment || search.payment === 'all') && !search.dateFrom && !search.dateTo && `Mostrando los ${search.limit} pedidos más recientes`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2 text-sm text-muted-foreground">Cargando pedidos...</span>
            </div>
          ) : orders && orders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID de Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Pago</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Entrega</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id_orden}>
                    <TableCell>
                      <p className="font-medium">#{order.id_orden}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.fecha_orden).toLocaleDateString()}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">
                        {new Date(order.fecha_orden).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.fecha_orden).toLocaleTimeString()}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(order.estado_pedido)}>
                        {order.estado_pedido}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">
                        {order.metodo_pago || 'No especificado'}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-green-600">{order.total_orden}</p>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {order.fecha_entrega_estimada 
                            ? new Date(order.fecha_entrega_estimada).toLocaleDateString()
                            : 'Por determinar'
                          }
                        </p>
                        {order.fecha_entrega_real && (
                          <p className="text-sm text-green-600">
                            Entregado: {new Date(order.fecha_entrega_real).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedOrderId(order.id_orden)
                            setOrderDetailOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedOrderId(order.id_orden)
                            setOrderDetailOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setProcessOrdersOpen(true)}
                        >
                          <Truck className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No se encontraron pedidos</p>
              <p className="text-sm text-muted-foreground">
                {search.status.length > 0 || (search.payment && search.payment !== 'all') || (search.dateFrom && search.dateTo)
                  ? 'No hay pedidos que coincidan con los filtros seleccionados'
                  : 'Aún no se han realizado pedidos'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <ProcessOrderModal
        open={processOrdersOpen}
        onOpenChange={setProcessOrdersOpen}
        onViewOrder={(orderId) => {
          setSelectedOrderId(orderId)
          setOrderDetailOpen(true)
          setProcessOrdersOpen(false)
        }}
      />

      <OrderDetailModal
        orderId={selectedOrderId}
        open={orderDetailOpen}
        onOpenChange={setOrderDetailOpen}
      />
    </div>
  )
}
