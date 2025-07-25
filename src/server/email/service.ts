import { Resend } from 'resend'
import { env } from '@/env'

const resend = new Resend(env.RESEND_API_KEY)

export interface SendAuthCodeEmailParams {
  to: string
  code: string
  userName?: string
}

export async function sendAuthCodeEmail({ to, code, userName }: SendAuthCodeEmailParams): Promise<void> {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Sistema PBD <noreply@transactional.jarchilac.cfd>',
      to: [to],
      subject: 'Tu Código de Verificación PBD',
      html: createAuthCodeEmailTemplate(code, userName),
      text: createAuthCodeEmailTextTemplate(code, userName),
    })

    if (error) {
      console.error('Resend API error:', error)
      throw new Error(`Failed to send email: ${error.message}`)
    }

    console.log('✅ Auth code email sent successfully:', data?.id)
  } catch (error) {
    console.error('❌ Error sending auth code email:', error)
    throw error
  }
}

function createAuthCodeEmailTemplate(code: string, userName?: string): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Código de Verificación PBD</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background-color: white;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
        }
        .code-container {
            background-color: #f1f5f9;
            border: 2px dashed #cbd5e1;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
        }
        .code {
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 4px;
            color: #1e293b;
            font-family: 'Courier New', monospace;
        }
        .warning {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
            font-size: 14px;
        }
        .button {
            display: inline-block;
            background-color: #2563eb;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Sistema PBD</div>
            <h1>Código de Verificación</h1>
        </div>
        
        <p>Hola${userName ? ` ${userName}` : ''},</p>
        
        <p>Solicitaste iniciar sesión en tu cuenta de PBD. Por favor, usa el código de verificación a continuación para completar tu inicio de sesión:</p>
        
        <div class="code-container">
            <div class="code">${code}</div>
        </div>
        
        <div class="warning">
            <strong>⚠️ Aviso de Seguridad:</strong>
            <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Este código expira en 15 minutos</li>
                <li>Nunca compartas este código con nadie</li>
                <li>Si no solicitaste este código, por favor ignora este correo</li>
            </ul>
        </div>
        
        <p>Si tienes problemas, puedes solicitar un nuevo código de verificación desde la página de inicio de sesión.</p>
        
        <div class="footer">
            <p>Este correo fue enviado desde el Sistema PBD. Si tienes alguna pregunta, por favor contacta a soporte.</p>
            <p>&copy; ${new Date().getFullYear()} Sistema PBD. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
  `.trim()
}

function createAuthCodeEmailTextTemplate(code: string, userName?: string): string {
  return `
Sistema PBD - Código de Verificación

Hola${userName ? ` ${userName}` : ''},

Solicitaste iniciar sesión en tu cuenta de PBD. Por favor, usa el código de verificación a continuación para completar tu inicio de sesión:

CÓDIGO DE VERIFICACIÓN: ${code}

AVISO DE SEGURIDAD:
- Este código expira en 15 minutos
- Nunca compartas este código con nadie
- Si no solicitaste este código, por favor ignora este correo

Si tienes problemas, puedes solicitar un nuevo código de verificación desde la página de inicio de sesión.

© ${new Date().getFullYear()} Sistema PBD. Todos los derechos reservados.
  `.trim()
} 