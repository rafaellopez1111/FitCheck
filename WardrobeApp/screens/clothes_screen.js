import { View, Text, StyleSheet, FlatList, ActivityIndicator, Button } from 'react-native';
import { useState, useCallback } from 'react';
import { useOutfitCheck } from '../context/outfit_check_context';
import { useFocusEffect } from '@react-navigation/native';


export default function ClothesScreen() {
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { send } = useOutfitCheck();

  const fetchClothes = async () => {
    setLoading(true);
    const response = await send('clothing', 'get_all');
    if (response.success) {
      setClothes(response.data);
    } else {
      setError(response.message);
    }
    setLoading(false);
    setError(null);
  }


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