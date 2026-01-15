"use client"

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native"
import { supabase } from "../lib/supabase"
import { useState } from "react"
import { Ionicons } from "@expo/vector-icons"

const COLORS = {
  primary: "#0F4C75", 
  accent: "#3282B8", 
  secondary: "#00D4FF", 
  background: "#F8F9FA",
  surface: "#FFFFFF",
  error: "#E74C3C",
  text: "#2C3E50",
  textLight: "#7F8C8D",
  success: "#27AE60",
}

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  async function login() {
    if (!email || !password) {
      setErrorMessage("Veuillez remplir tous les champs")
      return
    }

    setLoading(true)
    setErrorMessage("")

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (!error) {
      navigation.replace("Gestion de Location de voitures")
    } else {
      setErrorMessage(error.message || "Erreur de connexion")
    }
    setLoading(false)
  }

  return (
    <KeyboardAvoidingView  style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="car" size={48} color={COLORS.secondary} />
          </View>
          <Text style={styles.brandName}>DriveRent</Text>
          <Text style={styles.brandSubtitle}>Gestion de Location de Voitures</Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail" size={20} color={COLORS.accent} style={styles.inputIcon} />
              <TextInput
                placeholder="Email"
                placeholderTextColor={COLORS.textLight}
                onChangeText={setEmail}
                value={email}
                editable={!loading}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mot de passe</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={20} color={COLORS.accent} style={styles.inputIcon} />
              <TextInput
                placeholder="••••••••"
                placeholderTextColor={COLORS.textLight}
                onChangeText={setPassword}
                value={password}
                editable={!loading}
                secureTextEntry={!showPassword}
                style={[styles.input, styles.passwordInput]}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                disabled={!password}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={showPassword ? "eye" : "eye-off"}
                  size={20}
                  color={password ? COLORS.accent : COLORS.textLight}
                />
              </TouchableOpacity>
            </View>
          </View>

          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={18} color={COLORS.error} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

      

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={login}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.surface} size="small" />
            ) : (
              <Text style={styles.loginButtonText}>Se Connecter</Text>
            )}
          </TouchableOpacity>

        </View>

        <View style={styles.footerSection}>
          <Text style={styles.footerText}></Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 48,
    marginTop: 20,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  brandName: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 8,
  },
  brandSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: "500",
  },
  formSection: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
    paddingHorizontal: 12,
    height: 56,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "500",
  },
  passwordInput: {
    paddingRight: 0,
  },
  eyeButton: {
    padding: 8,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FADBD8",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  errorText: {
    marginLeft: 8,
    color: COLORS.error,
    fontSize: 13,
    fontWeight: "500",
  },
  forgotPassword: {
    fontSize: 13,
    color: COLORS.secondary,
    fontWeight: "600",
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.surface,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  signupLink: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: "700",
  },
  footerSection: {
    alignItems: "center",
    marginTop: 32,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  securityBadges: {
    flexDirection: "row",
    alignItems: "center",
  },
  securityText: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: "600",
    marginLeft: 6,
  },
})
