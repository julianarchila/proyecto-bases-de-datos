import { useVerifyAuthCode, useSendAuthCode } from '@/data-access/auth'
import { verifyAuthCodeSchema } from '@/server/auth/types'
import { useAppForm } from '@/components/ui/tanstack-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

interface CodeVerificationFormProps {
  email: string
}

export function CodeVerificationForm({ email }: CodeVerificationFormProps) {
  const verifyCodeMutation = useVerifyAuthCode()
  const resendCodeMutation = useSendAuthCode()
  const [resendCooldown, setResendCooldown] = useState(0)

  const form = useAppForm({
    validators: {
      onChange: verifyAuthCodeSchema
    },
    defaultValues: {
      email,
      code: '',
    },
    onSubmit: async ({ value }) => {
      try {
        await verifyCodeMutation.mutateAsync({
          data: value
        })
        // Success handling is done in the mutation's onSuccess callback
      } catch (error) {
        console.error('Failed to verify auth code:', error)
      }
    },
  })

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      e.stopPropagation()
      form.handleSubmit()
    },
    [form],
  )

  const handleResendCode = useCallback(async () => {
    if (resendCooldown > 0) return

    try {
      const result = await resendCodeMutation.mutateAsync({
        data: { email }
      })
      
      if (result.success) {
        toast.success('¡Código reenviado!', {
          description: 'Revisa tu correo electrónico para el nuevo código de verificación.'
        })
        // Start 60-second cooldown
        setResendCooldown(60)
        const timer = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } else {
        toast.error('Error al reenviar el código', {
          description: result.message
        })
      }
    } catch (error) {
      console.error('Failed to resend code:', error)
      toast.error('Algo salió mal', {
        description: 'Error al reenviar el código. Por favor, inténtalo de nuevo.'
      })
    }
  }, [email, resendCodeMutation, resendCooldown])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Ingresa el Código de Verificación</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground">
            Enviamos un código de 6 dígitos a
          </p>
          <p className="font-medium">{email}</p>
        </div>

        <form.AppForm>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <form.AppField
              name="code"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel>Código de Verificación</field.FormLabel>
                  <field.FormControl>
                    <Input
                      type="text"
                      placeholder="000000"
                      value={field.state.value}
                      onChange={(e) => {
                        // Only allow numbers and limit to 6 digits
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                        field.handleChange(value)
                      }}
                      onBlur={field.handleBlur}
                      maxLength={6}
                      className="text-center text-2xl tracking-widest font-mono"
                      autoComplete="one-time-code"
                    />
                  </field.FormControl>
                  <field.FormDescription>
                    Ingresa el código de 6 dígitos de tu correo electrónico.
                  </field.FormDescription>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />



            <form.Subscribe selector={(state) => ({ isSubmitting: state.isSubmitting, canSubmit: state.canSubmit })}>
              {({ isSubmitting, canSubmit }) => (
                <Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? 'Verificando...' : 'Verificar Código'}
                </Button>
              )}
            </form.Subscribe>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                ¿No recibiste el código?
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={resendCooldown > 0 || resendCodeMutation.isPending}
                onClick={handleResendCode}
              >
                {resendCooldown > 0 
                  ? `Reenviar en ${resendCooldown}s`
                  : resendCodeMutation.isPending
                  ? 'Enviando...'
                  : 'Reenviar Código'
                }
              </Button>
            </div>
          </form>
        </form.AppForm>
      </CardContent>
    </Card>
  )
} 