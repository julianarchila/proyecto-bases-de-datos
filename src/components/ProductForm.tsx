import { z } from 'zod'
import { useCallback, useState } from 'react'
import { useAppForm } from '@/components/ui/tanstack-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAllCategories, useAllBrands, useAllSuppliers } from '@/data-access/dashboard'
import { Loader2 } from 'lucide-react'
import { ProductVariantManager, type ProductVariant } from './ProductVariantManager'

// Form validation schema
const productFormSchema = z.object({
  nombre_producto: z.string().min(1, 'El nombre del producto es requerido').max(100, 'El nombre del producto debe tener menos de 100 caracteres'),
  descripcion: z.string().min(1, 'La descripción es requerida').max(255, 'La descripción debe tener menos de 255 caracteres'),
  precio: z.string().min(1, 'El precio es requerido').regex(/^\d+(\.\d{2})?$/, 'El precio debe ser un monto válido (ej. 19.99)'),
  precio_oferta: z.string().refine((val) => !val || /^\d+(\.\d{2})?$/.test(val), 'El precio de oferta debe ser un monto válido'),
  peso: z.number().optional(),
  material: z.string().max(100, 'El material debe tener menos de 100 caracteres'),
  id_categoria: z.number().optional(),
  id_marca: z.number({ required_error: 'La marca es requerida' }),
  id_proveedor: z.number({ required_error: 'El proveedor es requerido' })
})

type ProductFormData = z.infer<typeof productFormSchema>

interface ProductFormProps {
  initialData?: Partial<ProductFormData>
  onSubmit: (data: ProductFormData, variants?: ProductVariant[]) => Promise<void>
  submitButtonText?: string
  isLoading?: boolean
  showVariants?: boolean
}

export function ProductForm({ 
  initialData, 
  onSubmit, 
  submitButtonText = 'Guardar Producto',
  isLoading = false,
  showVariants = false
}: ProductFormProps) {
  // Variants state
  const [variants, setVariants] = useState<ProductVariant[]>([])

  // Fetch reference data
  const { data: categories, isLoading: categoriesLoading } = useAllCategories()
  const { data: brands, isLoading: brandsLoading } = useAllBrands()
  const { data: suppliers, isLoading: suppliersLoading } = useAllSuppliers()

  const form = useAppForm({
    defaultValues: {
      nombre_producto: initialData?.nombre_producto || '',
      descripcion: initialData?.descripcion || '',
      precio: initialData?.precio || '',
      precio_oferta: initialData?.precio_oferta || '',
      peso: initialData?.peso || undefined,
      material: initialData?.material || '',
      id_categoria: initialData?.id_categoria || undefined,
      id_marca: initialData?.id_marca || undefined,
      id_proveedor: initialData?.id_proveedor || undefined
    },
    onSubmit: async ({ value }) => {
      // Validate the form data before submitting
      const validatedData = productFormSchema.parse(value)
      
      // Validate variants if they are being used
      if (showVariants && variants.length > 0) {
        const validVariants = variants.filter(v => v.id_talla > 0 && v.id_color > 0)
        await onSubmit(validatedData, validVariants)
      } else {
        await onSubmit(validatedData)
      }
    },
  })

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      e.stopPropagation()
      form.handleSubmit()
    },
    [form],
  )

  const isReferenceDataLoading = categoriesLoading || brandsLoading || suppliersLoading

  if (isReferenceDataLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2 text-sm text-muted-foreground">Cargando datos del formulario...</span>
      </div>
    )
  }

  return (
    <form.AppForm>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Name */}
          <form.AppField
            name="nombre_producto"
            children={(field) => (
              <field.FormItem>
                <field.FormLabel>Nombre del Producto *</field.FormLabel>
                <field.FormControl>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Ingresa el nombre del producto"
                  />
                </field.FormControl>
                <field.FormMessage />
              </field.FormItem>
            )}
          />

          {/* Category */}
          <form.AppField
            name="id_categoria"
            children={(field) => (
              <field.FormItem>
                <field.FormLabel>Categoría</field.FormLabel>
                <field.FormControl>
                  <Select
                    value={field.state.value?.toString() || ''}
                    onValueChange={(value) => field.handleChange(value ? parseInt(value) : undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Sin categoría</SelectItem>
                      {categories?.map((category) => (
                        <SelectItem key={category.id_categoria} value={category.id_categoria.toString()}>
                          {category.nombre_categoria}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </field.FormControl>
                <field.FormMessage />
              </field.FormItem>
            )}
          />

          {/* Brand */}
          <form.AppField
            name="id_marca"
            children={(field) => (
              <field.FormItem>
                <field.FormLabel>Marca *</field.FormLabel>
                <field.FormControl>
                  <Select
                    value={field.state.value?.toString() || ''}
                    onValueChange={(value) => field.handleChange(value ? parseInt(value) : undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una marca" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands?.map((brand) => (
                        <SelectItem key={brand.id_marca} value={brand.id_marca.toString()}>
                          {brand.nombre_marca}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </field.FormControl>
                <field.FormMessage />
              </field.FormItem>
            )}
          />

          {/* Supplier */}
          <form.AppField
            name="id_proveedor"
            children={(field) => (
              <field.FormItem>
                <field.FormLabel>Proveedor *</field.FormLabel>
                <field.FormControl>
                  <Select
                    value={field.state.value?.toString() || ''}
                    onValueChange={(value) => field.handleChange(value ? parseInt(value) : undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un proveedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers?.map((supplier) => (
                        <SelectItem key={supplier.id_proveedor} value={supplier.id_proveedor.toString()}>
                          {supplier.nombre_empresa}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </field.FormControl>
                <field.FormMessage />
              </field.FormItem>
            )}
          />

          {/* Price */}
          <form.AppField
            name="precio"
            children={(field) => (
              <field.FormItem>
                <field.FormLabel>Precio *</field.FormLabel>
                <field.FormControl>
                  <Input
                    type="text"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="19.99"
                  />
                </field.FormControl>
                <field.FormMessage />
              </field.FormItem>
            )}
          />

          {/* Sale Price */}
          <form.AppField
            name="precio_oferta"
            children={(field) => (
              <field.FormItem>
                <field.FormLabel>Precio de Oferta</field.FormLabel>
                <field.FormControl>
                  <Input
                    type="text"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="15.99 (opcional)"
                  />
                </field.FormControl>
                <field.FormMessage />
              </field.FormItem>
            )}
          />

          {/* Weight */}
          <form.AppField
            name="peso"
            children={(field) => (
              <field.FormItem>
                <field.FormLabel>Peso (kg)</field.FormLabel>
                <field.FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    value={field.state.value || ''}
                    onChange={(e) => field.handleChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                    onBlur={field.handleBlur}
                    placeholder="1.5"
                  />
                </field.FormControl>
                <field.FormMessage />
              </field.FormItem>
            )}
          />

          {/* Material */}
          <form.AppField
            name="material"
            children={(field) => (
              <field.FormItem>
                <field.FormLabel>Material</field.FormLabel>
                <field.FormControl>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Ej. Algodón, Poliéster, Metal"
                  />
                </field.FormControl>
                <field.FormMessage />
              </field.FormItem>
            )}
          />
        </div>

        {/* Description */}
        <form.AppField
          name="descripcion"
          children={(field) => (
            <field.FormItem>
              <field.FormLabel>Descripción *</field.FormLabel>
              <field.FormControl>
                <Textarea
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Describe el producto en detalle..."
                  rows={4}
                />
              </field.FormControl>
              <field.FormMessage />
            </field.FormItem>
          )}
        />

        {/* Product Variants */}
        {showVariants && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Variantes del Producto</h3>
            <ProductVariantManager
              variants={variants}
              onChange={setVariants}
              basePrice={form.state.values.precio}
            />
          </div>
        )}

        {/* Submit Button */}
        <form.Subscribe selector={(state) => ({ isSubmitting: state.isSubmitting, canSubmit: state.canSubmit })}>
          {({ isSubmitting, canSubmit }) => (
            <Button
              type="submit"
              disabled={!canSubmit || isSubmitting || isLoading}
              className="w-full"
            >
              {isSubmitting || isLoading ? 'Guardando...' : submitButtonText}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </form.AppForm>
  )
} 