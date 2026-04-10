import { View, Text, StyleSheet } from 'react-native';
import Modal from './Modal';
import Button from './Button';

export function ConfirmDialog({
  visible,
  onClose,
  onConfirm,
  title = 'Confirmar ação',
  message = 'Tem certeza que deseja continuar?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  loading = false
}) {
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={title}
      size="small"
    >
      <View style={styles.content}>
        <Text style={styles.message}>{message}</Text>
        
        <View style={styles.actions}>
          <Button
            title={cancelText}
            onPress={onClose}
            variant="ghost"
            style={styles.button}
            disabled={loading}
          />
          <Button
            title={confirmText}
            onPress={onConfirm}
            variant={variant}
            style={styles.button}
            loading={loading}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center'
  },
  message: {
    fontFamily: 'Sora, sans-serif',
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%'
  },
  button: {
    flex: 1
  }
});

export default ConfirmDialog;
