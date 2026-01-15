import React from "react"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { Ionicons } from "@expo/vector-icons"
import { View, Text, ScrollView, TouchableOpacity } from "react-native"

import DashboardScreen from "../screens/DashboardScreen"
import ClientsListScreen from "../screens/clients/ClientsListScreen"
import VoituresListScreen from "../screens/voitures/VoituresListScreen"
import clientBottomNavigator from "./ClientsBottomNavigator"
import VoituresBottomNavigator from "./VoituresBottomNavigator"
import LocationBottomNavigator from "./LocationBottomNavigator"
import LocationsListScreen from "../screens/locations/LocationsListScreen"

const Drawer = createDrawerNavigator()

function CustomDrawerContent(props) {
  const { navigation } = props

  const menuItems = [
    {
      label: "Dashboard",
      name: "Dashboard",
      icon: "home",
      color: "#6366f1",
    },
    {
      label: "Gérer Clients",
      name: "Gerer Clients",
      icon: "people",
      color: "#ec4899",
    },
    {
      label: "Gérer Voitures",
      name: "Gerer Voitures",
      icon: "car",
      color: "#3b82f6",
    },
    {
      label: "Gérer Locations",
      name: "Gerer Locations",
      icon: "calendar",
      color: "#8b5cf6",
    },
    {
      label: "Liste des Clients",
      name: "Liste des clients",
      icon: "list",
      color: "#f59e0b",
    },
    {
      label: "Liste des Voitures",
      name: "Liste des voitures",
      icon: "car-outline",
      color: "#10b981",
    },
    {
      label: "Liste des Locations",
      name: "Liste des locations",
      icon: "document-text",
      color: "#06b6d4",
    },
  ]

  return (
    <View style={{ flex: 1, backgroundColor: "#0f172a" }}>
      <View
        style={{
          paddingVertical: 24,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#1e293b",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: "#4f46e5",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="briefcase" size={28} color="#ffffff" />
          </View>
          <View>
          
            <Text style={{ fontSize: 18, color: "#ffffff", marginTop: 17 }}>
              Gestion automobile
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1, paddingVertical: 16 }} showsVerticalScrollIndicator={false}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate(item.name)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 12,
              paddingHorizontal: 16,
              marginHorizontal: 8,
              borderRadius: 12,
              marginBottom: 4,
            }}
            activeOpacity={0.6}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: item.color + "20",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name={item.icon} size={20} color={item.color} />
            </View>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "500",
                color: "#e2e8f0",
                marginLeft: 12,
                flex: 1,
              }}
            >
              {item.label}
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#64748b" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}


export default function DrawerNavigation() {
  return (
   <Drawer.Navigator
  initialRouteName="Dashboard"
  drawerContent={(props) => <CustomDrawerContent {...props} />}
  screenOptions={({ navigation }) => ({
    headerShown: true,
    headerStyle: {
      backgroundColor: "#0f172a",
      borderBottomWidth: 1,
      borderBottomColor: "#1e293b",
    },
    headerTintColor: "#ffffff",
    headerTitleStyle: {
      fontWeight: "700",
      fontSize: 16,
    },
    headerLeftContainerStyle: {
      paddingLeft: 12,
    },
  
    drawerPosition: "left",
    drawerType: "slide",
    overlayColor: "rgba(0, 0, 0, 0.5)",
  })}
>
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: "Tableau de Bord",
        }}
      />
      <Drawer.Screen
        name="Gerer Clients"
        component={clientBottomNavigator}
        options={{
          title: "Gestion Clients",
        }}
      />
      <Drawer.Screen
        name="Gerer Voitures"
        component={VoituresBottomNavigator}
        options={{
          title: "Gestion Voitures",
        }}
      />
      <Drawer.Screen
        name="Gerer Locations"
        component={LocationBottomNavigator}
        options={{
          title: "Gestion Locations",
        }}
      />
      <Drawer.Screen
        name="Liste des clients"
        component={ClientsListScreen}
        options={{
          title: "Tous les Clients",
        }}
      />
      <Drawer.Screen
        name="Liste des voitures"
        component={VoituresListScreen}
        options={{
          title: "Toutes les Voitures",
        }}
      />
      <Drawer.Screen
        name="Liste des locations"
        component={LocationsListScreen}
        options={{
          title: "Toutes les Locations",
        }}
      />
    </Drawer.Navigator>
  )
}