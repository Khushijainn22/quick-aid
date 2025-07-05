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

export default function SignUpScreen({ navigation }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()

  const handleSignUp = async () => {
    const { fullName, email, phoneNumber, password, confirmPassword } = formData

    if (!fullName || !email || !phoneNumber || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match")
      return
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters")
      return
    }

    setLoading(true)
    const result = await signUp({
      fullName,
      email,
      phoneNumber,
      password,
    })
    setLoading(false)

    if (!result.success) {
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join our healthcare community</Text>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={formData.fullName}
            onChangeText={(value) => updateFormData("fullName", value)}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData.email}
            onChangeText={(value) => updateFormData("email", value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChangeText={(value) => updateFormData("phoneNumber", value)}
            keyboardType="phone-pad"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={formData.password}
            onChangeText={(value) => updateFormData("password", value)}
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(value) => updateFormData("confirmPassword", value)}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? "Creating Account..." : "Sign Up"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate("Login")}>
            <Text style={styles.linkText}>Already have an account? Sign In</Text>
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
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#1e293b",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    color: "#64748b",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#6366f1",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  linkButton: {
    paddingVertical: 8,
  },
  linkText: {
    color: "#6366f1",
    textAlign: "center",
    fontSize: 14,
  },
})
