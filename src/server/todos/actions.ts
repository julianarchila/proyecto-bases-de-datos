import { createServerFn } from '@tanstack/react-start'
import { createTodoSchema, updateTodoSchema, type Todo } from './types'

// In-memory storage for demo purposes
// In a real app, this would be a database
let todos: Todo[] = [
  {
    id: '1',
    title: 'Learn TanStack Start',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Build a todo app',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export const getTodos = createServerFn().handler(async () => {
  await new Promise(resolve => setTimeout(resolve, 100))
  return todos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
})

export const createTodo = createServerFn()
  .validator(createTodoSchema)
  .handler(async ({ data }) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200))

    const newTodo: Todo = {
      id: Date.now().toString(),
      title: data.title,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    todos.push(newTodo)
    return newTodo
  })

export const updateTodo = createServerFn()
  .validator(updateTodoSchema)
  .handler(async ({ data }) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 150))

    const todoIndex = todos.findIndex(todo => todo.id === data.id)
    if (todoIndex === -1) {
      throw new Error('Todo not found')
    }

    const updatedTodo: Todo = {
      ...todos[todoIndex],
      ...data,
      updatedAt: new Date(),
    }

    todos[todoIndex] = updatedTodo
    return updatedTodo
  })

export const deleteTodo = createServerFn()
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100))

    const todoIndex = todos.findIndex(todo => todo.id === id)
    if (todoIndex === -1) {
      throw new Error('Todo not found')
    }

    const deletedTodo = todos[todoIndex]
    todos.splice(todoIndex, 1)
    return deletedTodo
  }) 
