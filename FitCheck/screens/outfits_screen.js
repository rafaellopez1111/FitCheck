import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback } from 'react';
import { useOutfitCheck } from '../context/outfit_check_context';
import { useFocusEffect } from '@react-navigation/native';
import OutfitCard from '../components/outfit_card'
import EmptyState from '../components/empty_state'
import AppButton from '../components/app_button'
import { COLORS } from '../config/config'

export default function OutfitsScreen({ navigation }) {
  const [outfitItems, setOutfitItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { send } = useOutfitCheck();

  const fetchOutfits = async () => {
    setLoading(true);
    const response = await send('outfit', 'get_all');
    if (response.success) {
      setOutfitItems(response.data);
      setError(null);
    } else {
      setError(response.message);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchOutfits();
    }, [send])
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Outfits</Text>
          <Text style={styles.subtitle}>
            {outfitItems.length} {outfitItems.length === 1 ? 'combinação' : 'combinações'}
          </Text>
        </View>
        <AppButton title="+ Novo" onPress={() => navigation.navigate('OutfitBuilder')} style={styles.addButton} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>Erro: {error}</Text>
          <AppButton title="Tentar novamente" onPress={fetchOutfits} variant="secondary" />
        </View>
      ) : (
        <FlatList
          data={outfitItems}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<EmptyState message={"Nenhum outfit criado ainda."} />}
          renderItem={({ item }) => (
            <OutfitCard
              outfit={item}
              onPress={() => navigation.navigate('OutfitBuilder', { id: item.id })}
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
    paddingTop: 12,
    paddingBottom: 24,
    flexGrow: 1,
  },
});
