import {
  Outlet,
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import * as React from 'react'

import TanStackQueryLayout from '../integrations/tanstack-query/layout.tsx'
import { getSession } from '../data-access/auth'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import type { AuthUser } from '../server/db/types'
import { Toaster } from '@/components/ui/sonner.tsx'

interface MyRouterContext {
  queryClient: QueryClient
  session: AuthUser | null
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page Not Found</p>
      <p className="text-gray-500">The page you're looking for doesn't exist.</p>
    </div>
  )
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    // Uses TanStack Query caching under the hood
    const session = await getSession()
    console.log('Session loaded:', session)
    return { session }
  },

  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'PBD Store - Plataforma E-commerce | Proyecto Final Base de Datos',
      },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),

  errorComponent: (props) => {
    return (
      <RootDocument>
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Something went wrong!</h1>
          <p className="text-xl text-gray-600 mb-8">An error occurred</p>
          <pre className="text-sm text-gray-500">{String(props.error)}</pre>
        </div>
      </RootDocument>
    )
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Toaster />
        <TanStackRouterDevtools position="bottom-right" />
        <TanStackQueryLayout />
        <Scripts />
      </body>
    </html>
  )
}
