import { z } from 'zod'
import { useCallback } from 'react'
import { useAppForm } from '@/components/ui/tanstack-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCreateTodo } from '@/data-access/todo'

const createTodoSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
})

export function TodoForm() {
  const createTodo = useCreateTodo()

  const form = useAppForm({
    defaultValues: {
      title: '',
    },
    onSubmit: async ({ value }) => {
      await createTodo.mutateAsync({ data: value })
      form.reset()
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

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Agregar Nueva Tarea</CardTitle>
      </CardHeader>
      <CardContent>
        <form.AppForm>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <form.AppField
              name="title"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel>Título de la Tarea</field.FormLabel>
                  <field.FormControl>
                    <Input
                      placeholder="¿Qué necesitas hacer?"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </field.FormControl>
                  <field.FormDescription>
                    Ingresa una descripción clara de la tarea que quieres completar.
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
                  {isSubmitting ? 'Agregando...' : 'Agregar Tarea'}
                </Button>
              )}
            </form.Subscribe>
          </form>
        </form.AppForm>
      </CardContent>
    </Card>
  )
} 
