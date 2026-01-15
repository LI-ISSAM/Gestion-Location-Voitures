import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AddVoitureScreen from "../screens/voitures/AddVoitureScreen";
import VoituresListScreen from "../screens/voitures/VoituresListScreen";

const Tab = createBottomTabNavigator();

export default function VoituresBottomNavigator(){
    return (
        <Tab.Navigator>
            <Tab.Screen name ="Liste" component={VoituresListScreen} options={{title:'Voitures'}} />
            <Tab.Screen name ="Ajouter" component={AddVoitureScreen} options ={{title:'Ajouter Voiture'}}/>
        </Tab.Navigator>
    )
}