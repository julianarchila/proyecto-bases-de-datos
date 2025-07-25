import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DB_CONNECTION_STRING: z.string(),
    JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters long'),
    RESEND_API_KEY: z.string()
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})


export const clientEnv = createEnv({
  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix: 'VITE_',

  client: {
    VITE_APP_TITLE: z.string().min(1).optional(),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
})
