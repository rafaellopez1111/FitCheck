import { View, Text, StyleSheet } from 'react-native';

export default function ClothesScreen() {
  return (
    <View style={styles.container}>
      <Text>ClothesScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});