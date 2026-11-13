import { NavigationContainer } from '@react-navigation/native';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useOutfitCheck, OutfitCheckProvider } from './context/outfit_check_context';
import AppNavigator from './navigation/app_navigator';
import AuthScreen from './screens/auth_screen';
import { COLORS } from './config/config';

function Root() {
    const { ready, authLoading } = useOutfitCheck();

    if (authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (!ready) {
    return <AuthScreen />;
  }

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <OutfitCheckProvider>
      <Root />
    </OutfitCheckProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.mutedText,
  },
});
