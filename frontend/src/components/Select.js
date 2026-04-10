import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useState } from 'react';

export function Select({
  label,
  value,
  onValueChange,
  options = [],
  placeholder = 'Selecione...',
  error,
  touched,
  style,
  disabled = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const showError = error && touched;

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
      <View style={styles.selectWrapper}>
        <Pressable
          onPress={() => !disabled && setIsOpen(!isOpen)}
          style={[
            styles.select,
            showError && styles.selectError,
            disabled && styles.disabled
          ]}
        >
          <Text style={[
            styles.selectText,
            !selectedOption && styles.placeholder
          ]}>
            {selectedOption ? selectedOption.label : placeholder}
          </Text>
          <Text style={styles.arrow}>{isOpen ? '▲' : '▼'}</Text>
        </Pressable>
        
        {isOpen && (
          <View style={styles.dropdown}>
            {options.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => {
                  onValueChange(option.value);
                  setIsOpen(false);
                }}
                style={({ hovered }) => [
                  styles.option,
                  value === option.value && styles.optionSelected,
                  hovered && styles.optionHovered
                ]}
              >
                <Text style={[
                  styles.optionText,
                  value === option.value && styles.optionTextSelected
                ]}>
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
      {showError && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    zIndex: 10
  },
  label: {
    fontFamily: 'Sora, sans-serif',
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8
  },
  selectWrapper: {
    position: 'relative'
  },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16
  },
  selectError: {
    borderColor: '#ff4757'
  },
  disabled: {
    opacity: 0.5
  },
  selectText: {
    fontFamily: 'Sora, sans-serif',
    fontSize: 15,
    color: '#ffffff'
  },
  placeholder: {
    color: 'rgba(255, 255, 255, 0.3)'
  },
  arrow: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)'
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 100
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16
  },
  optionSelected: {
    backgroundColor: 'rgba(233, 69, 96, 0.2)'
  },
  optionHovered: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)'
  },
  optionText: {
    fontFamily: 'Sora, sans-serif',
    fontSize: 15,
    color: '#ffffff'
  },
  optionTextSelected: {
    color: '#e94560',
    fontWeight: '500'
  },
  errorText: {
    fontFamily: 'Sora, sans-serif',
    fontSize: 12,
    color: '#ff4757',
    marginTop: 6
  }
});

export default Select;
