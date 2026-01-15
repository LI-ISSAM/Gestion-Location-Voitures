"use client"

import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native"
import { supabase } from "../lib/supabase"
import { useEffect, useState } from "react"
import { MaterialCommunityIcons } from "@expo/vector-icons"

const { width } = Dimensions.get("window")
const cardWidth = (width - 32) / 2

export default function DashboardScreen() {
  const [stats, setStats] = useState({
    clients: 0,
    voitures: 0,
    locations: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const { count: clients } = await supabase.from("clients").select("*", { count: "exact", head: true })

        const { count: voitures } = await supabase.from("voitures").select("*", { count: "exact", head: true })

        const { count: locations } = await supabase.from("locations").select("*", { count: "exact", head: true })

        setStats({ clients: clients || 0, voitures: voitures || 0, locations: locations || 0 })
      } catch (error) {
        console.error("Error loading stats:", error)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  const StatCard = ({ icon, label, value, color }) => (
    <View style={[styles.card, { backgroundColor: color }]}>
      <View style={styles.cardIconContainer}>
        <MaterialCommunityIcons name={icon} size={32} color="#ffffff" />
      </View>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  )

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bienvenue</Text>
        </View>
        <MaterialCommunityIcons name="car" size={40} color="#0F3A5E" />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <StatCard icon="account-group" label="Clients" value={stats.clients.toString()} color="#0F3A5E" />
          <View style={{ marginLeft: 12 }}>
            <StatCard icon="car-multiple" label="Voitures" value={stats.voitures.toString()} color="#00A8CC" />
          </View>
        </View>

        <View style={styles.fullWidthCard}>
          <StatCard icon="calendar-check" label="Locations" value={stats.locations.toString()} color="#00D9FF" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions rapides</Text>
        <View style={styles.actionsContainer}>
          <View style={styles.actionItem}>
            <MaterialCommunityIcons name="plus-circle" size={24} color="#00A8CC" />
            <Text style={styles.actionText}>Nouveau client</Text>
          </View>
          <View style={styles.actionItem}>
            <MaterialCommunityIcons name="car-plus" size={24} color="#00A8CC" />
            <Text style={styles.actionText}>Ajouter voiture</Text>
          </View>
          <View style={styles.actionItem}>
            <MaterialCommunityIcons name="bookmark-plus" size={24} color="#00A8CC" />
            <Text style={styles.actionText}>Nouvelle location</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activité récente</Text>
        <View style={styles.activityItem}>
          <View style={styles.activityDot} />
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Nouvelle location enregistrée</Text>
            <Text style={styles.activityTime}>Il y a 2 heures</Text>
          </View>
        </View>
        <View style={styles.activityItem}>
          <View style={styles.activityDot} />
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Client inscrit</Text>
            <Text style={styles.activityTime}>Il y a 4 heures</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0F3A5E",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
  },
  statsContainer: {
    marginBottom: 32,
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  fullWidthCard: {
    width: "100%",
  },
  card: {
    width: cardWidth,
    borderRadius: 16,
    padding: 16,
    justifyContent: "space-between",
    minHeight: 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardIconContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 12,
    color: "#ffffff",
    opacity: 0.9,
    marginBottom: 8,
    fontWeight: "500",
  },
  cardValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#ffffff",
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F3A5E",
    marginBottom: 16,
  },
  actionsContainer: {
    gap: 12,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F3A5E",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00A8CC",
    marginRight: 12,
    marginTop: 6,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F3A5E",
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: "#94A3B8",
  },
})
