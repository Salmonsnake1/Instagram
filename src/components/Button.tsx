import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ title, onPress, disabled }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, disabled && styles.disabledButton]}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#A0A0A0',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Button;
