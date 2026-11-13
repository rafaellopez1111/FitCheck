import { View, Text, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import AppButton from './app_button'
import { COLORS } from '../config/config'

export default function ImageField({photo, onChange}) {
    const cameraStatus = async () => {
        return await ImagePicker.requestCameraPermissionsAsync()
    }
    const mediaLibraryStatus = async () => {
        return await ImagePicker.requestMediaLibraryPermissionsAsync()
    }
    const camera = async () => {
        const cameraPermission = await cameraStatus()
        if (cameraPermission.status !== 'granted') {
            Alert.alert('Permissão necessária', 'É necessário conceder permissão para acessar a câmera.')
            return
        }
        const launch = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });
        if (!launch.canceled) {
            onChange(launch.assets[0].uri);
        }
    }

    const library = async () => {
        const libraryPermission = await mediaLibraryStatus()
        if (libraryPermission.status !== 'granted') {
            Alert.alert('Permissão necessária', 'É necessário conceder permissão para acessar a biblioteca de mídia.')
            return
        }
        const launch = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });
        if (!launch.canceled) {
            onChange(launch.assets[0].uri);
        }
    }

    const removePhoto = () => {
        onChange(null);
    }

    return(
        <View style={styles.container}>
            {photo ? (
                <Image source={{uri: photo}} style={styles.preview} />
            ) : (
                <View style={[styles.preview, styles.empty]}>
                    <Text style={styles.emptyIcon}>📷</Text>
                    <Text style={styles.emptyText}>Sem foto</Text>
                </View>
            )}
            <View style={styles.actions}>
                <AppButton title="Tirar foto" onPress={camera} variant="secondary" style={styles.action} />
                <AppButton title="Galeria" onPress={library} variant="secondary" style={styles.action} />
            </View>
            {photo ? (
                <TouchableOpacity onPress={removePhoto} style={styles.remove}>
                    <Text style={styles.removeText}>Remover foto</Text>
                </TouchableOpacity>
            ) : null}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginBottom: 8,
    },
    preview: {
        width: 140,
        height: 140,
        borderRadius: 20,
    },
    empty: {
        backgroundColor: COLORS.primarySoft,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: COLORS.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyIcon: {
        fontSize: 32,
    },
    emptyText: {
        marginTop: 4,
        color: COLORS.mutedText,
    },
    actions: {
        flexDirection: 'row',
        marginTop: 14,
    },
    action: {
        flex: 1,
        marginHorizontal: 6,
        paddingVertical: 10,
    },
    remove: {
        marginTop: 10,
        padding: 6,
    },
    removeText: {
        color: COLORS.danger,
        fontWeight: '600',
    },
});
