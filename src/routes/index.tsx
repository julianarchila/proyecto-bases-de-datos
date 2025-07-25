import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ShoppingCart, Users, BarChart3, Truck, Tags } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingHeader({ session }: { session: any }) {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="font-bold text-xl">
          <Link to="/" className="text-gray-900 hover:text-blue-600 transition-colors">
            🏪 PBD Store
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <Link to="/dashboard">
              <Button size="sm">
                Ir al Panel
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button size="sm">
                Iniciar Sesión
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}

function LandingPage() {
  // Get session from route context instead of useSession hook to avoid hydration issues
  const { session } = Route.useRouteContext()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <LandingHeader session={session} />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-blue-600">PBD Store</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
              Sistema de gestión para tienda de ropa en línea con catálogo de productos, 
              control de inventario, procesamiento de órdenes y paneles administrativos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {session ? (
                <Link to="/dashboard">
                  <Button size="lg" className="text-lg px-8 py-3">
                    Ir al Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button size="lg" className="text-lg px-8 py-3">
                    Acceder al Sistema
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Funcionalidades del Sistema
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explora las diferentes características y módulos disponibles en la plataforma.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Catálogo de Productos</h3>
              <p className="text-gray-600">
                Gestión completa de productos organizados por categorías y marcas, 
                con variantes de talla y color para cada artículo.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tags className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Control de Inventario</h3>
              <p className="text-gray-600">
                Seguimiento de stock en tiempo real para cada variante de producto, 
                con alertas de productos con bajo inventario.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Gestión de Órdenes</h3>
              <p className="text-gray-600">
                Procesamiento completo de pedidos desde la creación hasta el despacho, 
                con seguimiento de estado y historial detallado.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Gestión de Clientes</h3>
              <p className="text-gray-600">
                Administración de información de clientes, historial de compras 
                y paneles diferenciados por tipo de usuario.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Gestión de Proveedores</h3>
              <p className="text-gray-600">
                Módulo para administrar información de proveedores 
                y su relación con el inventario de productos.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Reportes y Métricas</h3>
              <p className="text-gray-600">
                Dashboard con indicadores clave, reportes de ventas, 
                análisis de inventario y métricas operacionales.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Access Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Acceso al Sistema
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            El sistema cuenta con diferentes tipos de usuario con acceso a módulos específicos 
            según su rol: clientes para realizar compras y empleados para gestión administrativa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {session ? (
              <Link to="/dashboard">
                <Button size="lg" variant="default" className="text-lg px-8 py-3">
                  Ir al Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button size="lg" variant="default" className="text-lg px-8 py-3">
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Academic Attribution */}
      <div className="py-8 bg-gray-100 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Proyecto de la materia Bases de Datos - Universidad Nacional de Colombia
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
