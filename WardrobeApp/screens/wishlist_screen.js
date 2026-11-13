import { View, Text, StyleSheet, FlatList, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback } from 'react';
import { useOutfitCheck } from '../context/outfit_check_context';
import { useFocusEffect } from '@react-navigation/native';
import ClothingCard from '../components/clothing_card'
import EmptyState from '../components/empty_state'
import AppButton from '../components/app_button'
import { CATEGORIES, COLORS } from '../config/config'

export default function WishlistScreen({ navigation }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(null);
  const { send } = useOutfitCheck();

  const fetchWishlist = async () => {
    setLoading(true);
    const response = await send('wishlist', 'get_all');
    if (response.success) {
      setWishlistItems(response.data);
      setError(null);
    } else {
      setError(response.message);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchWishlist();
    }, [send])
  );

  const filteredItems = category ? wishlistItems.filter(item => item.category === category) : wishlistItems;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Wishlist</Text>
          <Text style={styles.subtitle}>
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item desejado' : 'itens desejados'}
          </Text>
        </View>
        <AppButton
          title="+ Novo"
          onPress={() => navigation.navigate('ItemForm', { entity: 'wishlist' })}
          style={styles.addButton}
        />
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
          <AppButton title="Tentar novamente" onPress={fetchWishlist} variant="secondary" />
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<EmptyState message={wishlistItems.length === 0 ? "Nenhum item registrado na Wishlist." : "Nenhum item encontrado nesta categoria da Wishlist."} />}
          renderItem={({ item }) => (
            <ClothingCard
              clothing={item}
              onPress={() => navigation.navigate('ItemForm', { id: item.id, entity: 'wishlist' })}
              isWishlist
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
