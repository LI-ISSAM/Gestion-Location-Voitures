import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';

import LoginScreen from './src/screens/LoginScreen';
import DrawerNavigation  from './src/navigation/DrawerNavigation' ;
import EditClientScreen from './src/screens/clients/EditClientScreen';
import AddClientScreen from './src/screens/clients/AddClientScreen';
import VoituresListScreen from './src/screens/voitures/VoituresListScreen';
import EditVoitureScreen from './src/screens/voitures/EditVoitureSreen';
import AddVoitureScreen from './src/screens/voitures/AddVoitureScreen';
import EditLocationScreen from './src/screens/locations/EditLocationScreen';
const Stack = createNativeStackNavigator();

export default function App() {


  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name ="AddClient" component={AddClientScreen}/>
        <Stack.Screen name="Gestion de Location de voitures" component={DrawerNavigation} />
        <Stack.Screen name ="VoituresList" component={VoituresListScreen}/>
        <Stack.Screen name ="Ajouter Voiture" component={AddVoitureScreen}/>
        <Stack.Screen name ="Modifier Client" component={EditClientScreen}/>
        <Stack.Screen name ="Modifier Voiture" component={EditVoitureScreen}/>
        <Stack.Screen name ="Modifier Location" component={EditLocationScreen}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}
