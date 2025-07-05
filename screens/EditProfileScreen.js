"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Dimensions,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"

const { width, height } = Dimensions.get("window")

export default function EditProfileScreen({ navigation }) {
  const { user, updateProfile } = useAuth()
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    phoneNumber: user.phoneNumber,
    email: user.email,
  })
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {
    if (!formData.fullName || !formData.phoneNumber || !formData.email) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    setLoading(true)
    const result = await updateProfile(formData)
    setLoading(false)

    if (result.success) {
      Alert.alert("Success", "Profile updated successfully", [{ text: "OK", onPress: () => navigation.goBack() }])
    } else {
      Alert.alert("Error", result.error)
    }
  }

  const updateFormData = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <StatusBar barStyle="light-content" backgroundColor="#1e293b" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={["#1e293b", "#334155", "#475569"]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerCapsule}>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <Text style={styles.headerSubtitle}>Update your information</Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{formData.fullName.charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={styles.avatarSubtitle}>Profile Picture</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#667eea" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#a0a0a0"
                value={formData.fullName}
                onChangeText={(value) => updateFormData("fullName", value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#667eea" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#a0a0a0"
                value={formData.email}
                onChangeText={(value) => updateFormData("email", value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="#667eea" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="#a0a0a0"
                value={formData.phoneNumber}
                onChangeText={(value) => updateFormData("phoneNumber", value)}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Update Button */}
          <TouchableOpacity 
            style={[styles.updateButton, loading && styles.updateButtonDisabled]}
            onPress={handleUpdate} 
            disabled={loading}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="white" style={styles.buttonIcon} />
            <Text style={styles.updateButtonText}>
              {loading ? "Updating..." : "Update Profile"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerCapsule: {
    backgroundColor: "rgba(255, 255, 255, 0)",
    paddingHorizontal: 20,
    paddingVertical: 1,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    alignItems: "center",
    width: "100%",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  avatarText: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
  },
  avatarSubtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.8)",
  },
  formSection: {
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
    color: "#333",
    paddingVertical: 16,
  },
  updateButton: {
    backgroundColor: "#667eea",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    shadowColor: "#667eea",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  updateButtonDisabled: {
    opacity: 0.7,
  },
  updateButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
  buttonIcon: {
    marginRight: 8,
  },
})
