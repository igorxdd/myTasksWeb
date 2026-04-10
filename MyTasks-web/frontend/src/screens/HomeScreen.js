import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import Button from '../components/Button';
import { ToastContainer } from '../components/Toast';
import { useTasks } from '../context/TaskContext';

export function HomeScreen() {
  const {
    pendingTasks,
    completedTasks,
    stats,
    loading,
    fetchTasks,
    fetchStats,
    createTask,
    updateTask,
    markComplete,
    markPending,
    deleteTask
  } = useTasks();

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [toasts, setToasts] = useState([]);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [fetchTasks, fetchStats]);

  const addToast = useCallback((message, variant = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, variant }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleAddTask = () => {
    setEditingTask(null);
    setShowTaskModal(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleSubmitTask = async (taskData) => {
    setFormLoading(true);
    try {
      if (editingTask) {
        await updateTask(editingTask._id, taskData);
        addToast('Tarefa atualizada com sucesso!', 'success');
      } else {
        await createTask(taskData);
        addToast('Tarefa criada com sucesso!', 'success');
      }
      setShowTaskModal(false);
      setEditingTask(null);
    } catch (err) {
      addToast(err.message || 'Erro ao salvar tarefa', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await markComplete(taskId);
      addToast('Tarefa concluída! 🎉', 'success');
    } catch (err) {
      addToast(err.message || 'Erro ao concluir tarefa', 'error');
    }
  };

  const handleReopenTask = async (taskId) => {
    try {
      await markPending(taskId);
      addToast('Tarefa reaberta!', 'info');
    } catch (err) {
      addToast(err.message || 'Erro ao reabrir tarefa', 'error');
    }
  };

  const handleDeleteClick = (taskId) => {
    setTaskToDelete(taskId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    
    try {
      await deleteTask(taskToDelete);
      addToast('Tarefa excluída com sucesso!', 'success');
    } catch (err) {
      addToast(err.message || 'Erro ao excluir tarefa', 'error');
    } finally {
      setShowDeleteConfirm(false);
      setTaskToDelete(null);
    }
  };

  const displayedTasks = activeTab === 'pending' ? pendingTasks : completedTasks;

  return (
    <View style={styles.container}>
      <Header />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <StatsCard stats={stats} />
          
          <View style={styles.addTaskContainer}>
            <Button
              title="+ Nova Tarefa"
              onPress={handleAddTask}
              size="large"
              style={styles.addTaskButton}
            />
          </View>
          
          <View style={styles.tabs}>
            <Pressable
              onPress={() => setActiveTab('pending')}
              style={[styles.tab, activeTab === 'pending' && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeTab === 'pending' && styles.tabTextActive]}>
                Pendentes ({pendingTasks.length})
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setActiveTab('completed')}
              style={[styles.tab, activeTab === 'completed' && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeTab === 'completed' && styles.tabTextActive]}>
                Concluídas ({completedTasks.length})
              </Text>
            </Pressable>
          </View>

          {displayedTasks.length === 0 ? (
            <EmptyState
              title={activeTab === 'pending' ? 'Nenhuma tarefa pendente' : 'Nenhuma tarefa concluída'}
              description={
                activeTab === 'pending'
                  ? 'Crie uma nova tarefa para começar a organizar seu dia!'
                  : 'Complete suas tarefas para vê-las aqui!'
              }
              actionLabel="Nova Tarefa"
              onAction={activeTab === 'pending' ? handleAddTask : null}
            />
          ) : (
            <View style={styles.taskList}>
              {displayedTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={handleEditTask}
                  onComplete={handleCompleteTask}
                  onReopen={handleReopenTask}
                  onDelete={handleDeleteClick}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={showTaskModal}
        onClose={() => { setShowTaskModal(false); setEditingTask(null); }}
        title={editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
      >
        <TaskForm
          task={editingTask}
          onSubmit={handleSubmitTask}
          onCancel={() => { setShowTaskModal(false); setEditingTask(null); }}
          loading={formLoading}
        />
      </Modal>

      <ConfirmDialog
        visible={showDeleteConfirm}
        onClose={() => { setShowDeleteConfirm(false); setTaskToDelete(null); }}
        onConfirm={handleConfirmDelete}
        title="Excluir Tarefa"
        message="Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100vh'
  },
  content: {
    flex: 1
  },
  inner: {
    maxWidth: 900,
    width: '100%',
    marginHorizontal: 'auto',
    padding: 32,
    paddingBottom: 60
  },
  addTaskContainer: {
    alignItems: 'center',
    marginBottom: 32
  },
  addTaskButton: {
    minWidth: 200
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    padding: 4
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderRadius: 10
  },
  tabActive: {
    backgroundColor: 'rgba(233, 69, 96, 0.2)'
  },
  tabText: {
    fontFamily: 'Sora, sans-serif',
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.5)'
  },
  tabTextActive: {
    color: '#e94560'
  },
  taskList: {
    gap: 16
  }
});

export default HomeScreen;
