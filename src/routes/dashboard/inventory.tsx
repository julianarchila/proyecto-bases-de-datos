import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { useState } from 'react'
import { 
  useProductVariantsWithDetails,
  useActiveProductsWithStock,
  useLowStockProducts,
  useInventoryOverview,
  useQuickStockActions
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
  Package, 
  AlertTriangle, 
  TrendingUp,
  Search,
  Filter,
  Edit,
  Plus,
  Minus,
  Loader2,
  Archive,
  RefreshCw
} from 'lucide-react'
import { ProductVariantEditModal } from '@/components/ProductVariantEditModal'
import { toast } from 'sonner'

const inventorySearchSchema = z.object({
  view: z.enum(['all', 'low-stock', 'active']).optional().default('all'),
  search: z.string().optional().default(''),
  sort: z.enum(['name_asc', 'name_desc', 'stock_asc', 'stock_desc', 'price_asc', 'price_desc']).optional().default('name_asc'),
  page: z.number().optional().default(1),
  limit: z.number().optional().default(20),
})

export const Route = createFileRoute('/dashboard/inventory')({
  validateSearch: inventorySearchSchema,
  component: InventoryPage,
})

function InventoryPage() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  
  // Modal states
  const [variantEditOpen, setVariantEditOpen] = useState(false)
  const [editingVariant, setEditingVariant] = useState<any>(null)
  
  // Data hooks
  const { data: allVariants, isLoading: allVariantsLoading } = useProductVariantsWithDetails()
  const { data: activeProducts, isLoading: activeLoading } = useActiveProductsWithStock()
  const { data: lowStockProducts, isLoading: lowStockLoading } = useLowStockProducts()
  const quickActions = useQuickStockActions()
  // const { 
  //   activeProducts: overviewActive, 
  //   lowStockProducts: overviewLow, 
  //   categoryStats, 
  //   isLoading: overviewLoading 
  // } = useInventoryOverview()

  // Filter data based on view and search
  const getFilteredData = () => {
    let data = []
    
    switch (search.view) {
      case 'low-stock':
        data = lowStockProducts || []
        break
      case 'active':
        data = activeProducts || []
        break
      default:
        data = allVariants || []
    }

    if (search.search) {
      data = data.filter(item => 
        item.nombre_producto?.toLowerCase().includes(search.search.toLowerCase()) ||
        item.sku?.toLowerCase().includes(search.search.toLowerCase())
      )
    }

    return data
  }

  const filteredData = getFilteredData()
  const isLoading = search.view === 'low-stock' ? lowStockLoading : search.view === 'active' ? activeLoading : allVariantsLoading

  // Calculate stats
  const totalVariants = allVariants?.length || 0
  const lowStockCount = lowStockProducts?.length || 0
  const activeCount = activeProducts?.length || 0
  const totalStockValue = allVariants?.reduce((sum, variant) => {
    const stock = variant.cantidad_stock || 0
    const price = parseFloat(variant.precio_variante?.replace('$', '').replace(',', '') || '0')
    return sum + (stock * price)
  }, 0) || 0

  const getStockStatus = (variant: any) => {
    const stock = variant.cantidad_stock || 0
    const minStock = variant.stock_minimo || 0
    
    if (stock === 0) return { status: 'out-of-stock', color: 'destructive', label: 'Sin Stock' }
    if (stock <= minStock) return { status: 'low-stock', color: 'secondary', label: 'Stock Bajo' }
    return { status: 'in-stock', color: 'default', label: 'En Stock' }
  }

  const getStockLevel = (variant: any) => {
    const stock = variant.cantidad_stock || 0
    const minStock = variant.stock_minimo || 0
    const maxStock = variant.stock_maximo || 100
    
    return Math.min((stock / maxStock) * 100, 100)
  }

  // Helper functions
  const openVariantEdit = (variant: any) => {
    setEditingVariant(variant)
    setVariantEditOpen(true)
  }

  const handleQuickStockChange = (variant: any, change: number) => {
    if (change > 0) {
      quickActions.increaseStock(variant.id_variante, change)
      toast.success(`Stock aumentado en ${change}`)
    } else {
      quickActions.decreaseStock(variant.id_variante, Math.abs(change))
      toast.success(`Stock reducido en ${Math.abs(change)}`)
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Inventario</h2>
          <p className="text-muted-foreground">
            Monitorea los niveles de stock, gestiona el inventario y rastrea las variantes de productos
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Variantes</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVariants.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Variantes de productos rastreadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas de Stock Bajo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {lowStockCount === 0 ? '¡Todo bien!' : 'Requiere atención'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos Activos</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Actualmente disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor del Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalStockValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Valor total del inventario
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Inventario</CardTitle>
          <CardDescription>
            Filtra el inventario por estado de stock o busca productos específicos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* View Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Vista</label>
              <Select value={search.view} onValueChange={(value: 'all' | 'low-stock' | 'active') => navigate({ search: { ...search, view: value } })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las Variantes</SelectItem>
                  <SelectItem value="active">Productos Activos</SelectItem>
                  <SelectItem value="low-stock">Solo Stock Bajo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre de producto o SKU..."
                  value={search.search}
                  onChange={(e) => navigate({ search: { ...search, search: e.target.value } })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          <div className="flex flex-wrap gap-2">
            {search.view !== 'all' && (
              <Badge variant="outline">
                Vista: {search.view === 'low-stock' ? 'Stock Bajo' : 'Productos Activos'}
              </Badge>
            )}
            {search.search && (
              <Badge variant="outline">
                Búsqueda: "{search.search}"
              </Badge>
            )}
            {(search.view !== 'all' || search.search) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigate({ search: { ...search, view: 'all', search: '' } })
                }}
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {search.view === 'low-stock' && 'Productos con Stock Bajo'}
            {search.view === 'active' && 'Productos Activos'}
            {search.view === 'all' && 'Todas las Variantes de Productos'}
          </CardTitle>
          <CardDescription>
            {search.search && `Resultados de búsqueda para "${search.search}" • `}
            Mostrando {filteredData.length} {search.view === 'all' ? 'variantes' : 'productos'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2 text-sm text-muted-foreground">Cargando inventario...</span>
            </div>
          ) : filteredData && filteredData.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Variante</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Nivel de Stock</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Última Actualización</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((variant) => {
                  const stockStatus = getStockStatus(variant)
                  const stockLevel = getStockLevel(variant)
                  
                  return (
                    <TableRow key={variant.id_variante}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{variant.nombre_producto}</p>
                          <p className="text-sm text-muted-foreground">ID: {variant.id_producto}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: variant.codigo_hex }}
                          />
                          <span className="text-sm">
                            {variant.nombre_color} • {variant.codigo_talla}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-mono text-sm">{variant.sku || 'N/A'}</p>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{variant.cantidad_stock || 0}</span>
                            <span className="text-muted-foreground">
                              Mín: {variant.stock_minimo || 0}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all ${
                                stockStatus.status === 'out-of-stock' ? 'bg-red-500' :
                                stockStatus.status === 'low-stock' ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.max(stockLevel, 5)}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={stockStatus.color as any}>
                          {stockStatus.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">
                          {variant.precio_variante || 'N/A'}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">
                          Actualizado recientemente
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-1 justify-end">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleQuickStockChange(variant, 1)}
                            disabled={quickActions.isPending}
                            title="Aumentar stock en 1"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleQuickStockChange(variant, -1)}
                            disabled={quickActions.isPending || (variant.cantidad_stock || 0) <= 0}
                            title="Reducir stock en 1"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openVariantEdit(variant)}
                            title="Editar detalles de variante"
                          >
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
              <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No se encontró inventario</p>
              <p className="text-sm text-muted-foreground">
                {search.search 
                  ? `Ningún producto coincide con "${search.search}"`
                  : search.view === 'low-stock'
                  ? 'Ningún producto tiene stock bajo actualmente'
                  : search.view === 'active'
                  ? 'No se encontraron productos activos'
                  : 'No hay datos de inventario disponibles'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {lowStockCount > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas de Stock
            </CardTitle>
            <CardDescription className="text-yellow-700">
              Tienes {lowStockCount} productos que se están quedando sin stock
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate({ search: { ...search, view: 'low-stock' } })}
                className="border-yellow-300 text-yellow-800 hover:bg-yellow-100"
              >
                Ver Productos con Stock Bajo
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-yellow-300 text-yellow-800 hover:bg-yellow-100"
              >
                Generar Reporte de Reposición
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <ProductVariantEditModal
        open={variantEditOpen}
        onOpenChange={setVariantEditOpen}
        variant={editingVariant}
      />
    </div>
  )
}
