import { View, Text, TextInput, TouchableOpacity, ScrollView, Button, StyleSheet } from 'react-native'
import { useState } from "react"
import { CATEGORIES, STYLES } from '../config/config'

export default function ClothingForm({initialValues, onSubmit, submitLabel}) {
    const [name, setName] = useState(initialValues?.name ?? '');
    const [brand, setBrand] = useState(initialValues?.brand ?? '');
    const [size, setSize] = useState(initialValues?.size ?? '');
    const [notes, setNotes] = useState(initialValues?.notes ?? '');
    const [category, setCategory] = useState(initialValues?.category ?? null);
    const [style, setStyle] = useState(initialValues?.style ?? null);
    const [photo, setPhoto] = useState(initialValues?.photo ?? null);

    return (
    <View>
        <Text>Name *</Text>
        <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nome do produto"
        />

        <Text>Brand</Text>
        <TextInput
        style={styles.input}
        value={brand}
        onChangeText={setBrand}
        placeholder="Marca"
        />

        <Text>Size</Text>
        <TextInput
        style={styles.input}
        value={size}
        onChangeText={setSize}
        placeholder="Tamanho"
        />

        <Text>Notes</Text>
        <TextInput
        style={styles.notesInput}
        value={notes}
        onChangeText={setNotes}
        placeholder="Observações"
        multiline
        />
    </View>
    );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
    minHeight: 80,
    textAlignVertical: 'top'
  }
});