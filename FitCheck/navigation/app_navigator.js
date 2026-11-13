import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import ClothesStack from './clothes_stack';
import OutfitStack from './outfit_stack';
import WishlistStack from './wishlist_stack';
import ProfileScreen from '../screens/profile_screen';
import HomeScreen from '../screens/home_screen';
import { COLORS } from '../config/config';

const Tab = createBottomTabNavigator();

function tabIcon(emoji) {
  return ({ focused }) => (
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.45 }}>{emoji}</Text>
  );
}

export default function AppNavigator() {

    return (
    <Tab.Navigator
      initialRouteName={"Home"}
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.mutedText,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        tabBarStyle: { backgroundColor: COLORS.card, borderTopColor: COLORS.border },
        headerStyle: { backgroundColor: COLORS.background },
        headerTitleStyle: { fontWeight: '700', color: COLORS.text },
        headerShadowVisible: false,
        sceneStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Início', tabBarIcon: tabIcon('🏠') }} />
      <Tab.Screen name="Clothes" component={ClothesStack} options={{ title: 'Roupas', headerShown: false, tabBarIcon: tabIcon('👕') }} />
      <Tab.Screen name="Outfits" component={OutfitStack} options={{ title: 'Outfits', headerShown: false, tabBarIcon: tabIcon('✨') }} />
      <Tab.Screen name="Wishlist" component={WishlistStack} options={{ title: 'Wishlist', headerShown: false, tabBarIcon: tabIcon('🛍️') }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil', tabBarIcon: tabIcon('👤') }} />
    </Tab.Navigator>
    );
}
