import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ClothesScreen from '../screens/clothes_screen';
import OutfitsScreen from '../screens/outfits_screen';
import WishlistScreen from '../screens/wishlist_screen';
import ProfileScreen from '../screens/profile_screen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {

    return (
    <Tab.Navigator initialRouteName={"Clothes"}>
      <Tab.Screen name="Clothes" component={ClothesScreen} />
      <Tab.Screen name="Outfits" component={OutfitsScreen} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
    );
}
