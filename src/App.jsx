import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, CheckCircle2, Circle, Calendar, User, Settings, Home, Search } from 'lucide-react'
import { cn } from './lib/utils'

// Main Todo App Component
function TodoApp() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Complete project documentation', completed: false, priority: 'high' },
    { id: 2, text: 'Review code changes', completed: true, priority: 'medium' },
    { id: 3, text: 'Update dependencies', completed: false, priority: 'low' },
  ])
  const [newTodo, setNewTodo] = useState('')
  const [filter, setFilter] = useState('all')

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: newTodo,
        completed: false,
        priority: 'medium'
      }])
      setNewTodo('')
    }
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4 pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-lg bg-white/20 rounded-2xl p-6 mb-6 border border-white/30 shadow-xl"
        >
          <h1 className="text-2xl font-bold text-white mb-2">My Tasks</h1>
          <p className="text-white/80 text-sm">
            {todos.filter(t => !t.completed).length} tasks remaining
          </p>
        </motion.div>

        {/* Add Todo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-lg bg-white/20 rounded-2xl p-4 mb-6 border border-white/30 shadow-xl"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="Add a new task..."
              className="flex-1 bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              onClick={addTodo}
              className="bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl p-3 text-white transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-lg bg-white/20 rounded-2xl p-2 mb-6 border border-white/30 shadow-xl"
        >
          <div className="flex gap-1">
            {['all', 'active', 'completed'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={cn(
                  "flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors capitalize",
                  filter === filterType
                    ? "bg-white/30 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
              >
                {filterType}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Todo List */}
        <div className="space-y-3">
          <AnimatePresence>
            {filteredTodos.map((todo, index) => (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="backdrop-blur-lg bg-white/20 rounded-2xl p-4 border border-white/30 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="text-white hover:text-white/80 transition-colors"
                  >
                    {todo.completed ? (
                      <CheckCircle2 size={20} className="text-green-300" />
                    ) : (
                      <Circle size={20} />
                    )}
                  </button>
                  <span
                    className={cn(
                      "flex-1 text-white transition-all",
                      todo.completed && "line-through opacity-60"
                    )}
                  >
                    {todo.text}
                  </span>
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      todo.priority === 'high' && "bg-red-500/30 text-red-100",
                      todo.priority === 'medium' && "bg-yellow-500/30 text-yellow-100",
                      todo.priority === 'low' && "bg-green-500/30 text-green-100"
                    )}
                  >
                    {todo.priority}
                  </span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-white/60 hover:text-red-300 transition-colors text-sm"
                  >
                    ×
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredTodos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="backdrop-blur-lg bg-white/20 rounded-2xl p-8 border border-white/30 shadow-xl">
              <p className="text-white/60">No tasks found</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// Profile Component
function Profile() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4 pb-20">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-lg bg-white/20 rounded-2xl p-6 mb-6 border border-white/30 shadow-xl"
        >
          <div className="text-center">
            <div className="w-20 h-20 bg-white/30 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User size={32} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">John Doe</h2>
            <p className="text-white/80">john.doe@example.com</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-lg bg-white/20 rounded-2xl p-6 border border-white/30 shadow-xl"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">24</div>
              <div className="text-white/80 text-sm">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">8</div>
              <div className="text-white/80 text-sm">Pending</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Calendar Component
function CalendarView() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-500 p-4 pb-20">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-lg bg-white/20 rounded-2xl p-6 border border-white/30 shadow-xl"
        >
          <h2 className="text-xl font-bold text-white mb-4">Calendar</h2>
          <div className="text-center py-12">
            <Calendar size={48} className="text-white/60 mx-auto mb-4" />
            <p className="text-white/60">Calendar view coming soon</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Search Component
function SearchView() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 p-4 pb-20">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-lg bg-white/20 rounded-2xl p-6 border border-white/30 shadow-xl"
        >
          <h2 className="text-xl font-bold text-white mb-4">Search</h2>
          <div className="text-center py-12">
            <Search size={48} className="text-white/60 mx-auto mb-4" />
            <p className="text-white/60">Search functionality coming soon</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Bottom Navigation Component
function BottomNav() {
  const location = useLocation()
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/profile', icon: User, label: 'Profile' },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="backdrop-blur-lg bg-white/20 border-t border-white/30 shadow-xl">
        <div className="flex justify-around py-2">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path
            return (
              <a
                key={path}
                href={path}
                className={cn(
                  "flex flex-col items-center py-2 px-4 rounded-lg transition-colors",
                  isActive 
                    ? "text-white bg-white/20" 
                    : "text-white/60 hover:text-white hover:bg-white/10"
                )}
              >
                <Icon size={20} />
                <span className="text-xs mt-1">{label}</span>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Page Transition Wrapper
function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

// Main App Component
function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <AnimatePresence mode="wait">
          <Routes>
            <Route 
              path="/" 
              element={
                <PageTransition>
                  <TodoApp />
                </PageTransition>
              } 
            />
            <Route 
              path="/search" 
              element={
                <PageTransition>
                  <SearchView />
                </PageTransition>
              } 
            />
            <Route 
              path="/calendar" 
              element={
                <PageTransition>
                  <CalendarView />
                </PageTransition>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <PageTransition>
                  <Profile />
                </PageTransition>
              } 
            />
          </Routes>
        </AnimatePresence>
        <BottomNav />
      </div>
    </Router>
  )
}

export default App