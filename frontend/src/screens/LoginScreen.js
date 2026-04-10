import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import useForm from '../hooks/useForm';

export function LoginScreen({ onNavigateToRegister }) {
  const { login, error, clearError } = useAuth();
  const [loading, setLoading] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, validate, setErrors } = useForm({
    email: '',
    password: ''
  });

  const handleSubmit = async () => {
    clearError();
    
    const isValid = validate({
      email: {
        required: 'Email é obrigatório',
        pattern: {
          value: /^\S+@\S+\.\S+$/,
          message: 'Email inválido'
        }
      },
      password: { required: 'Senha é obrigatória' }
    });

    if (!isValid) return;

    setLoading(true);
    try {
      await login(values.email, values.password);
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formCard}>
        <View style={styles.header}>
          <Text style={styles.logo}>✓ MyTasks</Text>
          <Text style={styles.title}>Bem-vindo de volta!</Text>
          <Text style={styles.subtitle}>Entre na sua conta para continuar</Text>
        </View>

        {(errors.general || error) && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errors.general || error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <Input
            label="Email"
            value={values.email}
            onChangeText={(text) => handleChange('email', text)}
            onBlur={() => handleBlur('email')}
            placeholder="seu@email.com"
            error={errors.email}
            touched={touched.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Senha"
            value={values.password}
            onChangeText={(text) => handleChange('password', text)}
            onBlur={() => handleBlur('password')}
            placeholder="••••••••"
            error={errors.password}
            touched={touched.password}
            secureTextEntry
          />

          <Button
            title="Entrar"
            onPress={handleSubmit}
            loading={loading}
            fullWidth
            size="large"
            style={styles.submitButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Não tem uma conta?</Text>
          <Pressable onPress={onNavigateToRegister}>
            <Text style={styles.link}>Cadastre-se</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.decoration}>
        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    minHeight: '100vh'
  },
  formCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 40,
    zIndex: 10
  },
  header: {
    alignItems: 'center',
    marginBottom: 32
  },
  logo: {
    fontFamily: 'Sora, sans-serif',
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16
  },
  title: {
    fontFamily: 'Sora, sans-serif',
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8
  },
  subtitle: {
    fontFamily: 'Sora, sans-serif',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)'
  },
  errorBox: {
    backgroundColor: 'rgba(255, 71, 87, 0.15)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 71, 87, 0.3)'
  },
  errorText: {
    fontFamily: 'Sora, sans-serif',
    fontSize: 14,
    color: '#ff4757',
    textAlign: 'center'
  },
  form: {
    marginBottom: 24
  },
  submitButton: {
    marginTop: 8
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  footerText: {
    fontFamily: 'Sora, sans-serif',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)'
  },
  link: {
    fontFamily: 'Sora, sans-serif',
    fontSize: 14,
    fontWeight: '600',
    color: '#e94560'
  },
  decoration: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    zIndex: 1
  },
  decorCircle1: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(233, 69, 96, 0.1)',
    top: -100,
    right: -100
  },
  decorCircle2: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(0, 217, 165, 0.08)',
    bottom: -50,
    left: -50
  }
});

export default LoginScreen;
