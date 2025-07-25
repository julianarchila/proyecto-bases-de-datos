import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trash2, Plus } from 'lucide-react'
import { useAllColors, useAllSizes } from '@/data-access/dashboard'
import type { Color, Talla } from '@/server/db/types'

export interface ProductVariant {
  id_talla: number
  id_color: number
  sku?: string
  precio_variante?: string
  variante_activa?: boolean
}

interface ProductVariantManagerProps {
  variants: ProductVariant[]
  onChange: (variants: ProductVariant[]) => void
  basePrice?: string
}

export function ProductVariantManager({ variants, onChange, basePrice }: ProductVariantManagerProps) {
  const { data: colors, isLoading: colorsLoading } = useAllColors()
  const { data: sizes, isLoading: sizesLoading } = useAllSizes()

  const addVariant = () => {
    const newVariant: ProductVariant = {
      id_talla: 0,
      id_color: 0,
      sku: '',
      precio_variante: basePrice || '',
      variante_activa: true
    }
    onChange([...variants, newVariant])
  }

  const updateVariant = (index: number, updates: Partial<ProductVariant>) => {
    const updatedVariants = variants.map((variant, i) => 
      i === index ? { ...variant, ...updates } : variant
    )
    onChange(updatedVariants)
  }

  const removeVariant = (index: number) => {
    onChange(variants.filter((_, i) => i !== index))
  }

  const getColorName = (colorId: number) => {
    return colors?.find(c => c.id_color === colorId)?.nombre_color || 'Unknown'
  }

  const getSizeName = (sizeId: number) => {
    return sizes?.find(s => s.id_talla === sizeId)?.codigo_talla || 'Unknown'
  }

  const getColorHex = (colorId: number) => {
    return colors?.find(c => c.id_color === colorId)?.codigo_hex || '#000000'
  }

  if (colorsLoading || sizesLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product Variants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Loading colors and sizes...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Product Variants
          <Badge variant="secondary">{variants.length} variants</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Add different size and color combinations for this product. Each variant can have its own SKU and price.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {variants.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No variants added yet.</p>
            <p className="text-sm">Click "Add Variant" to create size and color combinations.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {variants.map((variant, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Variant {index + 1}</span>
                    {variant.id_color > 0 && variant.id_talla > 0 && (
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: getColorHex(variant.id_color) }}
                          title={getColorName(variant.id_color)}
                        />
                        <Badge variant="outline">
                          {getColorName(variant.id_color)} - {getSizeName(variant.id_talla)}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVariant(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Size Selection */}
                  <div>
                    <label className="text-sm font-medium">Size *</label>
                    <Select
                      value={variant.id_talla.toString()}
                      onValueChange={(value) => updateVariant(index, { id_talla: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Select size</SelectItem>
                        {sizes?.map((size) => (
                          <SelectItem key={size.id_talla} value={size.id_talla.toString()}>
                            {size.codigo_talla} - {size.descripcion_talla}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Color Selection */}
                  <div>
                    <label className="text-sm font-medium">Color *</label>
                    <Select
                      value={variant.id_color.toString()}
                      onValueChange={(value) => updateVariant(index, { id_color: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Select color</SelectItem>
                        {colors?.map((color) => (
                          <SelectItem key={color.id_color} value={color.id_color.toString()}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full border border-gray-300"
                                style={{ backgroundColor: color.codigo_hex }}
                              />
                              {color.nombre_color}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* SKU */}
                  <div>
                    <label className="text-sm font-medium">SKU</label>
                    <Input
                      value={variant.sku || ''}
                      onChange={(e) => updateVariant(index, { sku: e.target.value })}
                      placeholder="Optional SKU"
                    />
                  </div>

                  {/* Variant Price */}
                  <div>
                    <label className="text-sm font-medium">Variant Price</label>
                    <Input
                      value={variant.precio_variante || ''}
                      onChange={(e) => updateVariant(index, { precio_variante: e.target.value })}
                      placeholder={basePrice || "0.00"}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Leave empty to use base price
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Button 
          type="button" 
          variant="outline" 
          onClick={addVariant}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Variant
        </Button>
      </CardContent>
    </Card>
  )
} 