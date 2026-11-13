import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useOutfitCheck } from '../context/outfit_check_context';
import ClothingCard from '../components/clothing_card'
import EmptyState from '../components/empty_state'
import AppButton from '../components/app_button'
import { COLORS } from '../config/config'

export default function OutfitBuilderScreen({navigation, route}) {

  const { send } = useOutfitCheck();

  const id = route.params?.id;
  const isEditing = !!id;

  const [clothingItems, setClothingItems] = useState([]);
  const [name, setName] = useState('');
  const [occasion, setOccasion] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState(null);
  const [error, setError] = useState(null);

  const loadClothingItems = async () => {
    setLoading(true);
    const response = await send('clothing', 'get_all');
    if (response.success) {
      setClothingItems(response.data);
      setError(null);
    } else {
      setError(response.message);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setFormError('O nome do outfit é obrigatório.');
      return;
    }
    if (selectedIds.length === 0) {
      setFormError('Selecione pelo menos uma roupa.');
      return;
    }
    setFormError(null);

    const data = {
      name: name.trim(),
      item_ids: selectedIds,
    };
    if (occasion.trim()) {
      data.occasion = occasion.trim();
    } else if (isEditing) {
      data.occasion = null;
    }
    if (isEditing) {
      data.id = id;
    }

    const response = await send('outfit', isEditing ? 'update' : 'create', data);
    if (response.success) {
      navigation.goBack();
    } else {
      Alert.alert('Erro', response.message);
    }
  };

  const handleDelete = async () => {
    const response = await send('outfit', 'delete', { id });
    if (response.success) {
      navigation.goBack();
    } else {
      Alert.alert('Erro', response.message);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Excluir outfit?',
      'Tem certeza de que deseja excluir este outfit? As roupas não serão apagadas.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: handleDelete },
      ]
    );
  };

  const loadOutfit = async() => {
    if (!isEditing) return;
    const response = await send('outfit', 'get_one', { id });
    if (response.success) {
      const outfit = response.data;
      setName(outfit.name);
      setOccasion(outfit.occasion || '');
      setSelectedIds(outfit.item_ids || []);
    } else {
      Alert.alert('Erro', response.message);
    }
  };

  useEffect(() => {
    loadClothingItems();
    if (isEditing) {
      loadOutfit();
    }
  }, [send]);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.error}>Erro: {error}</Text>
          <AppButton title="Tentar novamente" onPress={loadClothingItems} variant="secondary" />
        </View>
      ) : (
        <>
        <FlatList
          data={clothingItems}
          extraData={selectedIds}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <View>
            <View style={styles.form}>
              <Text style={styles.label}>Nome do outfit *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex.: Look de sexta"
                placeholderTextColor={COLORS.mutedText}
                value={name}
                onChangeText={setName}
              />
              <Text style={styles.label}>Ocasião</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex.: Trabalho, festa..."
                placeholderTextColor={COLORS.mutedText}
                value={occasion}
                onChangeText={setOccasion}
              />
              {formError ? <Text style={styles.error}>{formError}</Text> : null}
            </View>
            <View style={styles.counterRow}>
              <Text style={styles.counterTitle}>Escolha as peças</Text>
              <View style={styles.counterBadge}>
                <Text style={styles.counterBadgeText}>
                  {selectedIds.length} {selectedIds.length === 1 ? 'selecionada' : 'selecionadas'}
                </Text>
              </View>
            </View>
            </View>
          }
          ListEmptyComponent={<EmptyState message="Cadastre roupas antes de montar um outfit." />}
          renderItem={({ item }) => (
            <View style={[styles.row, selectedIds.includes(item.id) && styles.selected]}>
            <ClothingCard
              clothing={item}
              onPress={() => {
                if (selectedIds.includes(item.id)) {
                  setSelectedIds(selectedIds.filter(selectedId => selectedId !== item.id));
                } else {
                  setSelectedIds([...selectedIds, item.id]);
                }
              }}
            />
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
        <View style={styles.footer}>
          <AppButton
            title={isEditing ? "Atualizar outfit" : "Criar outfit"}
            onPress={handleSave}
            style={isEditing ? styles.footerButton : undefined}
          />
          {isEditing && (
            <AppButton title="Excluir" onPress={confirmDelete} variant="danger" />
          )}
        </View>
        </>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    flex: 1,
    width: '100%',
  },
  listContent: {
    padding: 20,
    paddingBottom: 12,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerButton: {
    marginBottom: 10,
  },
  row: {
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 20,
    marginBottom: 4,
  },
  selected: {
    borderColor: COLORS.primary,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  counterTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  counterBadge: {
    backgroundColor: COLORS.primarySoft,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  counterBadgeText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 4,
  },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 14,
  },
  error: {
    color: COLORS.danger,
    marginBottom: 8,
  }
});