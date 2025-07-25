import { useState } from 'react'
import { useOrderDetails, useUpdateOrderStatus } from '@/data-access/dashboard'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { 
  Package, 
  User, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Loader2,
  CheckCircle,
  Clock,
  Truck
} from 'lucide-react'
import { toast } from 'sonner'

interface OrderDetailModalProps {
  orderId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const statusOptions = [
  { value: 'Procesando', label: 'Processing', icon: Clock, color: 'text-blue-600' },
  { value: 'En Tránsito', label: 'In Transit', icon: Truck, color: 'text-purple-600' },
  { value: 'Entregado', label: 'Delivered', icon: CheckCircle, color: 'text-green-600' },
]

export function OrderDetailModal({ orderId, open, onOpenChange }: OrderDetailModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [estimatedDelivery, setEstimatedDelivery] = useState<string>('')
  const [actualDelivery, setActualDelivery] = useState<string>('')

  const { data: orderDetails, isLoading } = useOrderDetails(orderId!)
  const updateStatusMutation = useUpdateOrderStatus()

  const handleStatusUpdate = async () => {
    if (!orderId || !selectedStatus) return

    try {
      await updateStatusMutation.mutateAsync({
        data: {
          orderId,
          status: selectedStatus,
          estimatedDelivery: estimatedDelivery || undefined,
          actualDelivery: actualDelivery || undefined,
        }
      })
      
      toast.success('Order status updated successfully')
      onOpenChange(false)
    } catch (error) {
      toast.error('Failed to update order status')
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Entregado': return 'default'
      case 'En Tránsito': return 'outline'
      case 'Procesando': return 'secondary'
      default: return 'secondary'
    }
  }

  if (!orderId) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order #{orderId} Details
          </DialogTitle>
          <DialogDescription>
            View and manage order information, customer details, and update status
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading order details...</span>
          </div>
        ) : orderDetails ? (
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order Summary</span>
                  <Badge variant={getStatusVariant(orderDetails.estado_pedido)}>
                    {orderDetails.estado_pedido}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Order Date</Label>
                  <p className="font-medium">
                    {new Date(orderDetails.fecha_orden).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Total Amount</Label>
                  <p className="font-medium text-green-600">{orderDetails.total_orden}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Payment Method</Label>
                  <p className="font-medium">{orderDetails.metodo_pago || 'Not specified'}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Estimated Delivery</Label>
                  <p className="font-medium">
                    {orderDetails.fecha_entrega_estimada 
                      ? new Date(orderDetails.fecha_entrega_estimada).toLocaleDateString()
                      : 'Not set'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Name</Label>
                  <p className="font-medium">{orderDetails.customer_name}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Email</Label>
                  <p className="font-medium">{orderDetails.customer_email}</p>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Shipping Address
                  </Label>
                  <p className="font-medium">{orderDetails.direccion_envio}</p>
                </div>
              </CardContent>
            </Card>

            {/* Order Products */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>Products included in this order</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderDetails.products?.map((product: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{product.nombre_producto}</h4>
                        <p className="text-sm text-muted-foreground">
                          {product.nombre_color} • {product.descripcion_talla}
                          {product.sku && ` • SKU: ${product.sku}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">Qty: {product.cantidad}</p>
                        <p className="text-sm text-muted-foreground">{product.precio_unitario} each</p>
                        <p className="font-medium text-green-600">{product.subtotal}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* Status Update Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Update Order Status
                </CardTitle>
                <CardDescription>
                  Change the order status and set delivery dates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="status">New Status</Label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            <div className="flex items-center gap-2">
                              <status.icon className={`h-4 w-4 ${status.color}`} />
                              {status.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="estimated-delivery">Estimated Delivery</Label>
                    <Input
                      id="estimated-delivery"
                      type="date"
                      value={estimatedDelivery}
                      onChange={(e) => setEstimatedDelivery(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="actual-delivery">Actual Delivery</Label>
                    <Input
                      id="actual-delivery"
                      type="date"
                      value={actualDelivery}
                      onChange={(e) => setActualDelivery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={handleStatusUpdate}
                    disabled={!selectedStatus || updateStatusMutation.isPending}
                  >
                    {updateStatusMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Status'
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Order not found</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 