import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.header}>
      <View style={styles.brand}>
        <Text style={styles.logo}>✓ MyTasks</Text>
        <Text style={styles.tagline}>Organize seu dia</Text>
      </View>

      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
          <Pressable onPress={logout}>
            <Text style={styles.logoutText}>Sair</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)'
  },
  brand: {
    flexDirection: 'column'
  },
  logo: {
    fontFamily: 'Sora, sans-serif',
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.5
  },
  tagline: {
    fontFamily: 'Sora, sans-serif',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 2
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(233, 69, 96, 0.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: {
    fontFamily: 'Sora, sans-serif',
    fontSize: 16,
    fontWeight: '600',
    color: '#e94560'
  },
  userDetails: {
    alignItems: 'flex-start'
  },
  userName: {
    fontFamily: 'Sora, sans-serif',
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff'
  },
  logoutText: {
    fontFamily: 'Sora, sans-serif',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 2
  }
});

export default Header;
