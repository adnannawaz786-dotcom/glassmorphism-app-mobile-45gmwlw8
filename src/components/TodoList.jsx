import React, { useState, useEffect } from 'react';
import { Check, X, Edit2, Trash2, Plus, Calendar, Flag } from 'lucide-react';
import { cn } from '../lib/utils';

const TodoList = ({ className }) => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const savedTodos = localStorage.getItem('glassmorphism-todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('glassmorphism-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim() !== '') {
      const todo = {
        id: Date.now(),
        text: newTodo,
        completed: false,
        createdAt: new Date().toISOString(),
        priority: 'medium'
      };
      setTodos([todo, ...todos]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = () => {
    setTodos(todos.map(todo =>
      todo.id === editingId ? { ...todo, text: editText } : todo
    ));
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const setPriority = (id, priority) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, priority } : todo
    ));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={cn("w-full max-w-2xl mx-auto p-4 space-y-6", className)}>
      {/* Add Todo Section */}
      <div className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl p-6 shadow-xl">
        <div className="flex gap-3">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Add a new task..."
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent backdrop-blur-sm"
          />
          <button
            onClick={addTodo}
            className="bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-600/80 hover:to-pink-600/80 text-white p-3 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20 hover:scale-105"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl p-2 shadow-xl">
        <div className="flex gap-1">
          {['all', 'active', 'completed'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={cn(
                "flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200 capitalize",
                filter === filterType
                  ? "bg-white/30 text-white shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
            >
              {filterType}
            </button>
          ))}
        </div>
      </div>

      {/* Todo List */}
      <div className="space-y-3">
        {filteredTodos.length === 0 ? (
          <div className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl p-8 text-center shadow-xl">
            <p className="text-white/60 text-lg">
              {filter === 'all' ? 'No tasks yet' : 
               filter === 'active' ? 'No active tasks' : 'No completed tasks'}
            </p>
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className={cn(
                "backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl p-4 shadow-xl transition-all duration-200 hover:bg-white/25",
                todo.completed && "opacity-75"
              )}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={cn(
                    "mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                    todo.completed
                      ? "bg-green-500/80 border-green-400 text-white"
                      : "border-white/40 hover:border-white/60"
                  )}
                >
                  {todo.completed && <Check size={14} />}
                </button>

                <div className="flex-1 min-w-0">
                  {editingId === todo.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={saveEdit}
                          className="bg-green-500/80 hover:bg-green-600/80 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-500/80 hover:bg-gray-600/80 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className={cn(
                        "text-white text-lg leading-relaxed break-words",
                        todo.completed && "line-through text-white/60"
                      )}>
                        {todo.text}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-sm text-white/60">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{formatDate(todo.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Flag size={14} className={getPriorityColor(todo.priority)} />
                            <span className={getPriorityColor(todo.priority)}>
                              {todo.priority}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={todo.priority}
                            onChange={(e) => setPriority(todo.id, e.target.value)}
                            className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-white/30"
                          >
                            <option value="low" className="bg-gray-800">Low</option>
                            <option value="medium" className="bg-gray-800">Medium</option>
                            <option value="high" className="bg-gray-800">High</option>
                          </select>
                          
                          <button
                            onClick={() => startEdit(todo.id, todo.text)}
                            className="text-white/60 hover:text-white p-1 rounded transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          
                          <button
                            onClick={() => deleteTodo(todo.id)}
                            className="text-red-400/60 hover:text-red-400 p-1 rounded transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      {todos.length > 0 && (
        <div className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl p-4 shadow-xl">
          <div className="flex justify-between items-center text-sm text-white/80">
            <span>Total: {todos.length}</span>
            <span>Active: {todos.filter(t => !t.completed).length}</span>
            <span>Completed: {todos.filter(t => t.completed).length}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;