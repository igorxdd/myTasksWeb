import { View, StyleSheet } from 'react-native';
import { useEffect, useRef } from 'react';
import Input from './Input';
import Select from './Select';
import Button from './Button';
import useForm from '../hooks/useForm';

const URGENCY_OPTIONS = [
  { value: 'LOW', label: '🟢 Baixa' },
  { value: 'MEDIUM', label: '🟡 Média' },
  { value: 'HIGH', label: '🟠 Alta' },
  { value: 'CRITICAL', label: '🔴 Crítica' }
];

const formatDateToBR = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const parseBRDateToISO = (dateStr) => {
  if (!dateStr) return null;
  
  const cleaned = dateStr.trim();
  const parts = cleaned.split(/[\/\-]/);
  
  if (parts.length !== 3) return null;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  if (day < 1 || day > 31) return null;
  if (month < 1 || month > 12) return null;
  if (year < 2000 || year > 2100) return null;
  
  const date = new Date(year, month - 1, day, 12, 0, 0);
  
  if (isNaN(date.getTime())) return null;
  
  return date.toISOString();
};

const applyDateMask = (value) => {
  let numbers = value.replace(/\D/g, '');
  numbers = numbers.substring(0, 8);
  
  if (numbers.length >= 5) {
    return `${numbers.substring(0, 2)}/${numbers.substring(2, 4)}/${numbers.substring(4)}`;
  } else if (numbers.length >= 3) {
    return `${numbers.substring(0, 2)}/${numbers.substring(2)}`;
  }
  return numbers;
};

export function TaskForm({
  task,
  onSubmit,
  onCancel,
  loading = false
}) {
  const isEditing = !!task;
  const prevTaskId = useRef(task?._id);

  const { values, errors, touched, handleChange, handleBlur, validate, setFieldError, setValues } = useForm({
    title: '',
    description: '',
    dueDate: '',
    urgency: 'MEDIUM'
  });

  useEffect(() => {
    const currentTaskId = task?._id;
    
    if (currentTaskId !== prevTaskId.current || (task && !prevTaskId.current)) {
      prevTaskId.current = currentTaskId;
      
      if (task) {
        setValues({
          title: task.title || '',
          description: task.description || '',
          dueDate: formatDateToBR(task.dueDate) || '',
          urgency: task.urgency || 'MEDIUM'
        });
      } else {
        setValues({
          title: '',
          description: '',
          dueDate: '',
          urgency: 'MEDIUM'
        });
      }
    }
  }, [task, setValues]);

  const handleDateChange = (text) => {
    const maskedValue = applyDateMask(text);
    handleChange('dueDate', maskedValue);
  };

  const handleSubmit = () => {
    const isValid = validate({
      title: { required: 'Título é obrigatório' },
      dueDate: { required: 'Prazo é obrigatório' }
    });

    if (!isValid) return;

    const isoDate = parseBRDateToISO(values.dueDate);
    
    if (!isoDate) {
      setFieldError('dueDate', 'Data inválida. Use o formato DD/MM/AAAA');
      return;
    }

    onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      dueDate: isoDate,
      urgency: values.urgency
    });
  };

  return (
    <View style={styles.form}>
      <Input
        label="Título *"
        value={values.title}
        onChangeText={(text) => handleChange('title', text)}
        onBlur={() => handleBlur('title')}
        placeholder="Digite o título da tarefa"
        error={errors.title}
        touched={touched.title}
        autoCapitalize="sentences"
      />

      <Input
        label="Descrição"
        value={values.description}
        onChangeText={(text) => handleChange('description', text)}
        onBlur={() => handleBlur('description')}
        placeholder="Descreva sua tarefa (opcional)"
        multiline
        numberOfLines={4}
        error={errors.description}
        touched={touched.description}
      />

      <Input
        label="Prazo * (DD/MM/AAAA)"
        value={values.dueDate}
        onChangeText={handleDateChange}
        onBlur={() => handleBlur('dueDate')}
        placeholder="Ex: 25/12/2025"
        error={errors.dueDate}
        touched={touched.dueDate}
        keyboardType="numeric"
      />

      <Select
        label="Nível de Urgência"
        value={values.urgency}
        onValueChange={(value) => handleChange('urgency', value)}
        options={URGENCY_OPTIONS}
        error={errors.urgency}
        touched={touched.urgency}
      />

      <View style={styles.actions}>
        <Button
          title="Cancelar"
          onPress={onCancel}
          variant="ghost"
          style={styles.cancelButton}
        />
        <Button
          title={isEditing ? 'Atualizar' : 'Salvar'}
          onPress={handleSubmit}
          loading={loading}
          style={styles.submitButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    width: '100%'
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8
  },
  cancelButton: {
    flex: 1,
    maxWidth: 120
  },
  submitButton: {
    flex: 1,
    maxWidth: 150
  }
});

export default TaskForm;
