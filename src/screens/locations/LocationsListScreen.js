"use client"

import { View, Text, TouchableOpacity, Image, StyleSheet, RefreshControl, Alert, Animated ,TextInput} from "react-native"
import { useEffect, useState, useRef } from "react"
import { supabase } from "../../lib/supabase"
import { Ionicons } from "@expo/vector-icons"

export default function LocationsListScreen({ navigation }) {
  const [locations, setLocations] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [search,setSearch] = useState("")
  const scrollY = useRef(new Animated.Value(0)).current

  const loadLocations = async () => {
    try {
      const { data } = await supabase.from("locations").select(`
            id,
            date_debut,
            date_fin,
            clients(nom,prenom,telephone),
            voitures(marque,modele,photo)
            `)
      setLocations(data || [])
    } catch (error) {
      Alert.alert("Erreur", "Impossible de charger les locations")
    }
  }

  const filterLocations = locations.filter((location)=>{
      const term = search.toLowerCase()
      return (
        location.voitures?.marque.toLowerCase().includes(term) ||
        location.voitures?.modele.toLowerCase().includes(term)||
        location.clients?.nom.toLowerCase().includes(term) ||
        location.clients?.prenom.toLowerCase().includes(term)
      )
  })

 const deleteLocation = async (location) => {
  Alert.alert("Confirmation", "Voulez-vous vraiment supprimer cette location ?", [
    { text: "Annuler", style: "cancel" },
    {
      text: "Supprimer",
      style: "destructive",
      onPress: async () => {
        try {
          const { data: locationData, error: locationError } = await supabase
            .from("locations")
            .select("voiture_id")
            .eq("id", location.id)
            .single()

          if (locationError) throw locationError

          const voitureId = locationData.voiture_id

          const { data: carData, error: carError } = await supabase
            .from("voitures")
            .select("quantite")
            .eq("id", voitureId)
            .single()

          if (carError) throw carError

          const currentQuantite = carData.quantite

          const { error: updateError } = await supabase
            .from("voitures")
            .update({ quantite: currentQuantite + 1 })
            .eq("id", voitureId)

          if (updateError) throw updateError

          const { error: deleteError } = await supabase.from("locations").delete().eq("id", location.id)

          if (deleteError) throw deleteError

          Alert.alert("Succès", "Location supprimée et quantité mise à jour")
          loadLocations()
        } catch (error) {
          console.error("Error:", error)
          Alert.alert("Erreur", "Erreur lors de la suppression de la location")
        }
      },
    },
  ])
}


  const onRefresh = async () => {
    setRefreshing(true)
    await loadLocations()
    setRefreshing(false)
  }

  useEffect(() => {
    loadLocations()
  }, [])

  const formatDateRange = (debut, fin) => {
    return `${debut} → ${fin}`
  }

  const renderLocationItem = ({ item }) => (
    <View style={styles.card}>
      {item.voitures?.photo && (
        <Image source={{ uri: item.voitures.photo }} style={styles.carImage} resizeMode="cover" />
      )}
      <View style={styles.cardContent}>
        <View style={styles.carDetails}>
          <Text style={styles.carTitle}>
            🚗 {item.voitures?.marque} {item.voitures?.modele}
          </Text>
          <Text style={styles.clientName}>
            👤 {item.clients?.nom} {item.clients?.prenom}
          </Text>
          <Text style={styles.phone}>📞 {item.clients?.telephone}</Text>
        </View>

        <View style={styles.dateSection}>
          <Text style={styles.dateLabel}>📅 Période de location</Text>
          <Text style={styles.dateRange}>{formatDateRange(item.date_debut, item.date_fin)}</Text>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate("Modifier Location", { location: item })}
          >
            <Text style={styles.editButtonText}>✏️ Modifier</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => deleteLocation(item)}>
            <Text style={styles.deleteButtonText}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Liste des Locations</Text>
      </View>
      <View style ={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9CA3AF"/>
        <TextInput
        placeholder="Chercher les locations existantes"
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
        />
          {search.length > 0 &&(
          <TouchableOpacity onPress ={()=>setSearch("")}>
            <Ionicons name="close-circle" size={20} color="#9CA3AF"/>
          </TouchableOpacity>
        )}
      </View>
      <Animated.FlatList
        data={filterLocations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderLocationItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#00A8CC"]} tintColor="#00A8CC" />
        }
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>Aucune location disponible</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEF5",
  },
  searchContainer: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "white",
  marginHorizontal: 16,
  marginTop: 12,
  paddingHorizontal: 14,
  paddingVertical: 10,
  borderRadius: 14,
  borderWidth: 1,
  borderColor: "#E5E7EB",
  gap: 8,
},
searchInput: {
  flex: 1,
  fontSize: 14,
  color: "#111827",
},
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F3A5E",
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  carImage: {
    width: "100%",
    height: 180,
    backgroundColor: "#E8EEF5",
  },
  cardContent: {
    padding: 16,
  },
  carDetails: {
    marginBottom: 12,
  },
  carTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F3A5E",
    marginBottom: 8,
  },
  clientName: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    color: "#999",
  },
  dateSection: {
    backgroundColor: "#E8F4FF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  dateLabel: {
    fontSize: 12,
    color: "#00A8CC",
    fontWeight: "600",
    marginBottom: 4,
  },
  dateRange: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F3A5E",
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    flex: 1,
    backgroundColor: "#E8F4FF",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  editButtonText: {
    color: "#00A8CC",
    fontSize: 14,
    fontWeight: "600",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#FFE8E8",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#DC3545",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
})
