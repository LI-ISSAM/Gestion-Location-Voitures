"use client"

import { useEffect, useState, useCallback } from "react"
import {
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Image,
  TextInput
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { supabase } from "../../lib/supabase"


export default function VoituresListScreen({ navigation }) {
  const [voitures, setVoitures] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [search,setSearch] = useState("")


  const filterVoitures = voitures.filter((v)=>{
      const term = search.toLowerCase();
      return (
        v.marque.toLowerCase().includes(term)
        ||
        v.modele.toLowerCase().includes(term)
      )
  })

  const loadVoitures = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("voitures").select("*").order("id", { ascending: false })

      if (error) {
        console.error("Erreur chargement:", error)
        Alert.alert("Erreur chargement", error.message)
        return
      }
      setVoitures(data || [])
    } catch (error) {
      console.error("Exception chargement:", error)
      Alert.alert("Erreur", "Impossible de charger les voitures")
    }
  }, [])

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadVoitures()
    })

    loadVoitures()

    return unsubscribe
  }, [navigation, loadVoitures])

  const deleteVoiture = async (id) => {
    Alert.alert("Confirmation", "Voulez-vous vraiment supprimer cette voiture ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          try {
            const { error } = await supabase.from("voitures").delete().eq("id", id)
            if (error) {
              Alert.alert("Erreur", error.message)
            } else {
              Alert.alert("Succès ✅", "Voiture supprimée")
              loadVoitures()
            }
          } catch (error) {
            Alert.alert("Erreur", "Impossible de supprimer la voiture")
          }
        },
      },
    ])
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadVoitures()
    setRefreshing(false)
  }

  const renderCarItem = useCallback(
    ({ item }) => (
      <View style={styles.carItem}>
        {item.photo ? (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: item.photo }} style={styles.carImage} resizeMode="cover" />
            <View style={styles.imageOverlay} />
          </View>
        ) : (
          <View style={[styles.carImage, styles.placeholderImage]}>
            <Ionicons name="car" size={48} color="#9CA3AF" />
          </View>
        )}

        <View style={styles.cardContent}>
          <View style={styles.titleSection}>
            <View style={{ flex: 1 }}>
              <Text style={styles.carTitle} numberOfLines={1}>
                {item.marque}
              </Text>
              <Text style={styles.carModel} numberOfLines={1}>
                {item.modele}
              </Text>
              <Text style={styles.carYear}>{item.annee}</Text>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate("Modifier Voiture", { voiture: item })}
                activeOpacity={0.7}
              >
                <Ionicons name="pencil" size={18} color="white" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteButton} onPress={() => deleteVoiture(item.id)} activeOpacity={0.7}>
                <Ionicons name="trash" size={18} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Prix</Text>
              <Text style={styles.detailValuePrice}>{item.prix.toLocaleString()} DH</Text>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Quantité</Text>
              <Text style={styles.detailValue}>{item.quantite}</Text>
            </View>
          </View>
        </View>
      </View>
    ),
    [navigation],
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Inventaire</Text>
          <Text style={styles.headerSubtitle}>
            {filterVoitures.length} voiture{filterVoitures.length !== 1 ? "s" : ""}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("Ajouter Voiture")}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Ajouter</Text>
        </TouchableOpacity>
      </View>

      <View style ={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9CA3AF"/>
        <TextInput
        placeholder="Marque , Modéle"
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
        placeholderTextColor="#9CA3AF"
        />

        {search.length > 0 &&(
          <TouchableOpacity onPress ={()=>setSearch("")}>
            <Ionicons name="close-circle" size={20} color="#9CA3AF"/>
          </TouchableOpacity>
        )}

      </View>

      {voitures.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="car-outline" size={64} color="#D1D5DB" style={{ marginBottom: 16 }} />
          <Text style={styles.emptyText}>Aucune voiture disponible</Text>
          <Text style={styles.emptySubtext}>Commencez en ajoutant votre première voiture</Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate("Ajouter Voiture")}
              activeOpacity={0.7}
          >
            <Ionicons name="add-circle" size={20} color="white" />
            <Text style={styles.emptyButtonText}>Ajouter une voiture</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filterVoitures}
          keyExtractor={(item) => `car-${item.id}`}
          renderItem={renderCarItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#2563EB"]} tintColor="#2563EB" />
          }
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#2563EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  addButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  carItem: {
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageWrapper: {
    width: "100%",
    height: 200,
    backgroundColor: "#F3F4F6",
    overflow: "hidden",
  },
  carImage: {
    width: "100%",
    height: 200,
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  cardContent: {
    padding: 16,
  },
  titleSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  carTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  carModel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  carYear: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    backgroundColor: "#3B82F6",
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#EF4444",
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  detailsGrid: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  detailItem: {
    flex: 1,
  },
  detailDivider: {
    width: 1,
    height: 32,
    backgroundColor: "#F3F4F6",
    marginHorizontal: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  detailValuePrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2563EB",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 24,
    textAlign: "center",
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#2563EB",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  emptyButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
})
