import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useProductById } from '@/data-access/dashboard'
import { Loader2, Package, Tag, Building, Truck, DollarSign, Weight, Palette } from 'lucide-react'

interface ProductDetailModalProps {
  productId: number | null
  isOpen: boolean
  onClose: () => void
}

export function ProductDetailModal({ productId, isOpen, onClose }: ProductDetailModalProps) {
  const { data: product, isLoading, error } = useProductById(productId || 0)

  const formatPrice = (price: string) => {
    // Remove the $ symbol if present and format consistently
    const cleanPrice = price.replace('$', '').replace(',', '')
    return `$${parseFloat(cleanPrice).toFixed(2)}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product Details
          </DialogTitle>
          <DialogDescription>
            Complete information about this product
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2 text-sm text-muted-foreground">Loading product details...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-destructive">Failed to load product details</p>
            <p className="text-sm text-muted-foreground mt-2">Please try again later</p>
          </div>
        ) : product ? (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">{product.nombre_producto}</h3>
                <p className="text-muted-foreground">{product.descripcion}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {product.nombre_categoria || 'No Category'}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  {product.nombre_marca}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Truck className="h-3 w-3" />
                  {product.proveedor_nombre}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Pricing Information */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Pricing
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Regular Price</label>
                  <p className="text-lg font-semibold">{formatPrice(product.precio)}</p>
                </div>
                {product.precio_oferta && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Sale Price</label>
                    <p className="text-lg font-semibold text-green-600">{formatPrice(product.precio_oferta)}</p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Product Specifications */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Specifications
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Product ID</label>
                  <p className="font-mono text-sm">{product.id_producto}</p>
                </div>
                {product.peso && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Weight</label>
                    <p className="flex items-center gap-1">
                      <Weight className="h-3 w-3" />
                      {product.peso} kg
                    </p>
                  </div>
                )}
                {product.material && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Material</label>
                    <p>{product.material}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Category ID</label>
                  <p className="font-mono text-sm">{product.id_categoria || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Brand ID</label>
                  <p className="font-mono text-sm">{product.id_marca}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Supplier ID</label>
                  <p className="font-mono text-sm">{product.id_proveedor}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Product not found</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 