import { View, Text, StyleSheet } from 'react-native';
import Button from './Button';

export function EmptyState({ 
  title = 'Nenhuma tarefa encontrada',
  description = 'Crie sua primeira tarefa para começar a organizar seu dia!',
  actionLabel = 'Nova Tarefa',
  onAction
}) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>📋</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          style={styles.button}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderStyle: 'dashed'
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(233, 69, 96, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  icon: {
    fontSize: 36
  },
  title: {
    fontFamily: 'Sora, sans-serif',
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center'
  },
  description: {
    fontFamily: 'Sora, sans-serif',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 300,
    lineHeight: 20
  },
  button: {
    minWidth: 150
  }
});

export default EmptyState;
