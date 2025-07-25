import { useState } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog'
import { ProductForm } from './ProductForm'
import { useUpdateProduct, useProductById } from '@/data-access/dashboard'
import { toast } from 'sonner'
import { Edit, Loader2 } from 'lucide-react'

interface EditProductModalProps {
  productId: number | null
  isOpen: boolean
  onClose: () => void
}

export function EditProductModal({ productId, isOpen, onClose }: EditProductModalProps) {
  const { data: product, isLoading: isLoadingProduct } = useProductById(productId || 0)
  const updateProductMutation = useUpdateProduct()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: {
    nombre_producto: string
    descripcion: string
    precio: string
    precio_oferta?: string
    peso?: number
    material?: string
    id_categoria?: number
    id_marca: number
    id_proveedor: number
  }) => {
    if (!productId) return

    try {
      setIsSubmitting(true)
      
      // Clean up the data before submitting
      const cleanData = {
        precio_oferta: data.precio_oferta?.trim() || undefined,
        material: data.material?.trim() || undefined,
        nombre_producto: data.nombre_producto,
        descripcion: data.descripcion,
        precio: data.precio,
        peso: data.peso,
        id_categoria: data.id_categoria,
        id_marca: data.id_marca,
        id_proveedor: data.id_proveedor,
      }

      await updateProductMutation.mutateAsync({
        productId,
        updates: cleanData
      })
      
      toast.success('Product updated successfully!')
      onClose()
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('Failed to update product. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Convert product data to form format
  const getInitialData = () => {
    if (!product) return undefined
    
    return {
      nombre_producto: product.nombre_producto,
      descripcion: product.descripcion,
      precio: product.precio.replace('$', '').replace(',', ''), // Remove currency formatting
      precio_oferta: product.precio_oferta ? product.precio_oferta.replace('$', '').replace(',', '') : '',
      peso: product.peso,
      material: product.material || '',
      id_categoria: product.id_categoria,
      id_marca: product.id_marca,
      id_proveedor: product.id_proveedor,
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Product
          </DialogTitle>
          <DialogDescription>
            Update the product details below. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        {isLoadingProduct ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2 text-sm text-muted-foreground">Loading product data...</span>
          </div>
        ) : product ? (
          <ProductForm
            initialData={getInitialData()}
            onSubmit={handleSubmit}
            submitButtonText="Update Product"
            isLoading={isSubmitting}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Product not found</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 