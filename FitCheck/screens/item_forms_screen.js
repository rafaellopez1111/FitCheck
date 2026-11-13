import { useState, useEffect } from 'react'
import { View, Text, Alert, ActivityIndicator, StyleSheet } from 'react-native'
import ClothingForm from '../components/add_clothing_forms'
import AppButton from '../components/app_button'
import { COLORS } from '../config/config'
import { useOutfitCheck } from '../context/outfit_check_context'

export default function ItemFormsScreen({ navigation, route }) {
    const { send } = useOutfitCheck();
    const entity = route.params?.entity ?? 'clothing';
    const id = route.params?.id;
    const editing = Boolean(id);
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(editing);
    const [error, setError] = useState(null);

    const loadItem = async () => {
        setLoading(true);
        const response = await send(entity, 'get_one', { id });
        if (response.success) {
            setItem(response.data);
            setError(null);
        } else {
            setError(response.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (editing) {
            loadItem();
        }
    }, [id]);

    const handleSubmit = async (data) => {
        const action = editing ? 'update' : 'create';
        const response = await send(entity, action, data);
        if (!response.success) {
            Alert.alert('Erro', response.message);
        } else {
            navigation.goBack();
        }
    };

    const handleDelete = async (id) => {
        const response = await send(entity, 'delete', { id });
        if (!response.success) {
            Alert.alert('Erro', response.message);
        } else {
            navigation.goBack();
        }
    };

    const confirmDelete = (id) => {
        Alert.alert(
            'Deseja excluir este item?',
            'Tem certeza de que deseja excluir este item?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Excluir', style: 'destructive', onPress: () => handleDelete(id) }
            ]
        );
    };

    const handleMarkAsBought = async (id) => {
        const response = await send(entity, 'mark_as_bought', { id });
        if (!response.success) {
            Alert.alert('Erro', response.message);
        } else {
            navigation.goBack();
        }
    };

    const confirmMarkAsBought = (id) => {
        Alert.alert(
            'Marcar como comprado',
            'Tem certeza de que deseja marcar este item como comprado?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Confirmar', onPress: () => handleMarkAsBought(id) }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>Erro: {error}</Text>
                <AppButton title="Tentar novamente" onPress={loadItem} variant="secondary" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ClothingForm
                initialValues={item}
                onSubmit={handleSubmit}
                submitLabel={editing ? 'Atualizar' : 'Salvar'}
                isWishlist={entity === 'wishlist'}
            />
            {editing && (
                <View style={styles.actions}>
                    {entity === 'wishlist' && (
                        <AppButton
                            title="Marcar como comprado"
                            onPress={() => confirmMarkAsBought(item.id)}
                            variant="secondary"
                            style={styles.action}
                        />
                    )}
                    <AppButton
                        title="Excluir"
                        onPress={() => confirmDelete(item.id)}
                        variant="danger"
                    />
                </View>
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
        backgroundColor: COLORS.background,
    },
    errorText: {
        color: COLORS.danger,
        marginBottom: 12,
    },
    actions: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 24,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        backgroundColor: COLORS.card,
    },
    action: {
        marginBottom: 10,
    },
});
