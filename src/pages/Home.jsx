import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, CheckCircle2, Circle, Trash2, Edit3, Calendar, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editText, setEditText] = useState('');

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('glassmorphism-todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('glassmorphism-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim() === '') return;
    
    const todo = {
      id: Date.now(),
      text: newTodo.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      priority: 'medium'
    };
    
    setTodos([todo, ...todos]);
    setNewTodo('');
    setShowAddForm(false);
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEditing = (todo) => {
    setEditingTodo(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    if (editText.trim() === '') return;
    
    setTodos(todos.map(todo => 
      todo.id === editingTodo ? { ...todo, text: editText.trim() } : todo
    ));
    setEditingTodo(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingTodo(null);
    setEditText('');
  };

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'active' ? !todo.completed :
      filter === 'completed' ? todo.completed : true;
    
    return matchesSearch && matchesFilter;
  });

  const completedCount = todos.filter(todo => todo.completed).length;
  const activeCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 p-4 pb-20">
      {/* Header */}
      <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-6 mb-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">My Tasks</h1>
            <p className="text-white/70 text-sm">
              {activeCount} active, {completedCount} completed
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="backdrop-blur-lg bg-white/10 rounded-full p-2 border border-white/20">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div className="backdrop-blur-lg bg-white/10 rounded-full p-2 border border-white/20">
              <Clock className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex space-x-2">
          {['all', 'active', 'completed'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === filterType
                  ? 'bg-white/20 text-white border border-white/30'
                  : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Add Todo Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-4 mb-6 shadow-xl"
          >
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Add a new task..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                className="flex-1 px-4 py-3 backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                autoFocus
              />
              <button
                onClick={addTodo}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all border border-white/20"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-white rounded-xl transition-all border border-red-500/20"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Todo List */}
      <div className="space-y-3 mb-6">
        <AnimatePresence>
          {filteredTodos.map((todo) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-4 shadow-xl"
            >
              {editingTodo === todo.id ? (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                    className="flex-1 px-3 py-2 backdrop-blur-lg bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                    autoFocus
                  />
                  <button
                    onClick={saveEdit}
                    className="px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-white rounded-lg transition-all border border-green-500/20"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-lg transition-all border border-red-500/20"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="flex-shrink-0"
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-green-400" />
                    ) : (
                      <Circle className="w-6 h-6 text-white/50 hover:text-white transition-colors" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <p className={`text-white ${todo.completed ? 'line-through opacity-60' : ''}`}>
                      {todo.text}
                    </p>
                    <p className="text-white/40 text-xs mt-1">
                      {new Date(todo.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditing(todo)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4 text-white/70" />
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredTodos.length === 0 && (
        <div className="text-center py-12">
          <div className="backdrop-blur-lg bg-white/5 rounded-2xl border border-white/10 p-8">
            <CheckCircle2 className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchTerm ? 'No tasks found' : filter === 'completed' ? 'No completed tasks' : filter === 'active' ? 'No active tasks' : 'No tasks yet'}
            </h3>
            <p className="text-white/60">
              {searchTerm ? 'Try adjusting your search terms' : 'Add a new task to get started'}
            </p>
          </div>
        </div>
      )}

      {/* Floating Add Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowAddForm(!showAddForm)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full shadow-2xl flex items-center justify-center border border-white/20 backdrop-blur-lg z-10"
      >
        <Plus className={`w-6 h-6 transition-transform ${showAddForm ? 'rotate-45' : ''}`} />
      </motion.button>
    </div>
  );
};

export default Home;