"use client"

import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { MaterialIcons } from "@expo/vector-icons"

const COLORS = {
  primary: "#0F3A5E",
  accent: "#00A8CC",
  success: "#2E7D32",
  danger: "#D32F2F",
  warning: "#F57C00",
  background: "#F5F7FA",
  cardBg: "#FFFFFF",
  text: "#1A1A1A",
  textLight: "#666666",
  border: "#E0E0E0",
}

export default function ClientsListScreen({ navigation }) {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)

  const loadClients = async () => {
    setLoading(true)
    const { data, error } = await supabase.from("clients").select("*").order("id", { ascending: true })

    if (!error) {
      setClients(data)
    } else {
      Alert.alert("Erreur", "Impossible de charger les clients")
    }
    setLoading(false)
  }

  const deleteClient = async (id) => {
    Alert.alert("Confirmation", "Êtes-vous sûr de vouloir supprimer ce client ?", [
      { text: "Annuler", onPress: () => {} },
      {
        text: "Supprimer",
        onPress: async () => {
          const { error } = await supabase.from("clients").delete().eq("id", id)
          if (error) {
            Alert.alert("Erreur", "Erreur lors de la suppression")
          } else {
            Alert.alert("Succès", "Client supprimé")
            loadClients()
          }
        },
        style: "destructive",
      },
    ])
  }

  useEffect(() => {
    loadClients()
  }, [])

  useEffect(() => {
    const refresh = navigation.addListener("focus", loadClients)
    return refresh
  }, [navigation])

  const renderClientCard = ({ item }) => (
    <View
      style={{
        backgroundColor: COLORS.cardBg,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.accent,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View style={{ marginBottom: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: "600", color: COLORS.text }}>
          {item.nom} {item.prenom}
        </Text>
        <View style={{ marginTop: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
            <MaterialIcons name="email" size={16} color={COLORS.textLight} />
            <Text style={{ fontSize: 13, color: COLORS.textLight, marginLeft: 8 }}>{item.email}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons name="phone" size={16} color={COLORS.textLight} />
            <Text style={{ fontSize: 13, color: COLORS.textLight, marginLeft: 8 }}>{item.telephone}</Text>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: COLORS.accent,
            paddingVertical: 10,
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
          onPress={() => navigation.navigate("Modifier Client", { client: item })}
        >
          <MaterialIcons name="edit" size={18} color="#FFFFFF" />
          <Text style={{ color: "#FFFFFF", fontSize: 13, fontWeight: "600" }}>Modifier</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: COLORS.danger,
            paddingVertical: 10,
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
          onPress={() => deleteClient(item.id)}
        >
          <MaterialIcons name="delete" size={18} color="#FFFFFF" />
          <Text style={{ color: "#FFFFFF", fontSize: 13, fontWeight: "600" }}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 12,
          backgroundColor: COLORS.primary,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <MaterialIcons name="people" size={28} color={COLORS.accent} />
          <View>
            <Text style={{ fontSize: 20, fontWeight: "700", color: "#FFFFFF" }}>Clients</Text>
            <Text style={{ fontSize: 12, color: COLORS.accent }}>{clients.length} client(s)</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={clients}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderClientCard}
        contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
        scrollEnabled={true}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <MaterialIcons name="person-add" size={48} color={COLORS.border} />
            <Text
              style={{
                marginTop: 12,
                fontSize: 16,
                color: COLORS.textLight,
                fontWeight: "500",
              }}
            >
              Aucun client
            </Text>
            <Text
              style={{
                marginTop: 4,
                fontSize: 13,
                color: COLORS.textLight,
              }}
            >
              Commencez par ajouter un client
            </Text>
          </View>
        }
      />
    </View>
  )
}
