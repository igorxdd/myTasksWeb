import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';

const VARIANTS = {
  primary: {
    background: 'linear-gradient(135deg, #e94560 0%, #ff6b6b 100%)',
    text: '#ffffff',
    border: 'transparent'
  },
  secondary: {
    background: 'transparent',
    text: '#e94560',
    border: '#e94560'
  },
  success: {
    background: 'linear-gradient(135deg, #00d9a5 0%, #00f5c4 100%)',
    text: '#1a1a2e',
    border: 'transparent'
  },
  danger: {
    background: 'linear-gradient(135deg, #ff4757 0%, #ff6b81 100%)',
    text: '#ffffff',
    border: 'transparent'
  },
  ghost: {
    background: 'rgba(255, 255, 255, 0.05)',
    text: '#ffffff',
    border: 'rgba(255, 255, 255, 0.1)'
  }
};

const SIZES = {
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 13
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    fontSize: 15
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    fontSize: 17
  }
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  fullWidth = false
}) {
  const variantStyle = VARIANTS[variant] || VARIANTS.primary;
  const sizeStyle = SIZES[size] || SIZES.medium;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed, hovered }) => [
        styles.button,
        {
          backgroundImage: variantStyle.background,
          backgroundColor: variantStyle.background.includes('gradient') ? undefined : variantStyle.background,
          borderColor: variantStyle.border,
          paddingVertical: sizeStyle.paddingVertical,
          paddingHorizontal: sizeStyle.paddingHorizontal,
          opacity: disabled ? 0.5 : pressed ? 0.8 : hovered ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }]
        },
        fullWidth && styles.fullWidth,
        style
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={variantStyle.text} size="small" />
        ) : (
          <>
            {icon && <View style={styles.icon}>{icon}</View>}
            <Text style={[
              styles.text,
              { color: variantStyle.text, fontSize: sizeStyle.fontSize },
              textStyle
            ]}>
              {title}
            </Text>
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    transitionDuration: '150ms'
  },
  fullWidth: {
    width: '100%'
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    marginRight: 8
  },
  text: {
    fontFamily: 'Sora, sans-serif',
    fontWeight: '600',
    textAlign: 'center'
  }
});

export default Button;
