import { View, Text, StyleSheet, FlatList, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback } from 'react';
import { useOutfitCheck } from '../context/outfit_check_context';
import { useFocusEffect } from '@react-navigation/native';
import ClothingCard from '../components/clothing_card'
import EmptyState from '../components/empty_state'
import AppButton from '../components/app_button'
import { CATEGORIES, COLORS } from '../config/config'

export default function ClothesScreen({ navigation }) {
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(null);
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

  useFocusEffect(
    useCallback(() => {
      fetchClothes();
    }, [send])
  );

  const filteredClothes = category ? clothes.filter(item => item.category === category) : clothes;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Roupas</Text>
          <Text style={styles.subtitle}>
            {clothes.length} {clothes.length === 1 ? 'peça' : 'peças'} no guarda-roupa
          </Text>
        </View>
        <AppButton title="+ Nova" onPress={() => navigation.navigate('ItemForm')} style={styles.addButton} />
      </View>

      <ScrollView
        horizontal
        style={styles.chips}
        contentContainerStyle={styles.chipsContent}
        showsHorizontalScrollIndicator={false}
      >
        {CATEGORIES.map((item_category) => (
          <TouchableOpacity
            key={item_category}
            style={[styles.chip, category === item_category && styles.chipSelected]}
            onPress={() => setCategory(category === item_category ? null : item_category)}
          >
            <Text style={[styles.chipText, category === item_category && styles.chipTextSelected]}>
              {item_category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>Erro: {error}</Text>
          <AppButton title="Tentar novamente" onPress={fetchClothes} variant="secondary" />
        </View>
      ) : (
        <FlatList
          data={filteredClothes}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<EmptyState message={clothes.length === 0 ? "Nenhuma roupa ainda registrada." : "Nenhuma roupa encontrada nesta categoria."} />}
          renderItem={({ item }) => (
            <ClothingCard
              clothing={item}
              onPress={() => navigation.navigate('ItemForm', { id: item.id })}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.mutedText,
    marginTop: 2,
  },
  addButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  chips: {
    flexGrow: 0,
    marginVertical: 10,
  },
  chipsContent: {
    paddingHorizontal: 20,
  },
  chip: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 14,
    color: COLORS.text,
  },
  chipTextSelected: {
    color: COLORS.white,
    fontWeight: '700',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: COLORS.danger,
    marginBottom: 12,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 24,
    flexGrow: 1,
  },
});
