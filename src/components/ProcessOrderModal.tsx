import { useState } from 'react'
import { useOrdersToProcess, useUpdateOrderStatus } from '@/data-access/dashboard'
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
import { Checkbox } from '@/components/ui/checkbox'
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
  Loader2,
  CheckCircle,
  Clock,
  Truck,
  Eye
} from 'lucide-react'
import { toast } from 'sonner'

interface ProcessOrderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onViewOrder?: (orderId: number) => void
}

export function ProcessOrderModal({ open, onOpenChange, onViewOrder }: ProcessOrderModalProps) {
  const [selectedOrders, setSelectedOrders] = useState<Set<number>>(new Set())
  const [bulkStatus, setBulkStatus] = useState<string>('')

  const { data: ordersToProcess, isLoading } = useOrdersToProcess()
  const updateStatusMutation = useUpdateOrderStatus()

  const handleOrderSelection = (orderId: number, checked: boolean) => {
    const newSelected = new Set(selectedOrders)
    if (checked) {
      newSelected.add(orderId)
    } else {
      newSelected.delete(orderId)
    }
    setSelectedOrders(newSelected)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked && ordersToProcess) {
      setSelectedOrders(new Set(ordersToProcess.map(order => order.id_orden)))
    } else {
      setSelectedOrders(new Set())
    }
  }

  const handleBulkStatusUpdate = async () => {
    if (selectedOrders.size === 0 || !bulkStatus) return

    try {
      const promises = Array.from(selectedOrders).map(orderId =>
        updateStatusMutation.mutateAsync({
          data: {
            orderId,
            status: bulkStatus,
          }
        })
      )

      await Promise.all(promises)
      
      toast.success(`Updated ${selectedOrders.size} orders to ${bulkStatus}`)
      setSelectedOrders(new Set())
      setBulkStatus('')
    } catch (error) {
      toast.error('Failed to update some orders')
    }
  }

  const statusOptions = [
    { value: 'En Tránsito', label: 'Mark as In Transit', icon: Truck },
    { value: 'Entregado', label: 'Mark as Delivered', icon: CheckCircle },
  ]

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Entregado': return 'default'
      case 'En Tránsito': return 'outline'
      case 'Procesando': return 'secondary'
      default: return 'secondary'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Process Orders
          </DialogTitle>
          <DialogDescription>
            Review and update the status of orders that need processing
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading orders to process...</span>
          </div>
        ) : ordersToProcess && ordersToProcess.length > 0 ? (
          <div className="space-y-6">
            {/* Bulk Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bulk Actions</CardTitle>
                <CardDescription>
                  Select orders and update their status in bulk
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {selectedOrders.size} of {ordersToProcess.length} selected
                  </span>
                </div>
                
                <Select value={bulkStatus} onValueChange={setBulkStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        <div className="flex items-center gap-2">
                          <status.icon className="h-4 w-4" />
                          {status.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button 
                  onClick={handleBulkStatusUpdate}
                  disabled={selectedOrders.size === 0 || !bulkStatus || updateStatusMutation.isPending}
                >
                  {updateStatusMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    `Update ${selectedOrders.size} Orders`
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Orders Table */}
            <Card>
              <CardHeader>
                <CardTitle>Orders Awaiting Processing</CardTitle>
                <CardDescription>
                  {ordersToProcess.length} orders with "Procesando" status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedOrders.size === ordersToProcess.length}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ordersToProcess.map((order) => (
                      <TableRow key={order.id_orden}>
                        <TableCell>
                          <Checkbox
                            checked={selectedOrders.has(order.id_orden)}
                            onCheckedChange={(checked) => 
                              handleOrderSelection(order.id_orden, checked as boolean)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">#{order.id_orden}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.fecha_orden).toLocaleDateString()}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.customer_name}</p>
                            <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">
                            {new Date(order.fecha_orden).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.fecha_orden).toLocaleTimeString()}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(order.estado_pedido)}>
                            {order.estado_pedido}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-green-600">{order.total_orden}</p>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => onViewOrder?.(order.id_orden)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <p className="text-lg font-medium">All caught up!</p>
            <p className="text-sm text-muted-foreground">
              No orders currently need processing
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 