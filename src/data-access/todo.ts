import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getTodos, createTodo, updateTodo, deleteTodo } from '@/server/todos/actions'
import type { Todo, CreateTodo, UpdateTodo } from '@/server/todos/types'

// Query keys
export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (filters: string) => [...todoKeys.lists(), { filters }] as const,
  details: () => [...todoKeys.all, 'detail'] as const,
  detail: (id: string) => [...todoKeys.details(), id] as const,
}

// Query hooks
export function useTodos() {
  return useQuery({
    queryKey: todoKeys.all,
    queryFn: () => getTodos(),
  })
}

// Mutation hooks
export function useCreateTodo() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.all })
    },
  })
}

export function useUpdateTodo() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.all })
    },
  })
}

export function useDeleteTodo() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.all })
    },
  })
}

// Compound hooks for common operations
export function useToggleTodo() {
  const updateMutation = useUpdateTodo()
  
  return {
    toggleTodo: (todo: Todo) => {
      updateMutation.mutate({
        data: {
          id: todo.id,
          completed: !todo.completed,
        }
      })
    },
    isPending: updateMutation.isPending,
  }
}

export function useRemoveTodo() {
  const deleteMutation = useDeleteTodo()
  
  return {
    removeTodo: (id: string) => {
      deleteMutation.mutate({
        data: id
      })
    },
    isPending: deleteMutation.isPending,
  }
}
