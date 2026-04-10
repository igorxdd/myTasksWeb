import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useState } from 'react';

const URGENCY_CONFIG = {
  LOW: { label: 'Baixa', color: '#00d9a5', bg: 'rgba(0, 217, 165, 0.15)' },
  MEDIUM: { label: 'Média', color: '#ffc107', bg: 'rgba(255, 193, 7, 0.15)' },
  HIGH: { label: 'Alta', color: '#ff9800', bg: 'rgba(255, 152, 0, 0.15)' },
  CRITICAL: { label: 'Crítica', color: '#ff4757', bg: 'rgba(255, 71, 87, 0.15)' }
};

export function TaskCard({
  task,
  onEdit,
  onComplete,
  onReopen,
  onDelete
}) {
  const [showActions, setShowActions] = useState(false);
  
  const urgencyConfig = URGENCY_CONFIG[task.urgency] || URGENCY_CONFIG.MEDIUM;
  const isCompleted = task.status === 'DONE';
  const isOverdue = !isCompleted && new Date(task.dueDate) < new Date();
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Data inválida';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Pressable
      onPress={() => setShowActions(!showActions)}
      style={({ hovered }) => [
        styles.card,
        isCompleted && styles.cardCompleted,
        hovered && styles.cardHovered
      ]}
    >
      <View style={styles.header}>
        <View style={styles.urgencyBadge}>
          <View style={[styles.urgencyDot, { backgroundColor: urgencyConfig.color }]} />
          <Text style={[styles.urgencyText, { color: urgencyConfig.color }]}>
            {urgencyConfig.label}
          </Text>
        </View>
        
        <View style={styles.dateContainer}>
          <Text style={[styles.dueDate, isOverdue && styles.overdue]}>
            {isOverdue ? '⚠️ ' : '📅 '}
            {formatDate(task.dueDate)}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, isCompleted && styles.titleCompleted]} numberOfLines={2}>
          {isCompleted && '✓ '}
          {task.title}
        </Text>

        {task.description ? (
          <Text style={styles.description} numberOfLines={3}>
            {task.description}
          </Text>
        ) : null}
      </View>

      {showActions && (
        <View style={styles.actions}>
          {!isCompleted ? (
            <>
              <Pressable
                onPress={(e) => { e.stopPropagation(); onComplete(task._id); }}
                style={[styles.actionButton, styles.completeButton]}
              >
                <Text style={styles.actionText}>✓ Concluir</Text>
              </Pressable>
              <Pressable
                onPress={(e) => { e.stopPropagation(); onEdit(task); }}
                style={[styles.actionButton, styles.editButton]}
              >
                <Text style={styles.actionText}>✎ Editar</Text>
              </Pressable>
            </>
          ) : (
            <Pressable
              onPress={(e) => { e.stopPropagation(); onReopen(task._id); }}
              style={[styles.actionButton, styles.reopenButton]}
            >
              <Text style={styles.actionText}>↩ Reabrir</Text>
            </Pressable>
          )}
          <Pressable
            onPress={(e) => { e.stopPropagation(); onDelete(task._id); }}
            style={[styles.actionButton, styles.deleteButton]}
          >
            <Text style={styles.actionText}>🗑 Excluir</Text>
          </Pressable>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 20,
    transitionDuration: '200ms'
  },
  cardCompleted: {
    opacity: 0.6,
    borderColor: 'rgba(0, 217, 165, 0.3)'
  },
  cardHovered: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    transform: [{ translateY: -2 }]
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 10
  },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20
  },
  urgencyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8
  },
  urgencyText: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  dateContainer: {
    flexShrink: 0
  },
  dueDate: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)'
  },
  overdue: {
    color: '#ff4757'
  },
  content: {
    marginBottom: 4
  },
  title: {
    fontFamily: 'Sora, sans-serif',
    fontSize: 17,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 10,
    lineHeight: 24
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: 'rgba(255, 255, 255, 0.5)'
  },
  description: {
    fontFamily: 'Sora, sans-serif',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 22
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)'
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)'
  },
  completeButton: {
    backgroundColor: 'rgba(0, 217, 165, 0.15)'
  },
  editButton: {
    backgroundColor: 'rgba(255, 193, 7, 0.15)'
  },
  reopenButton: {
    backgroundColor: 'rgba(100, 149, 237, 0.15)'
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 71, 87, 0.15)'
  },
  actionText: {
    fontFamily: 'Sora, sans-serif',
    fontSize: 13,
    fontWeight: '500',
    color: '#ffffff'
  }
});

export default TaskCard;
