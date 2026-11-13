import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WishlistScreen from '../screens/wishlist_screen';
import ItemFormsScreen from '../screens/item_forms_screen';

import { stackScreenOptions } from './stack_options';

const Stack = createNativeStackNavigator();

export default function WishlistStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="MinhaWishlist" component={WishlistScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ItemForm" component={ItemFormsScreen} options={{ title: 'Item' }} />
    </Stack.Navigator>
  );
}
