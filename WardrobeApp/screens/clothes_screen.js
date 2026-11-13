import { View, Text, StyleSheet, FlatList, ActivityIndicator, Button } from 'react-native';
import { useState, useCallback } from 'react';
import { useOutfitCheck } from '../context/outfit_check_context';
import { useFocusEffect } from '@react-navigation/native';
import ClothingCard from '../components/clothing_card'
import EmptyState from '../components/empty_state'

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
      setError(null);
    } else {
      setError(response.message);
    }
    setLoading(false);
  };

  const addTestItem = async () => {
    const response = await send('clothing', 'create', {
      name: 'Camisa teste',
      category: 'Camisa',
    });
    console.log(response);
    fetchClothes();
  };

  useFocusEffect(
    useCallback(() => {
      fetchClothes();
    }, [send])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clothes</Text>
      <Button title="Add test item" onPress={addTestItem} />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text>Error: {error}</Text>
          <Button title="Retry" onPress={fetchClothes} />
        </View>
      ) : (
        <FlatList
          data={clothes}
          style={styles.list}
          ListEmptyComponent={<EmptyState message="No clothes yet" />}
          renderItem={({ item }) => (
            <ClothingCard clothing={item} />
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    width: '100%',
  }
});