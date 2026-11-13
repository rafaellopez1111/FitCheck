import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OutfitsScreen from '../screens/outfits_screen';
import OutfitBuilderScreen from '../screens/outfit_builder_screen';
import OutfitShakerScreen from '../screens/outfit_shaker_screen';

import { stackScreenOptions } from './stack_options';

const Stack = createNativeStackNavigator();

export default function OutfitStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="OutfitsList" component={OutfitsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="OutfitBuilder" component={OutfitBuilderScreen} options={{ title: 'Construir Outfit' }} />
      <Stack.Screen name="OutfitShaker" component={OutfitShakerScreen} options={{ title: 'Monte meu Outfit' }} />
    </Stack.Navigator>
  );
}
