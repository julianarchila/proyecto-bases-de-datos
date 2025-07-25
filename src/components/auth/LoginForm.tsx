import { useSendAuthCode } from '@/data-access/auth'
import { sendAuthCodeSchema } from '@/server/auth/types'
import { useAppForm } from '@/components/ui/tanstack-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from '@tanstack/react-router'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

export function LoginForm() {
  const router = useRouter()
  const sendCodeMutation = useSendAuthCode()
  const [showSuccess, setShowSuccess] = useState(false)

  const form = useAppForm({
    validators: {
      onChange: sendAuthCodeSchema
    },
    defaultValues: {
      email: '',
    },
    onSubmit: async ({ value }) => {
      try {
        const result = await sendCodeMutation.mutateAsync({
          data: value
        })
        
        if (result.success) {
          toast.success('¡Código de verificación enviado!', {
            description: 'Revisa tu correo electrónico para el código de 6 dígitos.'
          })
          setShowSuccess(true)
          // Navigate to verification page with email as search param
          router.navigate({ 
            to: '/auth/verify',
            search: { email: value.email }
          })
        } else {
          toast.error('Error al enviar el código', {
            description: result.message
          })
        }
      } catch (error) {
        console.error('Failed to send auth code:', error)
        toast.error('Algo salió mal', {
          description: 'Por favor, inténtalo de nuevo más tarde.'
        })
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

  if (showSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-green-600">¡Código Enviado!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p>Revisa tu correo electrónico para el código de verificación.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Redirigiendo a la página de verificación...
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Iniciar Sesión</CardTitle>
      </CardHeader>
      <CardContent>
        <form.AppForm>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <form.AppField
              name="email"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel>Dirección de Correo Electrónico</field.FormLabel>
                  <field.FormControl>
                    <Input
                      type="email"
                      placeholder="Ingresa tu dirección de correo"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      autoComplete="email"
                    />
                  </field.FormControl>
                  <field.FormDescription>
                    Ingresa la dirección de correo asociada con tu cuenta.
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
                  {isSubmitting ? 'Enviando Código...' : 'Enviar Código de Verificación'}
                </Button>
              )}
            </form.Subscribe>

            <div className="text-center text-sm text-muted-foreground">
              <p>Se enviará un código de verificación de 6 dígitos a tu correo.</p>
              <p className="mt-1">¿No tienes una cuenta? Contacta a tu administrador.</p>
            </div>
          </form>
        </form.AppForm>
      </CardContent>
    </Card>
  )
} 