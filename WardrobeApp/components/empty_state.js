import { View, Text, Button, StyleSheet } from 'react-native';

export default function EmptyState({ message, actionLabel, onAction }) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      {actionLabel ? <Button title={actionLabel} onPress={onAction} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  message: {
    textAlign: 'center',
    marginBottom: 12,
  },
});