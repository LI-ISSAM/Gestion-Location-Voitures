"use client"

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native"
import { useState } from "react"
import { supabase } from "../../lib/supabase"
import { MaterialIcons } from "@expo/vector-icons"

const COLORS = {
  primary: "#0F3A5E",
  accent: "#00A8CC",
  success: "#2E7D32",
  danger: "#D32F2F",
  background: "#F5F7FA",
  cardBg: "#FFFFFF",
  text: "#1A1A1A",
  textLight: "#666666",
  border: "#E0E0E0",
  inputBg: "#F9FAFB",
}

const InputField = ({ label, placeholder, value, onChangeText, icon, error }) => (
  <View style={{ marginBottom: 20 }}>
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8, gap: 6 }}>
      <MaterialIcons name={icon} size={18} color={COLORS.accent} />
      <Text style={{ fontSize: 14, fontWeight: "600", color: COLORS.text }}>{label}</Text>
    </View>
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      style={{
        backgroundColor: COLORS.inputBg,
        borderWidth: 1.5,
        borderColor: error ? COLORS.danger : COLORS.border,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 8,
        fontSize: 14,
        color: COLORS.text,
      }}
      placeholderTextColor={COLORS.textLight}
    />
    {error && <Text style={{ fontSize: 12, color: COLORS.danger, marginTop: 4 }}>{error}</Text>}
  </View>
)

export default function AddClientScreen({ navigation }) {
  const [nom, setNom] = useState("")
  const [prenom, setPrenom] = useState("")
  const [email, setEmail] = useState("")
  const [telephone, setTelephone] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!nom.trim()) newErrors.nom = "Le nom est requis"
    if (!prenom.trim()) newErrors.prenom = "Le prénom est requis"
    if (!email.trim()) newErrors.email = "L'email est requis"
    if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Email invalide"
    if (!telephone.trim()) newErrors.telephone = "Le téléphone est requis"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const addClient = async () => {
    if (!validateForm()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs correctement")
      return
    }

    setLoading(true)
    const { error } = await supabase.from("clients").insert({
      nom: nom.trim(),
      prenom: prenom.trim(),
      email: email.trim(),
      telephone: telephone.trim(),
    })

    setLoading(false)

    if (error) {
      Alert.alert("Erreur", "Échec de l'ajout du client")
    } else {
      Alert.alert("Succès", "Client ajouté avec succès")
      setNom("")
      setPrenom("")
      setEmail("")
      setTelephone("")
      navigation.goBack()
    }
  }

  const importClients = async ()=>{
    try {
      setLoading(true)
    const reponse = await fetch("https://randomuser.me/api/?results=10")
    const data = await reponse.json()
    const clients = data.results.map(user=>({
      nom:user.name.last,
      prenom:user.name.first,
      email:user.email,
      telephone:user.phone,
    }))

    const {error} = await supabase.from("clients").insert(clients)
    if(error){
      Alert.alert("Erreur","Echec lors de l'importation des clients")
    }
    else{
      Alert.alert("Succès","les clients  importés avec succès")
    }

    }catch(error){
      console.log(error)
    }
    finally{
      setLoading(false)
    }
  }


  

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
    >
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
            <MaterialIcons name="person-add" size={28} color={COLORS.accent} />
            <Text style={{ fontSize: 20, fontWeight: "700", color: "#FFFFFF" }}>Ajouter un client</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{
              backgroundColor: COLORS.cardBg,
              borderRadius: 12,
              padding: 20,
              shadowColor: "#000",
              elevation: 8,
            }}
          >
            <InputField
              label="Nom"
              placeholder="Entrez le nom du client"
              value={nom}
              onChangeText={setNom}
              icon="badge"
              error={errors.nom}
            />

            <InputField
              label="Prénom"
              placeholder="Entrez le prénom du client"
              value={prenom}
              onChangeText={setPrenom}
              icon="badge"
              error={errors.prenom}
            />

            <InputField
              label="Email"
              placeholder="exemple@email.com"
              value={email}
              onChangeText={setEmail}
              icon="email"
              error={errors.email}
            />

            <InputField
              label="Téléphone"
              placeholder="+212 6XX XXX XXX"
              value={telephone}
              onChangeText={setTelephone}
              icon="phone"
              error={errors.telephone}
            />
          </View>

          <View style={{ flexDirection: "column", gap: 12, marginTop: 24 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: COLORS.border,
                paddingVertical: 14,
                borderRadius: 8,
              }}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <View style={{flexDirection:"row",justifyContent:"center",gap:8}}>
            <MaterialIcons name="cancel" style={{textAlign:"center"}} size={20} color="#fff" />
             <Text

                style={{
                  color: COLORS.text,
                  textAlign: "center",
                  fontSize: 15,
                  fontWeight: "600",
                }}
              >
                Annuler
            </Text>
              </View>
        
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: COLORS.success,
                paddingVertical: 14,
                borderRadius: 8,
                opacity: loading ? 0.7 : 1,
              }}
              onPress={addClient}
              disabled={loading}
            >
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <MaterialIcons name="check" size={20} color="#FFFFFF" />
                <Text
                  style={{
                    color: "#FFFFFF",
                    textAlign: "center",
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  {loading ? "Enregistrement..." : "Enregistrer"}
                </Text>
              </View>
              

            </TouchableOpacity>
          
            <TouchableOpacity
            onPress={importClients}
            style={{
            backgroundColor: COLORS.success,
            paddingVertical: 14,
            borderRadius: 8,
            marginBottom: 20,
            alignItems: "center",
            }}
           >
            <View style ={{flexDirection:'row',justifyContent:'center',gap:8}}>
                <MaterialIcons name="cloud-download" size={20} color="#fff" />
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                Importer des clients
                </Text>  

            </View>

         
            </TouchableOpacity>
          
          </View>
  
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}
