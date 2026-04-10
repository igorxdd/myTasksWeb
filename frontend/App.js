import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useState } from 'react';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { TaskProvider } from './src/context/TaskContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e94560" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    if (showRegister) {
      return (
        <RegisterScreen onNavigateToLogin={() => setShowRegister(false)} />
      );
    }
    return (
      <LoginScreen onNavigateToRegister={() => setShowRegister(true)} />
    );
  }

  return (
    <TaskProvider>
      <HomeScreen />
    </TaskProvider>
  );
}

export default function App() {
  return (
    <View style={styles.container}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh'
  },
  loadingText: {
    fontFamily: 'Sora, sans-serif',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 16
  }
});
