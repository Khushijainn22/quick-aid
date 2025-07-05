"use client"
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { useAuth } from "../context/AuthContext"

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: logout, style: "destructive" },
    ])
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.fullName.charAt(0).toUpperCase()}</Text>
        </View>

        <View style={styles.profileInfo}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Full Name</Text>
            <Text style={styles.infoValue}>{user.fullName}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Phone Number</Text>
            <Text style={styles.infoValue}>{user.phoneNumber}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Member Since</Text>
            <Text style={styles.infoValue}>{new Date(user.createdAt).toLocaleDateString()}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate("EditProfile")}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  avatarText: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
  },
  profileInfo: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  infoItem: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: "#1e293b",
  },
  editButton: {
    backgroundColor: "#6366f1",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 16,
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})
