import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import LocationsListScreen from "../screens/locations/LocationsListScreen";
import AddLocationScreen from "../screens/locations/AddLocationScreen";

const Tab = createBottomTabNavigator();

export default function LocationBottomNavigator() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Locations" component={LocationsListScreen} />
            <Tab.Screen name="Ajouter" component={AddLocationScreen} />
        </Tab.Navigator>
    )

}