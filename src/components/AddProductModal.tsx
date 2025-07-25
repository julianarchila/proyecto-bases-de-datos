import { useState } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog'
import { ProductForm } from './ProductForm'
import { useCreateProduct, useCreateProductWithVariants } from '@/data-access/dashboard'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import type { ProductVariant } from './ProductVariantManager'

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  const createProductMutation = useCreateProduct()
  const createProductWithVariantsMutation = useCreateProductWithVariants()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (
    data: {
      nombre_producto: string
      descripcion: string
      precio: string
      precio_oferta?: string
      peso?: number
      material?: string
      id_categoria?: number
      id_marca: number
      id_proveedor: number
    },
    variants?: ProductVariant[]
  ) => {
    try {
      setIsSubmitting(true)
      
      // Clean up the data before submitting
      const cleanData = {
        ...data,
        precio_oferta: data.precio_oferta?.trim() || undefined,
        material: data.material?.trim() || undefined,
      }

      if (variants && variants.length > 0) {
        // Create product with variants
        await createProductWithVariantsMutation.mutateAsync({
          product: cleanData,
          variants: variants
        })
        toast.success(`Product created successfully with ${variants.length} variants!`)
      } else {
        // Create product without variants
        await createProductMutation.mutateAsync(cleanData)
        toast.success('Product created successfully!')
      }
      
      onClose()
    } catch (error) {
      console.error('Error creating product:', error)
      toast.error('Failed to create product. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Product
          </DialogTitle>
          <DialogDescription>
            Create a new product by filling in the details below. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <ProductForm
          onSubmit={handleSubmit}
          submitButtonText="Create Product"
          isLoading={isSubmitting}
          showVariants={true}
        />
      </DialogContent>
    </Dialog>
  )
} 