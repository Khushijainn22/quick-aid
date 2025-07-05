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
} from "react-native"
import { useAuth } from "../context/AuthContext"

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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{formData.fullName.charAt(0).toUpperCase()}</Text>
          </View>

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={formData.fullName}
            onChangeText={(value) => updateFormData("fullName", value)}
            placeholder="Enter full name"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(value) => updateFormData("email", value)}
            placeholder="Enter email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={formData.phoneNumber}
            onChangeText={(value) => updateFormData("phoneNumber", value)}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />

          <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? "Updating..." : "Update Profile"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    flexGrow: 1,
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
    marginBottom: 32,
  },
  avatarText: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#374151",
    alignSelf: "flex-start",
    width: "100%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    fontSize: 16,
    width: "100%",
  },
  button: {
    backgroundColor: "#6366f1",
    paddingVertical: 16,
    borderRadius: 8,
    width: "100%",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
})
