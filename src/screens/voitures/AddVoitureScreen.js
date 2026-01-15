"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  Image,
  Alert,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { supabase } from "../../lib/supabase"

export default function AddVoitureScreen({ navigation }) {
  const [marque, setMarque] = useState("")
  const [modele, setModele] = useState("")
  const [annee, setAnnee] = useState("")
  const [quantite, setQuantite] = useState("")
  const [prix, setPrix] = useState("")
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)

  async function pickImage() {
    try {
      const { status } = await ImagePicker.getMediaLibraryPermissionsAsync()
      if (status !== "granted") {
        const { status: newStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (newStatus !== "granted") {
          Alert.alert("Permission refusée", "Nous avons besoin de la permission pour accéder aux photos.")
          return
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0]

        if (selectedImage.fileSize > 2 * 1024 * 1024) {
          Alert.alert("Image trop grande", "Veuillez choisir une image de moins de 2MB")
          return
        }

        setImage(selectedImage)
      }
    } catch (error) {
      console.error("Erreur sélection image:", error)
      Alert.alert("Erreur", "Impossible de sélectionner une image: " + error.message)
    }
  }

  async function getImageUrlForStorage(imageUri) {
    try {
      console.log("Utilisation URI locale temporaire:", imageUri)
      return imageUri
    } catch (error) {
      console.error("Erreur préparation image:", error)
      throw error
    }
  }

  async function addVoiture() {
    if (loading) return

    try {
      if (!marque.trim() || !modele.trim() || !annee.trim()) {
        Alert.alert("Erreur", "Veuillez remplir les champs obligatoires (Marque, Modèle, Année)")
        return
      }

      setLoading(true)
      let imageUrl = null

      if (image && image.uri) {
        try {
          setImageLoading(true)
          imageUrl = await getImageUrlForStorage(image.uri)
          console.log("URL image préparée:", imageUrl)
        } catch (imageError) {
          console.warn("Erreur préparation image:", imageError)
          Alert.alert("Attention", "L'image n'a pas pu être préparée. La voiture sera enregistrée sans image.")
        } finally {
          setImageLoading(false)
        }
      }

      const voitureData = {
        marque: marque.trim(),
        modele: modele.trim(),
        annee: Number.parseInt(annee) || 0,
        quantite: Number.parseInt(quantite) || 0,
        prix: Number.parseFloat(prix) || 0,
        photo: imageUrl,
      }

      const { data, error } = await supabase.from("voitures").insert([voitureData]).select()

      if (error) {
        console.error("Erreur insertion:", error)
        Alert.alert("Erreur Base de données", error.message)
        throw error
      }

      Alert.alert("Succès ✅", "Voiture ajoutée avec succès!")
      resetForm()
      navigation.goBack()
    } catch (error) {
      console.error("Erreur complète:", error)
      Alert.alert("Erreur", error.message || "Une erreur est survenue lors de l'ajout.")
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setMarque("")
    setModele("")
    setAnnee("")
    setQuantite("")
    setPrix("")
    setImage(null)
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
       
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.formContainer}>
        <View style={styles.section}>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Marque *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: BMW, Mercedes, Toyota"
              value={marque}
              onChangeText={setMarque}
              editable={!loading}
              placeholderTextColor="#D1D5DB"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Modèle *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Series 3, C-Class"
              value={modele}
              onChangeText={setModele}
              editable={!loading}
              placeholderTextColor="#D1D5DB"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Année *</Text>
            <TextInput
              style={styles.input}
              placeholder="2024"
              value={annee}
              onChangeText={setAnnee}
              keyboardType="numeric"
              editable={!loading}
              placeholderTextColor="#D1D5DB"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détails du stock</Text>

          <View style={styles.rowContainer}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Quantité</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                value={quantite}
                onChangeText={setQuantite}
                keyboardType="numeric"
                editable={!loading}
                placeholderTextColor="#D1D5DB"
              />
            </View>

            <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Prix (DH)</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                value={prix}
                onChangeText={setPrix}
                keyboardType="decimal-pad"
                editable={!loading}
                placeholderTextColor="#D1D5DB"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photo du véhicule</Text>

          {!image ? (
            <TouchableOpacity
              style={[styles.imagePickerButton, loading && styles.buttonDisabled]}
              onPress={pickImage}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Ionicons name="image-outline" size={40} color="#3B82F6" />
              <Text style={styles.imagePickerText}>Choisir une image</Text>
              <Text style={styles.imagePickerSubtext}>(optionnel)</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.imagePreview}>
              <Image source={{ uri: image.uri }} style={styles.previewImage} resizeMode="cover" />
              <View style={styles.imageInfoContainer}>
                <Text style={styles.imageFileName}>{image.fileName || "Image"}</Text>
                <Text style={styles.imageFileSize}>{Math.round(image.fileSize / 1024)} KB</Text>
              </View>
              <TouchableOpacity style={styles.removeImageButton} onPress={() => setImage(null)} activeOpacity={0.7}>
                <Ionicons name="close-circle" size={24} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}

          {imageLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#2563EB" />
              <Text style={styles.loadingText}>Préparation de l'image...</Text>
            </View>
          )}
        </View>

        <View style={styles.buttonsContainer}>

          <TouchableOpacity
            style={[styles.cancelButton, (loading || imageLoading) && styles.buttonDisabled]}
            onPress={() => navigation.goBack()}
            disabled={loading || imageLoading}
            activeOpacity={0.7}
          >
            <View style={{flexDirection:"row",justifyContent:"center",gap:8}}>
            <Ionicons name="close" size={20} color="#374151" />
            <Text style={styles.cancelButtonText}>Annuler</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitButton, (loading || imageLoading) && styles.buttonDisabled]}
            onPress={addVoiture}
            disabled={loading || imageLoading}
            activeOpacity={0.7}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <View style={styles.submitButtonContent}>
                <Ionicons name="add" size={20} color="white" />
                <Text style={styles.submitButtonText}>Ajouter</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },
  formContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  formGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
  },
  rowContainer: {
    flexDirection: "row",
    marginHorizontal: -8,
  },
  imagePickerButton: {
    backgroundColor: "#F0F9FF",
    borderWidth: 2,
    borderColor: "#3B82F6",
    borderRadius: 12,
    borderStyle: "dashed",
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePickerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E40AF",
    marginTop: 12,
  },
  imagePickerSubtext: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },
  imagePreview: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  previewImage: {
    width: "100%",
    height: 200,
  },
  imageInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#F9FAFB",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  imageFileName: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
  },
  imageFileSize: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    padding: 4,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    backgroundColor: "#F0F9FF",
    borderRadius: 12,
    marginTop: 12,
  },
  loadingText: {
    marginLeft: 10,
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "500",
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    color: "#374151",
    fontSize: 15,
    fontWeight: "600",
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#2563EB",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  submitButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
})
