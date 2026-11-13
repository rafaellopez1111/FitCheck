import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useOutfitCheck } from '../context/outfit_check_context';
import AppButton from '../components/app_button';
import { COLORS } from '../config/config';

export default function HomeScreen({ navigation }) {
  const [counts, setCounts] = useState({ clothing: 0, wishlist: 0, outfit: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { send } = useOutfitCheck();

  const fetchCounts = async () => {
    setLoading(true);
    const [clothing, wishlist, outfit] = await Promise.all([
      send('clothing', 'get_all'),
      send('wishlist', 'get_all'),
      send('outfit', 'get_all'),
    ]);
    const failed = [clothing, wishlist, outfit].find((response) => !response.success);
    if (failed) {
      setError(failed.message);
    } else {
      setCounts({
        clothing: clothing.data.length,
        wishlist: wishlist.data.length,
        outfit: outfit.data.length,
      });
      setError(null);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchCounts();
    }, [send])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.greeting}>Seu guarda-roupa</Text>
      <Text style={styles.subtitle}>O que vamos vestir hoje?</Text>

      <TouchableOpacity
        style={styles.suggestCard}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('Outfits', { screen: 'OutfitShaker' })}
      >
        <Text style={styles.suggestEmoji}>📳</Text>
        <View style={styles.suggestTexts}>
          <Text style={styles.suggestTitle}>Sugerir um outfit</Text>
          <Text style={styles.suggestText}>Escolha os estilos e chacoalhe o celular para receber uma sugestão.</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Resumo</Text>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.error}>Erro: {error}</Text>
          <AppButton title="Tentar novamente" onPress={fetchCounts} variant="secondary" />
        </View>
      ) : (
        <View style={styles.counters}>
          <TouchableOpacity style={styles.counter} onPress={() => navigation.navigate('Clothes')}>
            <Text style={styles.counterEmoji}>👕</Text>
            <Text style={styles.counterNumber}>{counts.clothing}</Text>
            <Text style={styles.counterLabel}>Roupas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.counter} onPress={() => navigation.navigate('Outfits')}>
            <Text style={styles.counterEmoji}>✨</Text>
            <Text style={styles.counterNumber}>{counts.outfit}</Text>
            <Text style={styles.counterLabel}>Outfits</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.counter} onPress={() => navigation.navigate('Wishlist')}>
            <Text style={styles.counterEmoji}>🛍️</Text>
            <Text style={styles.counterNumber}>{counts.wishlist}</Text>
            <Text style={styles.counterLabel}>Wishlist</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  greeting: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.mutedText,
    marginTop: 4,
    marginBottom: 24,
  },
  suggestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 22,
    padding: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  suggestEmoji: {
    fontSize: 40,
    marginRight: 16,
  },
  suggestTexts: {
    flex: 1,
  },
  suggestTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.white,
  },
  suggestText: {
    fontSize: 14,
    color: COLORS.primarySoft,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 32,
    marginBottom: 14,
  },
  center: {
    alignItems: 'center',
  },
  error: {
    color: COLORS.danger,
    marginBottom: 12,
  },
  counters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  counter: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 18,
    marginHorizontal: 5,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
  },
  counterEmoji: {
    fontSize: 24,
  },
  counterNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 6,
  },
  counterLabel: {
    marginTop: 2,
    fontSize: 13,
    color: COLORS.mutedText,
  },
});
