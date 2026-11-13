import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useOutfitCheck } from '../context/outfit_check_context';
import AppButton from '../components/app_button';
import { COLORS } from '../config/config';

export const AUTH_MESSAGES = {
    'auth/invalid-email': 'E-mail inválido.',
    'auth/credential-already-in-use': 'Este e-mail já está em uso.',
    'auth/invalid-credential': 'E-mail ou senha incorretos.',
    'auth/user-not-found': 'E-mail ou senha incorretos.',
    'auth/wrong-password': 'E-mail ou senha incorretos.',
    'auth/email-already-in-use': 'Este e-mail já está em uso.',
    'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
    'auth/network-request-failed': 'Sem conexão com a internet.',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
    'auth/operation-not-allowed': 'Login por e-mail não está ativado no Firebase.',
};

export default function AuthScreen() {
    const { signIn, signUp, continueAsGuest } = useOutfitCheck();
    const [mode, setMode] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [busy, setBusy] = useState(false);

    const isLogin = mode === 'login';

    const run = async (action) => {
        setBusy(true);
        setError(null);
        try {
            await action();
        } catch (e) {
            setError(AUTH_MESSAGES[e.code] ?? 'Não foi possível entrar. Tente novamente.');
            setBusy(false);
        }
    };

    const handleSubmit = () => {
        if (!email.trim() || !password) {
            setError('Preencha e-mail e senha.');
            return;
        }
        run(() => (isLogin ? signIn(email.trim(), password) : signUp(email.trim(), password)));
    };

    return (
        <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.logoBox}>
                <Text style={styles.logoEmoji}>👗</Text>
            </View>
            <Text style={styles.title}>OutfitCheck</Text>
            <Text style={styles.subtitle}>{isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}</Text>

            <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor={COLORS.mutedText}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor={COLORS.mutedText}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            {busy ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
            ) : (
                <AppButton title={isLogin ? 'Entrar' : 'Criar conta'} onPress={handleSubmit} />
            )}

            <TouchableOpacity style={styles.link} onPress={() => { setMode(isLogin ? 'signup' : 'login'); setError(null); }}>
                <Text style={styles.linkText}>
                    {isLogin ? 'Não tem conta? Criar conta' : 'Já tem conta? Entrar'}
                </Text>
            </TouchableOpacity>

            <View style={styles.guest}>
                <AppButton title="Continuar sem conta" onPress={() => run(continueAsGuest)} disabled={busy} variant="secondary" />
                <Text style={styles.guestNote}>
                    Sem conta, seus dados ficam só neste aparelho e são perdidos se o app for desinstalado.
                </Text>
            </View>
        </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 28,
    },
    logoBox: {
        alignSelf: 'center',
        width: 84,
        height: 84,
        borderRadius: 28,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    logoEmoji: {
        fontSize: 42,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: COLORS.text,
        textAlign: 'center',
    },
    subtitle: {
        textAlign: 'center',
        color: COLORS.mutedText,
        fontSize: 16,
        marginTop: 4,
        marginBottom: 28,
    },
    input: {
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 14,
        fontSize: 16,
        color: COLORS.text,
        marginBottom: 14,
    },
    error: {
        color: COLORS.danger,
        marginBottom: 14,
    },
    link: {
        marginTop: 18,
        alignItems: 'center',
    },
    linkText: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    guest: {
        marginTop: 36,
    },
    guestNote: {
        marginTop: 10,
        textAlign: 'center',
        color: COLORS.mutedText,
        fontSize: 13,
    },
});
