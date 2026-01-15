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

export default function EditClientScreen({ route, navigation }) {
  const { client } = route.params || {}

  const [nom, setNom] = useState(client?.nom || "")
  const [prenom, setPrenom] = useState(client?.prenom || "")
  const [email, setEmail] = useState(client?.email || "")
  const [telephone, setTelephone] = useState(client?.telephone || "")
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

  const updateClient = async () => {
    if (!validateForm()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs correctement")
      return
    }

    setLoading(true)
    const { error } = await supabase
      .from("clients")
      .update({
        nom: nom.trim(),
        prenom: prenom.trim(),
        email: email.trim(),
        telephone: telephone.trim(),
      })
      .eq("id", client.id)

    setLoading(false)

    if (error) {
      Alert.alert("Erreur", "Erreur lors de la mise à jour du client")
    } else {
      Alert.alert("Succès", "Client mis à jour avec succès")
      navigation.goBack()
    }
  }



  return (
    <KeyboardAvoidingView  style={{ flex: 1 }}>
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
            <MaterialIcons name="edit" size={28} color={COLORS.accent} />
            <Text style={{ fontSize: 20, fontWeight: "700", color: "#FFFFFF" }}>Mettre à jour</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={{flexGrow:1, padding: 16, paddingBottom: 20 }} showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"

        >
          <View
            style={{
              backgroundColor: COLORS.cardBg,
              borderRadius: 12,
              padding: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 4,
              elevation: 3,
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

          <View style={{ flexDirection: "row", gap: 12, marginTop: 24 }}>
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
              <View style ={{flexDirection:"row",justifyContent:"center",gap:8}}>
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
              onPress={updateClient}
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
                  {loading ? "Mise à jour..." : "Mettre à jour"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}
