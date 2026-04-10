import { View, Text, TextInput, StyleSheet } from 'react-native';

export function Input({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  error,
  touched,
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  style,
  inputStyle,
  disabled = false
}) {
  const showError = error && touched;

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor="rgba(255, 255, 255, 0.3)"
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        editable={!disabled}
        style={[
          styles.input,
          multiline && styles.multiline,
          showError && styles.inputError,
          disabled && styles.disabled,
          inputStyle
        ]}
      />
      {showError && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16
  },
  label: {
    fontFamily: 'Sora, sans-serif',
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8
  },
  input: {
    fontFamily: 'Sora, sans-serif',
    fontSize: 15,
    color: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    outlineStyle: 'none'
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 14
  },
  inputError: {
    borderColor: '#ff4757'
  },
  disabled: {
    opacity: 0.5
  },
  errorText: {
    fontFamily: 'Sora, sans-serif',
    fontSize: 12,
    color: '#ff4757',
    marginTop: 6
  }
});

export default Input;
