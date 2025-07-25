import { createServerFn } from '@tanstack/react-start'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { getCookie, setCookie, deleteCookie } from '@tanstack/react-start/server'
import { env } from '@/env'
import { DB } from '@/server/db/queries.sql'
import { sendAuthCodeEmail } from '@/server/email/service'
import {
  sendAuthCodeSchema,
  verifyAuthCodeSchema,
  validateTokenSchema,
  type SendAuthCodeResponse,
  type VerifyAuthCodeResponse,
  type ValidateTokenResponse,
  type JWTPayload,
  AuthError,
  AUTH_ERRORS
} from './types'

// Helper function to generate 6-digit code
function generateAuthCode(): string {
  return crypto.randomInt(100000, 999999).toString()
}

// Helper function to get JWT secret (you'll need to add this to your .env)
function getJWTSecret(): string {
  if (!env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required')
  }
  return env.JWT_SECRET
}

// Helper function to create JWT token
function createJWTToken(user: {
  id_persona: number
  email: string
  user_type: 'cliente' | 'empleado'
  nombre: string
  apellido: string
}): string {
  const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
    id_persona: user.id_persona,
    email: user.email,
    user_type: user.user_type,
    nombre: user.nombre,
    apellido: user.apellido
  }

  return jwt.sign(payload, getJWTSecret(), {
    expiresIn: '7d' // 7 days
  })
}

// Helper function to verify JWT token
function verifyJWTToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, getJWTSecret()) as JWTPayload
    return decoded
  } catch (error) {
    return null
  }
}

// Helper function to get stored token from cookies
function getStoredToken(): string | null {
  return getCookie('auth_token') || null
}

// Helper function to set auth token cookie
function setAuthTokenCookie(token: string): void {
  setCookie('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    path: '/'
  })
}

// Helper function to clear auth token cookie
function clearAuthTokenCookie(): void {
  deleteCookie('auth_token', {
    path: '/'
  })
}

// Server function to send authentication code
export const sendAuthCode = createServerFn()
  .validator(sendAuthCodeSchema)
  .handler(async ({ data }): Promise<SendAuthCodeResponse> => {
    try {
      // Check if user exists in database
      const user = await DB.getUserByEmail(data.email)
      
      if (!user) {
        throw new AuthError(
          'Usuario no encontrado. Por favor, contacta a un administrador.',
          AUTH_ERRORS.USER_NOT_FOUND
        )
      }

      // Generate and store auth code
      const code = generateAuthCode()
      await DB.createAuthCode(data.email, code)

      // Send auth code via email
      try {
        await sendAuthCodeEmail({
          to: data.email,
          code,
          userName: `${user.nombre} ${user.apellido}`.trim()
        })
      } catch (emailError) {
        console.error('Failed to send auth code email:', emailError)
        // Still log to console in development as fallback
        if (process.env.NODE_ENV === 'development') {
          console.log(`🔐 Auth code for ${data.email}: ${code}`)
        }
        throw new AuthError(
          'Error al enviar el código de verificación. Por favor, inténtalo de nuevo.',
          AUTH_ERRORS.EMAIL_SEND_FAILED
        )
      }

      // In development, also log the code to console for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔐 Auth code for ${data.email}: ${code}`)
      }

      // Clean up expired codes
      await DB.cleanupExpiredCodes()

      return {
        success: true,
        message: 'Código de verificación enviado exitosamente'
      }
    } catch (error) {
      if (error instanceof AuthError) {
        return {
          success: false,
          message: error.message
        }
      }

      console.error('Error sending auth code:', error)
      return {
        success: false,
        message: 'Error al enviar el código de verificación. Por favor, inténtalo de nuevo.'
      }
    }
  })

// Server function to verify authentication code and generate JWT
export const verifyAuthCode = createServerFn()
  .validator(verifyAuthCodeSchema)
  .handler(async ({ data }): Promise<VerifyAuthCodeResponse> => {
    try {
      // Verify the code
      const isValidCode = await DB.verifyAuthCode(data.email, data.code)
      
      if (!isValidCode) {
        throw new AuthError(
          'Código de verificación inválido o expirado. Por favor, solicita uno nuevo.',
          AUTH_ERRORS.INVALID_CODE
        )
      }

      // Get user details
      const user = await DB.getUserByEmail(data.email)
      
      if (!user) {
        throw new AuthError(
          'Usuario no encontrado.',
          AUTH_ERRORS.USER_NOT_FOUND
        )
      }

      // Generate JWT token and set cookie
      const authUser = DB.getAuthUserFromUserWithType(user)
      const token = createJWTToken(authUser)
      setAuthTokenCookie(token)

      // Clean up expired codes (optional cleanup)
      await DB.cleanupExpiredCodes()

      return {
        success: true,
        token,
        user: authUser,
        message: 'Autenticación exitosa'
      }
    } catch (error) {
      if (error instanceof AuthError) {
        return {
          success: false,
          message: error.message
        }
      }

      console.error('Error verifying auth code:', error)
      return {
        success: false,
        message: 'Error al verificar el código. Por favor, inténtalo de nuevo.'
      }
    }
  })

// Server function to validate JWT token and get user data
export const validateToken = createServerFn()
  .validator(validateTokenSchema)
  .handler(async ({ data }): Promise<ValidateTokenResponse> => {
    try {
      const decoded = verifyJWTToken(data.token)
      
      if (!decoded) {
        return {
          valid: false
        }
      }

      // Verify user still exists and is active
      const user = await DB.getUserByEmail(decoded.email)
      
      if (!user) {
        return {
          valid: false
        }
      }

      return {
        valid: true,
        user: {
          id_persona: decoded.id_persona,
          email: decoded.email,
          user_type: decoded.user_type,
          nombre: decoded.nombre,
          apellido: decoded.apellido
        }
      }
    } catch (error) {
      console.error('Error validating token:', error)
      return {
        valid: false
      }
    }
  })

// Server function to get current user (for router context)
export const fetchUser = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const token = getStoredToken()
    
    if (!token) {
      console.log('🔍 fetchUser: No auth token found in cookies')
      return null
    }

    console.log('🔍 fetchUser: Token found, validating...')
    const result = await validateToken({ data: { token } })
    
    if (result.valid && result.user) {
      console.log(`🔍 fetchUser: Valid token for user ${result.user.email}`)
      return result.user
    } else {
      console.log('🔍 fetchUser: Invalid token, returning null')
      return null
    }
  } catch (error) {
    console.error('❌ Error fetching user:', error)
    return null
  }
})

// Server function to logout user
export const logoutUser = createServerFn({ method: 'POST' }).handler(async () => {
  try {
    clearAuthTokenCookie()
    return {
      success: true,
      message: 'Sesión cerrada exitosamente'
    }
  } catch (error) {
    console.error('Error during logout:', error)
    return {
      success: false,
      message: 'Error al cerrar sesión. Por favor, inténtalo de nuevo.'
    }
  }
}) 
