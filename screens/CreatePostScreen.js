"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { Picker } from "@react-native-picker/picker"
import { useData } from "../context/DataContext"
import { useAuth } from "../context/AuthContext"

export default function CreatePostScreen({ navigation }) {
  const [formData, setFormData] = useState({
    description: "",
    location: "",
    postType: "Emergency",
    status: "Pending",
  })
  const [loading, setLoading] = useState(false)
  const { createPost } = useData()
  const { user } = useAuth()

  const handleCreatePost = async () => {
    if (!formData.description || !formData.location) {
      Alert.alert("Error", "Please fill in description and location")
      return
    }

    setLoading(true)
    const result = await createPost({
      ...formData,
      userId: user.id,
      userName: user.fullName,
      userEmail: user.email,
      userPhone: user.phoneNumber,
    })
    setLoading(false)

    if (result.success) {
      Alert.alert("Success", "Post created successfully", [{ text: "OK", onPress: () => navigation.navigate("Feed") }])
      setFormData({
        description: "",
        location: "",
        postType: "Emergency",
        status: "Pending",
      })
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
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create Post</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe the emergency or availability..."
            value={formData.description}
            onChangeText={(value) => updateFormData("description", value)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <Text style={styles.label}>Location *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter location"
            value={formData.location}
            onChangeText={(value) => updateFormData("location", value)}
          />

          <Text style={styles.label}>Post Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.postType}
              onValueChange={(value) => updateFormData("postType", value)}
              style={styles.picker}
            >
              <Picker.Item label="Emergency" value="Emergency" />
              <Picker.Item label="Availability" value="Availability" />
            </Picker>
          </View>

          <Text style={styles.label}>Status</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.status}
              onValueChange={(value) => updateFormData("status", value)}
              style={styles.picker}
            >
              <Picker.Item label="Pending" value="Pending" />
              <Picker.Item label="Fulfilled" value="Fulfilled" />
            </Picker>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleCreatePost} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? "Creating Post..." : "Create Post"}</Text>
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
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#374151",
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
  },
  textArea: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    fontSize: 16,
    minHeight: 100,
  },
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  picker: {
    height: 50,
  },
  button: {
    backgroundColor: "#6366f1",
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
})
