import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import ClientsListScreen from '../screens/clients/ClientsListScreen';
import AddClientScreen from '../screens/clients/AddClientScreen';

const Tab = createBottomTabNavigator();

export default function clientBottomNavigator(){
    return (
        <Tab.Navigator >
            <Tab.Screen name ="ClientsList" component={ClientsListScreen}
            options={{title:'Clients'}}
            />
            <Tab.Screen name ="AddClient" component={AddClientScreen}
            options={{title:'Ajouter'}}
            />
        </Tab.Navigator>
    )
}