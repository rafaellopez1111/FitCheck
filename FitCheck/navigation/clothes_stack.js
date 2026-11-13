import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClothesScreen from '../screens/clothes_screen';
import ItemFormsScreen from '../screens/item_forms_screen';

import { stackScreenOptions } from './stack_options';

const Stack = createNativeStackNavigator();

export default function ClothesStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="ClothesList" component={ClothesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ItemForm" component={ItemFormsScreen} options={{ title: 'Item' }} />
    </Stack.Navigator>
  );
}
