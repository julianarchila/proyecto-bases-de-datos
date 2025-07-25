import { useForm } from '@tanstack/react-form'
import { useUpdateProductVariant } from '@/data-access/dashboard'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Loader2, Edit } from 'lucide-react'
import { toast } from 'sonner'

interface ProductVariantEditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  variant?: {
    id_variante: number
    nombre_producto: string
    nombre_color: string
    codigo_talla: string
    codigo_hex?: string
    precio_variante?: string
    sku?: string
    variante_activa?: boolean
    cantidad_stock?: number
  }
}

export function ProductVariantEditModal({
  open,
  onOpenChange,
  variant
}: ProductVariantEditModalProps) {
  const updateVariantMutation = useUpdateProductVariant()

  const form = useForm({
    defaultValues: {
      precio_variante: variant?.precio_variante?.replace('$', '').replace(',', '') || '',
      sku: variant?.sku || '',
      variante_activa: variant?.variante_activa ?? true
    },
    onSubmit: async ({ value }) => {
      if (!variant) return

      try {
        const updates: {
          precio_variante?: string
          sku?: string
          variante_activa?: boolean
        } = {}

        // Only include fields that have changed
        if (value.precio_variante !== (variant.precio_variante?.replace('$', '').replace(',', '') || '')) {
          updates.precio_variante = value.precio_variante
        }
        
        if (value.sku !== (variant.sku || '')) {
          updates.sku = value.sku || undefined
        }

        if (value.variante_activa !== (variant.variante_activa ?? true)) {
          updates.variante_activa = value.variante_activa
        }

        if (Object.keys(updates).length === 0) {
          toast.info('No changes to save')
          return
        }

        await updateVariantMutation.mutateAsync({
          variantId: variant.id_variante,
          updates
        })

        toast.success('Variant updated successfully')
        onOpenChange(false)
      } catch (error) {
        toast.error('Failed to update variant')
        console.error('Variant update error:', error)
      }
    }
  })

  if (!variant) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Variant
          </DialogTitle>
          <DialogDescription>
            Update details for this product variant
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Info */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <h3 className="font-medium">{variant.nombre_producto}</h3>
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: variant.codigo_hex }}
              />
              <span className="text-sm text-muted-foreground">
                {variant.nombre_color} • {variant.codigo_talla}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Stock: {variant.cantidad_stock || 0}</Badge>
              <Badge variant={variant.variante_activa ? 'default' : 'secondary'}>
                {variant.variante_activa ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="space-y-4"
          >
            {/* Price */}
            <form.Field name="precio_variante">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Price</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-sm text-muted-foreground">$</span>
                    <Input
                      id={field.name}
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="pl-8"
                      disabled={updateVariantMutation.isPending}
                    />
                  </div>
                </div>
              )}
            </form.Field>

            {/* SKU */}
            <form.Field name="sku">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>SKU</Label>
                  <Input
                    id={field.name}
                    placeholder="Enter SKU..."
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={updateVariantMutation.isPending}
                  />
                </div>
              )}
            </form.Field>

            {/* Active Status */}
            <form.Field name="variante_activa">
              {(field) => (
                <div className="flex items-center space-x-2">
                  <Switch
                    id={field.name}
                    checked={field.state.value}
                    onCheckedChange={field.handleChange}
                    disabled={updateVariantMutation.isPending}
                  />
                  <Label htmlFor={field.name}>Active variant</Label>
                </div>
              )}
            </form.Field>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateVariantMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateVariantMutation.isPending}>
                {updateVariantMutation.isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
} 