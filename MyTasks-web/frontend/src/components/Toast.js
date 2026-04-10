import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useEffect, useState } from 'react';

const VARIANTS = {
  success: { bg: 'rgba(0, 217, 165, 0.15)', border: '#00d9a5', icon: '✓' },
  error: { bg: 'rgba(255, 71, 87, 0.15)', border: '#ff4757', icon: '✕' },
  warning: { bg: 'rgba(255, 193, 7, 0.15)', border: '#ffc107', icon: '⚠' },
  info: { bg: 'rgba(100, 149, 237, 0.15)', border: '#6495ED', icon: 'ℹ' }
};

export function Toast({ message, variant = 'info', duration = 3000, onClose }) {
  const [visible, setVisible] = useState(true);
  const config = VARIANTS[variant] || VARIANTS.info;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <View style={[styles.container, { backgroundColor: config.bg, borderColor: config.border }]}>
      <Text style={[styles.icon, { color: config.border }]}>{config.icon}</Text>
      <Text style={styles.message}>{message}</Text>
      <Pressable onPress={() => { setVisible(false); onClose?.(); }} style={styles.closeButton}>
        <Text style={styles.closeText}>✕</Text>
      </Pressable>
    </View>
  );
}

export function ToastContainer({ toasts, onRemove }) {
  return (
    <View style={styles.toastContainer}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          variant={toast.variant}
          duration={toast.duration}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'fixed',
    bottom: 20,
    right: 20,
    zIndex: 2000,
    gap: 8
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 300,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8
  },
  icon: {
    fontSize: 18,
    marginRight: 12,
    fontWeight: '600'
  },
  message: {
    flex: 1,
    fontFamily: 'Sora, sans-serif',
    fontSize: 14,
    color: '#ffffff'
  },
  closeButton: {
    padding: 4,
    marginLeft: 8
  },
  closeText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)'
  }
});

export default Toast;
