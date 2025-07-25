import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { useState } from 'react'
import { 
  useProductsWithDetails, 
  useSearchProducts, 
  useProductsByCategories,
  useProductCountByCategory 
} from '@/data-access/dashboard'
import { AddProductModal } from '@/components/AddProductModal'
import { EditProductModal } from '@/components/EditProductModal'
import { ProductDetailModal } from '@/components/ProductDetailModal'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  Search, 
  Filter,
  Plus,
  Edit,
  Loader2,
  Eye
} from 'lucide-react'

const productsSearchSchema = z.object({
  search: z.string().optional().default(''),
  categories: z.array(z.number()).optional().default([]),
  sort: z.enum(['name_asc', 'name_desc', 'price_asc', 'price_desc']).optional().default('name_asc'),
  page: z.number().optional().default(1),
  limit: z.number().optional().default(20),
})

export const Route = createFileRoute('/dashboard/products')({
  validateSearch: productsSearchSchema,
  component: ProductsPage,
})

function ProductsPage() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editProductId, setEditProductId] = useState<number | null>(null)
  const [detailProductId, setDetailProductId] = useState<number | null>(null)
  
  // Data hooks - use search params directly
  const { data: allProducts, isLoading: allProductsLoading } = useProductsWithDetails()
  const { data: searchResults, isLoading: searchLoading } = useSearchProducts(search.search)
  const { data: filteredProducts, isLoading: filterLoading } = useProductsByCategories(search.categories)
  const { data: categoryStats } = useProductCountByCategory()

  // Determine which products to show
  const products = search.search 
    ? searchResults 
    : search.categories.length > 0 
    ? filteredProducts 
    : allProducts

  const isLoading = search.search 
    ? searchLoading 
    : search.categories.length > 0 
    ? filterLoading 
    : allProductsLoading

  const totalProducts = allProducts?.length || 0
  const activeProducts = allProducts?.length || 0 // All products from this query are considered active

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Productos</h2>
          <p className="text-muted-foreground">
            Gestiona tu catálogo de productos, inventario y variantes
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Producto
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Productos en catálogo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos Activos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProducts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Actualmente disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorías</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoryStats?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Categorías de productos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precio Promedio</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allProducts && allProducts.length > 0
                ? `$${(allProducts.reduce((sum, p) => sum + parseFloat(p.precio.replace('$', '').replace(',', '')), 0) / allProducts.length).toFixed(2)}`
                : '$0.00'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Precio promedio de productos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Búsqueda y Filtros de Productos</CardTitle>
          <CardDescription>
            Busca productos por nombre o filtra por categorías
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar productos por nombre o descripción..."
              value={search.search}
              onChange={(e) => navigate({ search: { ...search, search: e.target.value } })}
              className="pl-10"
            />
          </div>

          {/* Category Filter Chips */}
          {categoryStats && categoryStats.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Filtrar por Categoría:</p>
              <div className="flex flex-wrap gap-2">
                {categoryStats.map((category) => (
                  <Badge
                    key={category.id_categoria}
                    variant={search.categories.includes(category.id_categoria) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      navigate({ search: { ...search, categories: search.categories.includes(category.id_categoria) ? search.categories.filter(id => id !== category.id_categoria) : [...search.categories, category.id_categoria] } })
                    }}
                  >
                    {category.nombre_categoria} ({category.product_count})
                  </Badge>
                ))}
                {search.categories.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate({ search: { ...search, categories: [] } })}
                  >
                    Limpiar filtros
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Productos</CardTitle>
          <CardDescription>
            {search.search && `Resultados de búsqueda para "${search.search}"`}
            {search.categories.length > 0 && !search.search && `Filtrado por ${search.categories.length} categorías`}
            {!search.search && search.categories.length === 0 && 'Todos los productos en tu catálogo'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2 text-sm text-muted-foreground">Cargando productos...</span>
            </div>
          ) : products && products.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id_producto}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{product.nombre_producto}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {product.descripcion}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {product.nombre_categoria || 'Sin Categoría'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{product.nombre_marca}</p>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{product.precio}</p>
                        {product.precio_oferta && (
                          <p className="text-sm text-green-600">{product.precio_oferta} (Oferta)</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">
                        Activo
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{product.proveedor_nombre}</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setDetailProductId(product.id_producto)}
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setEditProductId(product.id_producto)}
                          title="Editar producto"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No se encontraron productos</p>
              <p className="text-sm text-muted-foreground">
                {search.search 
                  ? `No hay productos que coincidan con "${search.search}"`
                  : search.categories.length > 0
                  ? 'No hay productos en las categorías seleccionadas'
                  : 'Comienza agregando tu primer producto'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AddProductModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
      
      <EditProductModal 
        productId={editProductId}
        isOpen={editProductId !== null} 
        onClose={() => setEditProductId(null)} 
      />
      
      <ProductDetailModal 
        productId={detailProductId}
        isOpen={detailProductId !== null} 
        onClose={() => setDetailProductId(null)} 
      />
    </div>
  )
}
