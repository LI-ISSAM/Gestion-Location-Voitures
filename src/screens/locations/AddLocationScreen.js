"use client"

import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { Picker } from "@react-native-picker/picker"
import DateTimePicker from "@react-native-community/datetimepicker"
import { MaterialIcons } from "@expo/vector-icons"

export default function AddLocationScreen({ navigation }) {
  const [clients, setClients] = useState([])
  const [voitures, setVoitures] = useState([])
  const [clientId, setClientId] = useState(null)
  const [voitureId, setVoitureId] = useState(null)
  const [dateDebut, setDateDebut] = useState(new Date())
  const [dateFin, setDateFin] = useState(new Date())
  const [showDebut, setShowDebut] = useState(false)
  const [showFin, setShowFin] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadClientsAndVoitures()
  }, [])

  const loadClientsAndVoitures = async () => {
    const { data: clientsData } = await supabase.from("clients").select("*")
    const { data: voituresData } = await supabase.from("voitures").select("*")
    setClients(clientsData || [])
    setVoitures(voituresData || [])
  }

  const formatDate = (date) => {
    return date.toISOString().split("T")[0]
  }

  const getClientName = () => {
    const client = clients.find((c) => c.id === clientId)
    return client ? `${client.nom} ${client.prenom}` : "Sélectionner un client"
  }

  const getVoitureName = () => {
    const voiture = voitures.find((v) => v.id === voitureId)
    return voiture ? `${voiture.marque} ${voiture.modele}` : "Sélectionner une voiture"
  }

  const addLocation = async () => {

    const {data:voiture} = await supabase.from("voitures").select().eq("id",voitureId).single()
    if(!voiture || voiture.quantite <= 0 ){
        Alert.alert("Erreur", "La voiture sélectionnée n'est pas disponible")
    }
    if (!clientId || !voitureId) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs")
      return
    }

    if (dateFin < dateDebut) {
      Alert.alert("Erreur", "La date de fin doit être après la date de début")
      return
    }

    setLoading(true)
    const { error } = await supabase.from("locations").insert({
      client_id: clientId,
      voiture_id: voitureId,
      date_debut: formatDate(dateDebut),
      date_fin: formatDate(dateFin),
    })

    setLoading(false)
    
    if (error) {
        Alert.alert("Erreur", "Erreur lors de l'ajout de la location")
    } else {
        await supabase.from("voitures").update({quantite: voiture.quantite-1}).eq("id", voitureId)
      Alert.alert("Succès", "Location ajoutée avec succès")
      navigation.goBack()
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 24 }}>
        <View style={{ marginBottom: 28 }}>
          <Text style={{ fontSize: 28, fontWeight: "700", color: "#1a1a1a", marginBottom: 8 }}>Nouvelle Location</Text>
          <Text style={{ fontSize: 14, color: "#666", lineHeight: 20 }}>
            Créez une nouvelle location de véhicule pour un client
          </Text>
        </View>

        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <MaterialIcons name="person" size={20} color="#2563eb" style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#1a1a1a" }}>Client</Text>
          </View>
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              borderWidth: 1.5,
              borderColor: "#e5e7eb",
              overflow: "hidden",
            }}
          >
            <Picker selectedValue={clientId} onValueChange={setClientId} style={{ height: 56, color: "#1a1a1a" }}>
              <Picker.Item label="Sélectionner un client" value={null} />
              {clients.map((c) => (
                <Picker.Item key={c.id} label={`${c.nom} ${c.prenom}`} value={c.id} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <MaterialIcons name="directions-car" size={20} color="#2563eb" style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#1a1a1a" }}>Véhicule</Text>
          </View>
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              borderWidth: 1.5,
              borderColor: "#e5e7eb",
              overflow: "hidden",
            }}
          >
            <Picker selectedValue={voitureId} onValueChange={setVoitureId} style={{ height: 56, color: "#1a1a1a" }}>
              <Picker.Item label="Sélectionner une voiture" value={null} />
              {voitures.map((v) => (
                <Picker.Item key={v.id} label={`${v.marque} ${v.modele}`} value={v.id} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={{ marginBottom: 28 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#1a1a1a", marginBottom: 12 }}>
            Période de location
          </Text>

          <TouchableOpacity
            onPress={() => setShowDebut(true)}
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              borderWidth: 1.5,
              borderColor: "#e5e7eb",
              padding: 14,
              marginBottom: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons name="calendar-today" size={18} color="#2563eb" style={{ marginRight: 10 }} />
              <View>
                <Text style={{ fontSize: 12, color: "#999", marginBottom: 2 }}>Date de début</Text>
                <Text style={{ fontSize: 14, fontWeight: "600", color: "#1a1a1a" }}>{formatDate(dateDebut)}</Text>
              </View>
            </View>
            <MaterialIcons name="edit" size={18} color="#999" />
          </TouchableOpacity>

          {showDebut && (
            <DateTimePicker
              value={dateDebut}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDebut(false)
                if (selectedDate) setDateDebut(selectedDate)
              }}
            />
          )}

          <TouchableOpacity
            onPress={() => setShowFin(true)}
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              borderWidth: 1.5,
              borderColor: "#e5e7eb",
              padding: 14,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons name="calendar-today" size={18} color="#2563eb" style={{ marginRight: 10 }} />
              <View>
                <Text style={{ fontSize: 12, color: "#999", marginBottom: 2 }}>Date de fin</Text>
                <Text style={{ fontSize: 14, fontWeight: "600", color: "#1a1a1a" }}>{formatDate(dateFin)}</Text>
              </View>
            </View>
            <MaterialIcons name="edit" size={18} color="#999" />
          </TouchableOpacity>

          {showFin && (
            <DateTimePicker
              value={dateFin}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowFin(false)
                if (selectedDate) setDateFin(selectedDate)
              }}
            />
          )}
        </View>
          <View style={{flexDirection:"row",justifyContent:"center",gap:16}}>
            <TouchableOpacity
            style={{
              backgroundColor: loading ? "#d1d5db" : "#2563eb",
            borderRadius: 12,
            paddingVertical: 14,
            paddingHorizontal: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            flex:1
            }}
            onPress = {()=>navigation.goBack()}
            
            >
              <MaterialIcons name="cancel" size={20} color="#fff" style={{ marginRight: 8 }} /> 
              <Text style={{ fontSize: 16, fontWeight: "600", color: "#fff" }}  > 
                Annuler
              </Text>
            </TouchableOpacity>
         <TouchableOpacity
          onPress={addLocation}
          disabled={loading}
          style={{
            backgroundColor: loading ? "#d1d5db" : "#2563eb",
            borderRadius: 12,
            paddingVertical: 14,
            paddingHorizontal: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
flex:0          }}
        >
          <MaterialIcons name="add-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#fff" }}>
            {loading ? "Ajout en cours..." : "Ajouter la location"}
          </Text>
        </TouchableOpacity>
          </View>

    
      </View>
    </ScrollView>
  )
}
