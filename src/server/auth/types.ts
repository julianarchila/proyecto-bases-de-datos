import { z } from 'zod'

// Zod schemas for validation
export const sendAuthCodeSchema = z.object({
  email: z.string().email('Por favor, ingresa una dirección de correo electrónico válida')
})

export const verifyAuthCodeSchema = z.object({
  email: z.string().email('Por favor, ingresa una dirección de correo electrónico válida'),
  code: z.string()
    .length(6, 'El código debe tener exactamente 6 dígitos')
    .regex(/^\d{6}$/, 'El código debe contener solo números')
})

export const validateTokenSchema = z.object({
  token: z.string().min(1, 'El token es requerido')
})

// Request/Response types
export type SendAuthCodeRequest = z.infer<typeof sendAuthCodeSchema>
export type VerifyAuthCodeRequest = z.infer<typeof verifyAuthCodeSchema>
export type ValidateTokenRequest = z.infer<typeof validateTokenSchema>

export interface SendAuthCodeResponse {
  success: boolean
  message: string
}

export interface VerifyAuthCodeResponse {
  success: boolean
  token?: string
  user?: {
    id_persona: number
    email: string
    user_type: 'cliente' | 'empleado'
    nombre: string
    apellido: string
  }
  message: string
}

export interface ValidateTokenResponse {
  valid: boolean
  user?: {
    id_persona: number
    email: string
    user_type: 'cliente' | 'empleado'
    nombre: string
    apellido: string
  }
}

// JWT payload type
export interface JWTPayload {
  id_persona: number
  email: string
  user_type: 'cliente' | 'empleado'
  nombre: string
  apellido: string
  iat: number
  exp: number
}

// Error types
export class AuthError extends Error {
  constructor(message: string, public code: string) {
    super(message)
    this.name = 'AuthError'
  }
}

export const AUTH_ERRORS = {
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  INVALID_CODE: 'INVALID_CODE',
  CODE_EXPIRED: 'CODE_EXPIRED',
  CODE_ALREADY_USED: 'CODE_ALREADY_USED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  RATE_LIMITED: 'RATE_LIMITED',
  EMAIL_SEND_FAILED: 'EMAIL_SEND_FAILED'
} as const 