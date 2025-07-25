import { useTodos, useToggleTodo } from '@/data-access/todo'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2 } from 'lucide-react'

export function TodoList() {
  const { data: todos, isLoading } = useTodos()
  const { toggleTodo } = useToggleTodo()

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Cargando tareas...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Mis Tareas</CardTitle>
      </CardHeader>
      <CardContent>
        {todos && todos.length > 0 ? (
          <div className="space-y-3">
            {todos.map((todo) => (
              <div key={todo.id} className="flex items-center space-x-3">
                                 <Checkbox
                   checked={todo.completed}
                   onCheckedChange={() => toggleTodo(todo)}
                 />
                <span className={`flex-1 ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {todo.title}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No hay tareas aún. ¡Agrega tu primera tarea arriba!
          </p>
        )}
      </CardContent>
    </Card>
  )
} 
