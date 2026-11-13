import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { useState } from "react"
import { CATEGORIES, STYLES, PRIORITIES, PRIORITY_LABELS, COLORS } from '../config/config'
import ImageField from './image_field'
import AppButton from './app_button'

export default function ClothingForm({initialValues, onSubmit, submitLabel, isWishlist}) {
    const [name, setName] = useState(initialValues?.name ?? '');
    const [brand, setBrand] = useState(initialValues?.brand ?? '');
    const [size, setSize] = useState(initialValues?.size ?? '');
    const [notes, setNotes] = useState(initialValues?.notes ?? '');
    const [price, setPrice] = useState(initialValues?.price != null ? String(initialValues?.price) : '');
    const [storeLink, setStoreLink] = useState(initialValues?.store_link ?? '');
    const [priority, setPriority] = useState(initialValues?.priority ?? null);
    const [category, setCategory] = useState(initialValues?.category ?? null);
    const [style, setStyle] = useState(initialValues?.style ?? null);
    const [photo, setPhoto] = useState(initialValues?.photo ?? null);
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!name.trim() || !category) {
            setError('Os campos Nome e Categoria são obrigatórios.');
            return;
        }
        const cleanPrice = price.trim().replace(',', '.');
        if (isWishlist && cleanPrice && Number.isNaN(Number(cleanPrice))) {
            setError('O preço deve ser um número válido.');
            return;
        }
        setError('');
        const editing = Boolean(initialValues?.id);
        const data = {name: name.trim(), category};
        if (editing) data.id = initialValues.id;
        if (brand.trim()) data.brand = brand.trim();
        else if (editing) data.brand = null;
        if (size.trim()) data.size = size.trim();
        else if (editing) data.size = null;
        if (notes.trim()) data.notes = notes.trim();
        else if (editing) data.notes = null;
        if (isWishlist) {
          if (cleanPrice) data.price = Number(cleanPrice);
          else if (editing) data.price = null;
          if (storeLink.trim()) data.store_link = storeLink.trim();
          else if (editing) data.store_link = null;
          if (priority) data.priority = priority;
          else if (editing) data.priority = null;
        }
        if (style) data.style = style;
        else if (editing) data.style = null;
        if (photo) data.photo = photo;
        else if (editing) data.photo = null;
        onSubmit(data);
    };

    return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <ImageField photo={photo} onChange={setPhoto} />

        <Text style={styles.label}>Nome *</Text>
        <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Ex.: Camiseta branca"
        placeholderTextColor={COLORS.mutedText}
        />

        <Text style={styles.label}>Categoria *</Text>
        <View style={styles.chips}>
          {CATEGORIES.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.chip, category === item && styles.selectedChip]}
              onPress={() => setCategory(item)}
            >
              <Text style={[styles.chipText, category === item && styles.selectedChipText]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.row}>
          <View style={styles.rowItem}>
            <Text style={styles.label}>Marca</Text>
            <TextInput
            style={styles.input}
            value={brand}
            onChangeText={setBrand}
            placeholder="Ex.: Nike"
            placeholderTextColor={COLORS.mutedText}
            />
          </View>
          <View style={styles.rowItem}>
            <Text style={styles.label}>Tamanho</Text>
            <TextInput
            style={styles.input}
            value={size}
            onChangeText={setSize}
            placeholder="Ex.: M"
            placeholderTextColor={COLORS.mutedText}
            />
          </View>
        </View>

        <Text style={styles.label}>Estilo</Text>
        <View style={styles.chips}>
          {STYLES.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.chip, style === item && styles.selectedChip]}
              onPress={() => setStyle(style === item ? null : item)}
            >
              <Text style={[styles.chipText, style === item && styles.selectedChipText]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Observações</Text>
        <TextInput
        style={[styles.input, styles.notesInput]}
        value={notes}
        onChangeText={setNotes}
        placeholder="Algo que valha lembrar"
        placeholderTextColor={COLORS.mutedText}
        multiline
        />

        {isWishlist && (
          <>
            <Text style={styles.label}>Preço</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="Ex.: 129,90"
              placeholderTextColor={COLORS.mutedText}
              keyboardType="decimal-pad"
            />

            <Text style={styles.label}>Prioridade</Text>
            <View style={styles.chips}>
              {PRIORITIES.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[styles.chip, priority === item && styles.selectedChip]}
                  onPress={() => setPriority(priority === item ? null : item)}
                >
                  <Text style={[styles.chipText, priority === item && styles.selectedChipText]}>{PRIORITY_LABELS[item]}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Link da loja</Text>
            <TextInput
              style={styles.input}
              value={storeLink}
              onChangeText={setStoreLink}
              placeholder="https://..."
              placeholderTextColor={COLORS.mutedText}
              autoCapitalize="none"
            />
          </>
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <AppButton title={submitLabel} onPress={handleSubmit} style={styles.submit} />
    </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 18,
    marginBottom: 8,
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
  },
  notesInput: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  rowItem: {
    flex: 1,
    marginRight: 8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 14,
    color: COLORS.text,
  },
  selectedChipText: {
    color: COLORS.white,
    fontWeight: '700',
  },
  errorText: {
    color: COLORS.danger,
    marginTop: 18,
  },
  submit: {
    marginTop: 24,
  },
});
