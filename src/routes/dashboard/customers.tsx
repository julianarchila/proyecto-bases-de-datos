import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { 
  useTopCustomersByPurchaseAmount,
  useOrdersByDateRange,
  useSuppliersByCountry
} from '@/data-access/dashboard'
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
  Users, 
  Search, 
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  DollarSign,
  Loader2,
  Eye,
  Edit,
  Star,
  TrendingUp
} from 'lucide-react'

const customersSearchSchema = z.object({
  search: z.string().optional().default(''),
  sortBy: z.enum(['spending', 'orders', 'recent']).optional().default('spending'),
  limit: z.number().optional().default(25),
  tier: z.enum(['all', 'vip', 'premium', 'standard']).optional().default('all'),
  page: z.number().optional().default(1),
})

export const Route = createFileRoute('/dashboard/customers')({
  validateSearch: customersSearchSchema,
  component: CustomersPage,
})

function CustomersPage() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  
  // Data hooks
  const { data: topCustomers, isLoading: customersLoading } = useTopCustomersByPurchaseAmount(search.limit)
  
  // Filter and sort customers
  const filteredCustomers = topCustomers?.filter(customer =>
    customer.customer_name.toLowerCase().includes(search.search.toLowerCase()) ||
    customer.email.toLowerCase().includes(search.search.toLowerCase())
  ) || []

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    switch (search.sortBy) {
      case 'orders':
        return b.order_count - a.order_count
      case 'recent':
        return new Date(b.last_order_date).getTime() - new Date(a.last_order_date).getTime()
      case 'spending':
      default:
        const aSpent = parseFloat(a.total_spent.replace('$', '').replace(',', ''))
        const bSpent = parseFloat(b.total_spent.replace('$', '').replace(',', ''))
        return bSpent - aSpent
    }
  })

  // Calculate stats
  const totalCustomers = topCustomers?.length || 0
  const totalRevenue = topCustomers?.reduce((sum, customer) => {
    const spent = parseFloat(customer.total_spent.replace('$', '').replace(',', ''))
    return sum + spent
  }, 0) || 0
  const totalOrders = topCustomers?.reduce((sum, customer) => sum + customer.order_count, 0) || 0
  const averageSpending = totalCustomers > 0 ? totalRevenue / totalCustomers : 0

  const getCustomerTier = (spent: number) => {
    if (spent >= 5000) return { tier: 'VIP', color: 'default', icon: Star }
    if (spent >= 2000) return { tier: 'Premium', color: 'secondary', icon: TrendingUp }
    return { tier: 'Estándar', color: 'outline', icon: Users }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Clientes</h2>
          <p className="text-muted-foreground">
            Gestiona las relaciones con los clientes, ve el historial de compras y rastrea el valor del cliente
          </p>
        </div>
        <Button>
          <Users className="h-4 w-4 mr-2" />
          Exportar Clientes
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Clientes activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Valor de vida del cliente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Totales</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Pedidos realizados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gasto Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageSpending.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Promedio por cliente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Clientes</CardTitle>
          <CardDescription>
            Busca clientes y ajusta las preferencias de visualización
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar Clientes</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={search.search}
                  onChange={(e) => navigate({ search: { ...search, search: e.target.value } })}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Ordenar Por</label>
              <Select value={search.sortBy} onValueChange={(value: 'spending' | 'orders' | 'recent') => navigate({ search: { ...search, sortBy: value } })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spending">Gasto Total</SelectItem>
                  <SelectItem value="orders">Cantidad de Pedidos</SelectItem>
                  <SelectItem value="recent">Actividad Reciente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Limit */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Mostrar Clientes</label>
              <Select value={search.limit.toString()} onValueChange={(value) => navigate({ search: { ...search, limit: parseInt(value) } })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">Top 10</SelectItem>
                  <SelectItem value="25">Top 25</SelectItem>
                  <SelectItem value="50">Top 50</SelectItem>
                  <SelectItem value="100">Top 100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2">
            {search.search && (
              <Badge variant="outline">
                Búsqueda: "{search.search}"
              </Badge>
            )}
            <Badge variant="outline">
              Orden: {search.sortBy === 'spending' ? 'Gasto Total' : search.sortBy === 'orders' ? 'Cantidad de Pedidos' : 'Actividad Reciente'}
            </Badge>
            <Badge variant="outline">
              Mostrando: Top {search.limit}
            </Badge>
            {search.search && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ search: { ...search, search: '' } })}
              >
                Limpiar búsqueda
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Customer Tiers Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes VIP</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sortedCustomers.filter(c => {
                const spent = parseFloat(c.total_spent.replace('$', '').replace(',', ''))
                return spent >= 5000
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Valor de vida $5,000+
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Premium</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sortedCustomers.filter(c => {
                const spent = parseFloat(c.total_spent.replace('$', '').replace(',', ''))
                return spent >= 2000 && spent < 5000
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Valor de vida $2,000-$4,999
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Estándar</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sortedCustomers.filter(c => {
                const spent = parseFloat(c.total_spent.replace('$', '').replace(',', ''))
                return spent < 2000
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Valor de vida menor a $2,000
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Directorio de Clientes</CardTitle>
          <CardDescription>
            {search.search && `Resultados de búsqueda para "${search.search}" • `}
            Mostrando {sortedCustomers.length} clientes ordenados por {
              search.sortBy === 'spending' ? 'gasto total' : 
              search.sortBy === 'orders' ? 'cantidad de pedidos' : 'actividad reciente'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {customersLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2 text-sm text-muted-foreground">Cargando clientes...</span>
            </div>
          ) : sortedCustomers && sortedCustomers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Pedidos</TableHead>
                  <TableHead>Total Gastado</TableHead>
                  <TableHead>Último Pedido</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCustomers.map((customer, index) => {
                  const spent = parseFloat(customer.total_spent.replace('$', '').replace(',', ''))
                  const tierInfo = getCustomerTier(spent)
                  const TierIcon = tierInfo.icon
                  
                  return (
                    <TableRow key={customer.id_persona}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              #{index + 1}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium">{customer.customer_name}</p>
                            <p className="text-sm text-muted-foreground">ID: {customer.id_persona}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={tierInfo.color as any} className="flex items-center gap-1 w-fit">
                          <TierIcon className="h-3 w-3" />
                          {tierInfo.tier}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            {customer.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{customer.order_count}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-green-600">{customer.total_spent}</p>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            {new Date(customer.last_order_date).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            hace {Math.floor((Date.now() - new Date(customer.last_order_date).getTime()) / (1000 * 60 * 60 * 24))} días
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No se encontraron clientes</p>
              <p className="text-sm text-muted-foreground">
                {search.search 
                  ? `Ningún cliente coincide con "${search.search}"`
                  : 'No hay datos de clientes disponibles'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
