import { View, Text, StyleSheet, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useOutfitCheck } from '../context/outfit_check_context';
import ImageField from '../components/image_field';
import AppButton from '../components/app_button';
import { AUTH_MESSAGES } from './auth_screen';
import { COLORS } from '../config/config';

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [linkEmail, setLinkEmail] = useState('');
  const [linkPassword, setLinkPassword] = useState('');
  const [linkError, setLinkError] = useState(null);
  const [linking, setLinking] = useState(false);
  const { send, isAnonymous, email, linkAccount, signOutUser } = useOutfitCheck();

  const handleLink = async () => {
    if (!linkEmail.trim() || !linkPassword) {
      setLinkError('Preencha e-mail e senha.');
      return;
    }
    setLinking(true);
    setLinkError(null);
    try {
      await linkAccount(linkEmail.trim(), linkPassword);
      setLinkEmail('');
      setLinkPassword('');
      Alert.alert('Conta criada', 'Seus dados agora estão ligados a esta conta.');
    } catch (e) {
      if (e.code === 'auth/email-already-in-use' || e.code === 'auth/credential-already-in-use') {
        setLinkError('Este e-mail já tem uma conta. Use "Já tenho conta" abaixo para entrar nela.');
      } else {
        setLinkError(AUTH_MESSAGES[e.code] ?? 'Não foi possível criar a conta.');
      }
    }
    setLinking(false);
  };

  const confirmUseOtherAccount = () => {
    Alert.alert(
      'Entrar em outra conta?',
      'Os dados salvos sem conta neste aparelho serão perdidos. Para guardá-los, crie uma conta aqui em vez de entrar em outra.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Entrar em outra conta', style: 'destructive', onPress: signOutUser },
      ]
    );
  };

  const confirmSignOut = () => {
    Alert.alert(
      'Sair da conta?',
      'Você poderá entrar de novo com seu e-mail e senha.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: signOutUser },
      ]
    );
  };

  const fetchProfile = async () => {
    setLoading(true);
    const response = await send('profile', 'get_one', { id: 'me' });
    if (response.success) {
      setProfile(response.data);
      setName(response.data.name);
      setPhoto(response.data.photo ?? null);
      setError(null);
    } else if (response.code === 404) {
      setProfile(null);
      setError(null);
    } else {
      setError(response.message);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [send])
  );

  const handleSave = async () => {
    if (!name.trim()) {
      setFormError('O nome é obrigatório.');
      return;
    }
    setFormError(null);

    const editing = Boolean(profile);
    const data = { name: name.trim() };
    if (editing) data.id = profile.id;
    if (photo) data.photo = photo;
    else if (editing) data.photo = null;

    const response = await send('profile', editing ? 'update' : 'create', data);
    if (response.success) {
      Alert.alert('Perfil salvo', editing ? 'Perfil atualizado.' : 'Perfil criado.');
      fetchProfile();
    } else {
      Alert.alert('Erro', response.message);
    }
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
        <Text style={styles.error}>Erro: {error}</Text>
        <AppButton title="Tentar novamente" onPress={fetchProfile} variant="secondary" />
      </View>
    );
  }

  const stats = profile?.stats;

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <ImageField photo={photo} onChange={setPhoto} />

      <Text style={styles.label}>Nome *</Text>
      <TextInput
        style={styles.input}
        placeholder="Seu nome"
        placeholderTextColor={COLORS.mutedText}
        value={name}
        onChangeText={setName}
      />
      {formError ? <Text style={styles.error}>{formError}</Text> : null}
      <AppButton title={profile ? 'Atualizar perfil' : 'Criar perfil'} onPress={handleSave} />

      {stats ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Suas estatísticas</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{stats.clothing_count}</Text>
              <Text style={styles.statLabel}>Roupas</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{stats.outfit_count}</Text>
              <Text style={styles.statLabel}>Outfits</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{stats.wishlist_count}</Text>
              <Text style={styles.statLabel}>Wishlist</Text>
            </View>
          </View>
          <Text style={styles.total}>Total da wishlist: R$ {stats.wishlist_total.toFixed(2)}</Text>
        </View>
      ) : null}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Conta</Text>
        {isAnonymous ? (
          <View>
            <Text style={styles.note}>
              Você está sem conta. Crie uma para não perder seus dados se desinstalar o app.
            </Text>
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor={COLORS.mutedText}
              value={linkEmail}
              onChangeText={setLinkEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor={COLORS.mutedText}
              value={linkPassword}
              onChangeText={setLinkPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            {linkError ? <Text style={styles.error}>{linkError}</Text> : null}
            {linking ? (
              <ActivityIndicator color={COLORS.primary} />
            ) : (
              <AppButton title="Criar conta" onPress={handleLink} />
            )}
            <View style={styles.otherAccount}>
              <AppButton title="Já tenho conta" onPress={confirmUseOtherAccount} disabled={linking} variant="secondary" />
            </View>
          </View>
        ) : (
          <View>
            <Text style={styles.note}>Conectado como {email}</Text>
            <AppButton title="Sair" onPress={confirmSignOut} variant="danger" />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 16,
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
    marginBottom: 14,
  },
  error: {
    color: COLORS.danger,
    marginBottom: 12,
  },
  card: {
    marginTop: 28,
    padding: 18,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
    backgroundColor: COLORS.primarySoft,
    borderRadius: 14,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.mutedText,
    marginTop: 2,
  },
  total: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  note: {
    color: COLORS.mutedText,
    marginBottom: 14,
  },
  otherAccount: {
    marginTop: 12,
  },
});
