
const useTodoStore = create(
  persist(
    (set, get) => ({
      todos: [
        {
          id: '1',
          title: 'Welcome to your Todo App',
          description: 'This is your first todo item. You can edit or delete it.',
          completed: false,
          priority: 'medium',
          category: 'personal',
          dueDate: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Try the glassmorphism design',
          description: 'Notice the beautiful glass-like effects throughout the app.',
          completed: false,
          priority: 'low',
          category: 'personal',
          dueDate: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      filter: 'all', // all, active, completed
      sortBy: 'createdAt', // createdAt, dueDate, priority, title
      sortOrder: 'desc', // asc, desc
      searchQuery: '',
      selectedCategory: 'all',
      categories: ['personal', 'work', 'shopping', 'health'],

      // Actions
      addTodo: (todo) => {
        const newTodo = {
          id: crypto.randomUUID(),
          title: todo.title,
          description: todo.description || '',
          completed: false,
          priority: todo.priority || 'medium',
          category: todo.category || 'personal',
          dueDate: todo.dueDate || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((state) => ({
          todos: [newTodo, ...state.todos],
        }))
      },

      updateTodo: (id, updates) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? {
                  ...todo,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : todo
          ),
        }))
      },

      deleteTodo: (id) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        }))
      },

      toggleTodo: (id) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? {
                  ...todo,
                  completed: !todo.completed,
                  updatedAt: new Date().toISOString(),
                }
              : todo
          ),
        }))
      },

      toggleAll: () => {
        const { todos } = get()
        const allCompleted = todos.every((todo) => todo.completed)
        set((state) => ({
          todos: state.todos.map((todo) => ({
            ...todo,
            completed: !allCompleted,
            updatedAt: new Date().toISOString(),
          })),
        }))
      },

      clearCompleted: () => {
        set((state) => ({
          todos: state.todos.filter((todo) => !todo.completed),
        }))
      },

      setFilter: (filter) => {
        set({ filter })
      },

      setSortBy: (sortBy) => {
        set((state) => ({
          sortBy,
          sortOrder: state.sortBy === sortBy && state.sortOrder === 'desc' ? 'asc' : 'desc',
        }))
      },

      setSortOrder: (sortOrder) => {
        set({ sortOrder })
      },

      setSearchQuery: (searchQuery) => {
        set({ searchQuery })
      },

      setSelectedCategory: (selectedCategory) => {
        set({ selectedCategory })
      },

      addCategory: (category) => {
        set((state) => ({
          categories: [...state.categories, category].sort(),
        }))
      },

      removeCategory: (category) => {
        set((state) => ({
          categories: state.categories.filter((cat) => cat !== category),
          todos: state.todos.map((todo) =>
            todo.category === category
              ? { ...todo, category: 'personal', updatedAt: new Date().toISOString() }
              : todo
          ),
        }))
      },

      // Computed getters
      getFilteredTodos: () => {
        const { todos, filter, searchQuery, selectedCategory, sortBy, sortOrder } = get()
        
        let filtered = todos

        // Filter by completion status
        if (filter === 'active') {
          filtered = filtered.filter((todo) => !todo.completed)
        } else if (filter === 'completed') {
          filtered = filtered.filter((todo) => todo.completed)
        }

        // Filter by category
        if (selectedCategory !== 'all') {
          filtered = filtered.filter((todo) => todo.category === selectedCategory)
        }

        // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          filtered = filtered.filter(
            (todo) =>
              todo.title.toLowerCase().includes(query) ||
              todo.description.toLowerCase().includes(query)
          )
        }

        // Sort todos
        filtered.sort((a, b) => {
          let aValue, bValue

          switch (sortBy) {
            case 'title':
              aValue = a.title.toLowerCase()
              bValue = b.title.toLowerCase()
              break
            case 'priority':
              const priorityOrder = { high: 3, medium: 2, low: 1 }
              aValue = priorityOrder[a.priority]
              bValue = priorityOrder[b.priority]
              break
            case 'dueDate':
              aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0
              bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0
              break
            case 'createdAt':
            default:
              aValue = new Date(a.createdAt).getTime()
              bValue = new Date(b.createdAt).getTime()
              break
          }

          if (sortOrder === 'asc') {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
          } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
          }
        })

        return filtered
      },

      getTodoStats: () => {
        const { todos } = get()
        const total = todos.length
        const completed = todos.filter((todo) => todo.completed).length
        const active = total - completed
        const overdue = todos.filter((todo) => {
          if (!todo.dueDate || todo.completed) return false
          return new Date(todo.dueDate) < new Date()
        }).length

        return { total, completed, active, overdue }
      },

      getTodosByCategory: () => {
        const { todos, categories } = get()
        return categories.reduce((acc, category) => {
          acc[category] = todos.filter((todo) => todo.category === category)
          return acc
        }, {})
      },

      getTodoById: (id) => {
        const { todos } = get()
        return todos.find((todo) => todo.id === id)
      },

      // Bulk operations
      bulkUpdate: (ids, updates) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            ids.includes(todo.id)
              ? {
                  ...todo,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : todo
          ),
        }))
      },

      bulkDelete: (ids) => {
        set((state) => ({
          todos: state.todos.filter((todo) => !ids.includes(todo.id)),
        }))
      },

      // Import/Export
      exportTodos: () => {
        const { todos } = get()
        return JSON.stringify(todos, null, 2)
      },

      importTodos: (todosJson) => {
        try {
          const importedTodos = JSON.parse(todosJson)
          if (Array.isArray(importedTodos)) {
            set({ todos: importedTodos })
            return true
          }
          return false
        } catch (error) {
          console.error('Failed to import todos:', error)
          return false
        }
      },

      // Reset
      reset: () => {
        set({
          todos: [],
          filter: 'all',
          sortBy: 'createdAt',
          sortOrder: 'desc',
          searchQuery: '',
          selectedCategory: 'all',
        })
      },
    }),
    {
      name: 'glassmorphism-todos',
      version: 1,
      partialize: (state) => ({
        todos: state.todos,
        categories: state.categories,
        filter: state.filter,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
        selectedCategory: state.selectedCategory,
      }),
    }
  )
)

export default useTodoStore