import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { 
  useSalesByProduct,
  useAverageOrderValue,
  useMonthlySalesSummary,
  useProductsNeverOrdered,
  useTopCustomersByPurchaseAmount,
  useProductsAboveAveragePrice,
  useAnalyticsOverview
} from '@/data-access/dashboard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  TrendingUp, 
  DollarSign, 
  Users,
  Package,
  BarChart3,
  Calendar,
  Download,
  Loader2,
  AlertCircle,
  Star,
  Target
} from 'lucide-react'

const reportsSearchSchema = z.object({
  year: z.number().optional().default(new Date().getFullYear()),
  customerLimit: z.number().optional().default(10),
  reportType: z.enum(['overview', 'sales', 'customers', 'products']).optional().default('overview'),
  dateFrom: z.string().optional().default(''),
  dateTo: z.string().optional().default(''),
})

export const Route = createFileRoute('/dashboard/reports')({
  validateSearch: reportsSearchSchema,
  component: ReportsPage,
})

function ReportsPage() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  
  // Data hooks
  const { data: salesByProduct, isLoading: salesLoading } = useSalesByProduct()
  const { data: averageOrderValue, isLoading: avgLoading } = useAverageOrderValue()
  const { data: monthlySales, isLoading: monthlyLoading } = useMonthlySalesSummary(search.year)
  const { data: unusedProducts, isLoading: unusedLoading } = useProductsNeverOrdered()
  const { data: topCustomers, isLoading: customersLoading } = useTopCustomersByPurchaseAmount(search.customerLimit)
  const { data: premiumProducts, isLoading: premiumLoading } = useProductsAboveAveragePrice()
  // const { 
  //   salesByProduct: overviewSales, 
  //   averageOrderValue: overviewAvg, 
  //   monthlySales: overviewMonthly, 
  //   topCustomers: overviewCustomers,
  //   isLoading: overviewLoading 
  // } = useAnalyticsOverview()

  // Calculate key metrics
  const totalRevenue = salesByProduct?.reduce((sum, product) => {
    const revenue = parseFloat(product.total_revenue.replace('$', '').replace(',', ''))
    return sum + revenue
  }, 0) || 0

  const totalOrders = salesByProduct?.reduce((sum, product) => sum + product.order_count, 0) || 0
  const totalProductsSold = salesByProduct?.reduce((sum, product) => sum + product.total_quantity_sold, 0) || 0
  const averageValue = averageOrderValue?.average_order_value ? parseFloat(averageOrderValue.average_order_value.replace('$', '').replace(',', '')) : 0

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 3 }, (_, i) => currentYear - i)

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Reportes y Análisis</h2>
          <p className="text-muted-foreground">
            Perspectivas del negocio, rendimiento de ventas y análisis de clientes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar Datos
          </Button>
          <Button>
            <BarChart3 className="h-4 w-4 mr-2" />
            Generar Reporte
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Ingresos de ventas de todos los tiempos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Totales</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Pedidos procesados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Promedio del Pedido</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Promedio por pedido
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos Vendidos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProductsSold.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Unidades totales vendidas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Controles de Reporte</CardTitle>
          <CardDescription>
            Ajusta períodos de tiempo y límites para análisis detallado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Año para Análisis Mensual</label>
              <Select value={search.year.toString()} onValueChange={(value) => navigate({ search: { ...search, year: parseInt(value) } })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Límite de Mejores Clientes</label>
              <Select value={search.customerLimit.toString()} onValueChange={(value) => navigate({ search: { ...search, customerLimit: parseInt(value) } })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">Top 5</SelectItem>
                  <SelectItem value="10">Top 10</SelectItem>
                  <SelectItem value="25">Top 25</SelectItem>
                  <SelectItem value="50">Top 50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Sales by Product */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Ventas por Producto
            </CardTitle>
            <CardDescription>
              Productos con mejor rendimiento por ingresos y cantidad
            </CardDescription>
          </CardHeader>
          <CardContent>
            {salesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2 text-sm text-muted-foreground">Cargando datos de ventas...</span>
              </div>
            ) : salesByProduct && salesByProduct.length > 0 ? (
              <div className="space-y-4">
                {salesByProduct.slice(0, 5).map((product) => (
                  <div key={product.product_id} className="flex items-center justify-between border-b pb-2">
                    <div className="space-y-1">
                      <p className="font-medium">{product.nombre_producto}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.total_quantity_sold} unidades • {product.order_count} pedidos
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">{product.total_revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No hay datos de ventas disponibles</p>
            )}
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Mejores Clientes
            </CardTitle>
            <CardDescription>
              Clientes por monto total de compra
            </CardDescription>
          </CardHeader>
          <CardContent>
            {customersLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2 text-sm text-muted-foreground">Cargando clientes...</span>
              </div>
            ) : topCustomers && topCustomers.length > 0 ? (
              <div className="space-y-4">
                {topCustomers.map((customer, index) => (
                  <div key={customer.id_persona} className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-3">
                      <Badge variant={index < 3 ? "default" : "outline"}>
                        #{index + 1}
                      </Badge>
                      <div className="space-y-1">
                        <p className="font-medium">{customer.customer_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {customer.order_count} pedidos
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">{customer.total_spent}</p>
                      <p className="text-sm text-muted-foreground">
                        Último: {new Date(customer.last_order_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No hay datos de clientes disponibles</p>
            )}
          </CardContent>
        </Card>

        {/* Monthly Sales Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Ventas Mensuales ({search.year})
            </CardTitle>
            <CardDescription>
              Resumen de rendimiento mensual
            </CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2 text-sm text-muted-foreground">Cargando datos mensuales...</span>
              </div>
            ) : monthlySales && monthlySales.length > 0 ? (
              <div className="space-y-4">
                {monthlySales.map((month) => (
                  <div key={`${month.year}-${month.month}`} className="flex items-center justify-between border-b pb-2">
                    <div className="space-y-1">
                      <p className="font-medium">
                        {new Date(month.year, month.month - 1).toLocaleDateString('es-ES', { month: 'long' })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {month.total_orders} pedidos • {month.unique_customers} clientes
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">{month.total_revenue}</p>
                      <p className="text-sm text-muted-foreground">
                        Prom: {month.average_order_value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No hay datos mensuales para {search.year}</p>
            )}
          </CardContent>
        </Card>

        {/* Premium Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Productos Premium
            </CardTitle>
            <CardDescription>
              Productos con precio por encima del promedio
            </CardDescription>
          </CardHeader>
          <CardContent>
            {premiumLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2 text-sm text-muted-foreground">Cargando productos premium...</span>
              </div>
            ) : premiumProducts && premiumProducts.length > 0 ? (
              <div className="space-y-4">
                {premiumProducts.slice(0, 5).map((product) => (
                  <div key={product.id_producto} className="flex items-center justify-between border-b pb-2">
                    <div className="space-y-1">
                      <p className="font-medium">{product.nombre_producto}</p>
                      <Badge variant="outline">Premium</Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{product.precio}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No se encontraron productos premium</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Unused Products Alert */}
      {unusedProducts && unusedProducts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Productos Nunca Pedidos
            </CardTitle>
            <CardDescription className="text-orange-700">
              {unusedProducts.length} productos nunca han sido pedidos y pueden necesitar atención
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              {unusedProducts.slice(0, 3).map((product) => (
                <div key={product.id_producto} className="flex items-center justify-between">
                  <p className="font-medium text-orange-800">{product.nombre_producto}</p>
                  <p className="text-orange-700">{product.precio}</p>
                </div>
              ))}
              {unusedProducts.length > 3 && (
                <p className="text-sm text-orange-600">
                  ...y {unusedProducts.length - 3} productos más
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="border-orange-300 text-orange-800 hover:bg-orange-100"
              >
                Revisar Productos
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-orange-300 text-orange-800 hover:bg-orange-100"
              >
                Estrategia de Marketing
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Analytics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Análisis Detallado de Ventas</CardTitle>
          <CardDescription>
            Desglose completo de ventas por producto
          </CardDescription>
        </CardHeader>
        <CardContent>
          {salesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2 text-sm text-muted-foreground">Cargando análisis detallado...</span>
            </div>
          ) : salesByProduct && salesByProduct.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Unidades Vendidas</TableHead>
                  <TableHead>Pedidos</TableHead>
                  <TableHead>Ingresos</TableHead>
                  <TableHead>Promedio por Pedido</TableHead>
                  <TableHead>Rendimiento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesByProduct.map((product) => {
                  const revenue = parseFloat(product.total_revenue.replace('$', '').replace(',', ''))
                  const avgPerOrder = revenue / product.order_count
                  const performance = product.total_quantity_sold > 50 ? 'alto' : 
                                    product.total_quantity_sold > 20 ? 'medio' : 'bajo'
                  
                  return (
                    <TableRow key={product.product_id}>
                      <TableCell>
                        <p className="font-medium">{product.nombre_producto}</p>
                        <p className="text-sm text-muted-foreground">ID: {product.product_id}</p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{product.total_quantity_sold}</p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{product.order_count}</p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-green-600">{product.total_revenue}</p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">${avgPerOrder.toFixed(2)}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          performance === 'alto' ? 'default' : 
                          performance === 'medio' ? 'secondary' : 'outline'
                        }>
                          {performance.charAt(0).toUpperCase() + performance.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No hay datos de ventas disponibles</p>
              <p className="text-sm text-muted-foreground">
                Los análisis de ventas aparecerán aquí una vez que se procesen los pedidos
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
