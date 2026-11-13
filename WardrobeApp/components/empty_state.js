import { View, Text, StyleSheet } from 'react-native';
import AppButton from './app_button';
import { COLORS } from '../config/config';

export default function EmptyState({ message, actionLabel, onAction }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🧺</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel ? <AppButton title={actionLabel} onPress={onAction} variant="secondary" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
    color: COLORS.mutedText,
    marginBottom: 16,
  },
});
