import { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, done: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getTasks(filters);
      setTasks(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.getTaskStats();
      setStats(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  const createTask = useCallback(async (taskData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.createTask(taskData);
      setTasks(prev => [response.data, ...prev]);
      await fetchStats();
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchStats]);

  const updateTask = useCallback(async (id, taskData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.updateTask(id, taskData);
      setTasks(prev => prev.map(task => 
        task._id === id ? response.data : task
      ));
      await fetchStats();
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchStats]);

  const markComplete = useCallback(async (id) => {
    setError(null);
    try {
      const response = await api.markTaskComplete(id);
      setTasks(prev => prev.map(task => 
        task._id === id ? response.data : task
      ));
      await fetchStats();
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [fetchStats]);

  const markPending = useCallback(async (id) => {
    setError(null);
    try {
      const response = await api.markTaskPending(id);
      setTasks(prev => prev.map(task => 
        task._id === id ? response.data : task
      ));
      await fetchStats();
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [fetchStats]);

  const deleteTask = useCallback(async (id) => {
    setError(null);
    try {
      await api.deleteTask(id);
      setTasks(prev => prev.filter(task => task._id !== id));
      await fetchStats();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [fetchStats]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const pendingTasks = tasks.filter(t => t.status === 'PENDING');
  const completedTasks = tasks.filter(t => t.status === 'DONE');

  const value = {
    tasks,
    pendingTasks,
    completedTasks,
    stats,
    loading,
    error,
    fetchTasks,
    fetchStats,
    createTask,
    updateTask,
    markComplete,
    markPending,
    deleteTask,
    clearError
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}

export default TaskContext;
