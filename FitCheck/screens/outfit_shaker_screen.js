import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Alert, Vibration } from 'react-native';
import { useState, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Accelerometer } from 'expo-sensors';
import { useOutfitCheck } from '../context/outfit_check_context';
import { CATEGORY_GROUPS, STYLES, COLORS } from '../config/config';
import ClothingCard from '../components/clothing_card';
import AppButton from '../components/app_button';

const GROUP_TITLES = {
    tops: 'Partes de cima',
    bottoms: 'Partes de baixo',
    shoes: 'Calçados',
};

const SHAKE_THRESHOLD = 1.8;
const SHAKE_COOLDOWN_MS = 1000;

export default function OutfitShakerScreen({ navigation }) {
    const [clothes, setClothes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [styleByGroup, setStyleByGroup] = useState({ tops: null, bottoms: null, shoes: null });
    const [suggestion, setSuggestion] = useState({ tops: null, bottoms: null, shoes: null });
    const [suggested, setSuggested] = useState(false);
    const [outfitName, setOutfitName] = useState('');
    const [saveError, setSaveError] = useState(null);

    const { send } = useOutfitCheck();

    const lastShake = useRef(0);
    const suggestRef = useRef(null);

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

    const suggest = () => {
        if (loading) return;
        const next = {};
        Object.keys(CATEGORY_GROUPS).forEach((group) => {
            let candidates = clothes.filter((item) =>
                CATEGORY_GROUPS[group].includes(item.category) &&
                (!styleByGroup[group] || item.style === styleByGroup[group])
            );
            if (candidates.length > 1) {
                candidates = candidates.filter((item) => item.id !== suggestion[group]?.id);
            }
            next[group] = candidates.length === 0
                ? null
                : candidates[Math.floor(Math.random() * candidates.length)];
        });
        setSuggestion(next);
        setSuggested(true);
        setSaveError(null);
        if (Object.values(next).some((piece) => piece !== null)) {
            Vibration.vibrate(300);
        }
    };

    suggestRef.current = suggest;

    useFocusEffect(
    useCallback(() => {
        Accelerometer.setUpdateInterval(100);
        const subscription = Accelerometer.addListener(({ x, y, z }) => {
            const strength = Math.sqrt(x * x + y * y + z * z);
            const now = Date.now();
            if (strength > SHAKE_THRESHOLD && now - lastShake.current > SHAKE_COOLDOWN_MS) {
                lastShake.current = now;
                suggestRef.current();
            }
        });
        return () => subscription.remove();
    }, [])
    );

    const pieces = Object.values(suggestion).filter((piece) => piece !== null);

    const handleSave = async () => {
        if (!outfitName.trim()) {
            setSaveError('O nome do outfit é obrigatório.');
            return;
        }
        setSaveError(null);
        const response = await send('outfit', 'create', {
            name: outfitName.trim(),
            item_ids: pieces.map((piece) => piece.id),
        });
        if (response.success) {
            Alert.alert('Outfit salvo', 'O outfit foi adicionado à sua lista.');
            navigation.goBack();
        } else {
            Alert.alert('Erro', response.message);
        }
    };

    return(
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {loading && <ActivityIndicator size="large" color={COLORS.primary} />}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.hintBox}>
            <Text style={styles.hintIcon}>📳</Text>
            <Text style={styles.hint}>Escolha os estilos, depois chacoalhe o celular ou toque em Sugerir.</Text>
        </View>

        {Object.keys(CATEGORY_GROUPS).map((group) => (
            <View key={group}>
                <Text style={styles.groupTitle}>{GROUP_TITLES[group]}</Text>
                <ScrollView horizontal style={styles.chips} showsHorizontalScrollIndicator={false}>
                    {STYLES.map((styleName) => (
                        <TouchableOpacity
                            key={styleName}
                            style={[styles.chip, styleByGroup[group] === styleName && styles.chipSelected]}
                            onPress={() => setStyleByGroup({ ...styleByGroup, [group]: styleByGroup[group] === styleName ? null : styleName })}
                        >
                            <Text style={[styles.chipText, styleByGroup[group] === styleName && styles.chipTextSelected]}>{styleName}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        ))}

        <View style={styles.action}>
            <AppButton title="✨ Sugerir outfit" onPress={suggest} disabled={loading} />
        </View>

        {suggested && Object.keys(CATEGORY_GROUPS).map((group) => (
            <View key={group} style={styles.result}>
                <Text style={styles.groupTitle}>{GROUP_TITLES[group]}</Text>
                {suggestion[group] ? (
                    <ClothingCard clothing={suggestion[group]} />
                ) : (
                    <Text style={styles.message}>Nenhuma peça encontrada nesse estilo.</Text>
                )}
            </View>
        ))}

        {suggested && pieces.length > 0 && (
            <View style={styles.saveBox}>
                <Text style={styles.groupTitle}>Gostou? Salve este look</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nome do outfit"
                    placeholderTextColor={COLORS.mutedText}
                    value={outfitName}
                    onChangeText={setOutfitName}
                />
                {saveError ? <Text style={styles.error}>{saveError}</Text> : null}
                <AppButton title="Salvar como outfit" onPress={handleSave} variant="secondary" />
            </View>
        )}
    </ScrollView>
    )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  error: {
    color: COLORS.danger,
    marginBottom: 16,
  },
  hintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primarySoft,
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
  },
  hintIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  hint: {
    flex: 1,
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  groupTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 18,
  },
  chips: {
    marginVertical: 10,
    flexGrow: 0,
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
    color: COLORS.text,
    fontSize: 14,
  },
  chipTextSelected: {
    color: COLORS.white,
    fontWeight: '700',
  },
  action: {
    marginTop: 24,
    marginBottom: 8,
  },
  result: {
    marginBottom: 4,
  },
  message: {
    marginTop: 10,
    color: COLORS.mutedText,
  },
  saveBox: {
    marginTop: 24,
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
    marginTop: 10,
    marginBottom: 12,
  },
});
