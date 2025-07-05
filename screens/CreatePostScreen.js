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
  Dimensions,
  StatusBar,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useData } from "../context/DataContext"
import { useAuth } from "../context/AuthContext"

const { width, height } = Dimensions.get("window")

export default function CreatePostScreen({ navigation }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    emergencyType: "Medical Emergency",
    urgencyLevel: "High",
    resourceType: "Medical Supplies",
    contactInfo: "",
    additionalInfo: "",
  })
  const [loading, setLoading] = useState(false)
  const [showEmergencyPicker, setShowEmergencyPicker] = useState(false)
  const [showResourcePicker, setShowResourcePicker] = useState(false)
  const { createPost } = useData()
  const { user } = useAuth()

  const handleCreatePost = async () => {
    if (!formData.title || !formData.description || !formData.location) {
      Alert.alert("Error", "Please fill in title, description and location")
      return
    }

    setLoading(true)
    const result = await createPost({
      ...formData,
      userId: user.id,
      userName: user.fullName,
      userEmail: user.email,
      userPhone: user.phoneNumber,
      timestamp: new Date().toISOString(),
    })
    setLoading(false)

    if (result.success) {
      Alert.alert("Success", "Emergency post created successfully", [{ text: "OK", onPress: () => navigation.navigate("Feed") }])
      setFormData({
        title: "",
        description: "",
        location: "",
        emergencyType: "Medical Emergency",
        urgencyLevel: "High",
        resourceType: "Medical Supplies",
        contactInfo: "",
        additionalInfo: "",
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
      <StatusBar barStyle="light-content" backgroundColor="#1e293b" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={["#1e293b", "#334155", "#475569"]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <LinearGradient
          colors={["rgba(30, 41, 59, 0.95)", "rgba(51, 65, 85, 0.95)"]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Create Emergency Post</Text>
            <Text style={styles.headerSubtitle}>Help someone in need</Text>
          </View>
          <View style={styles.placeholder} />
        </LinearGradient>

        <View style={styles.content}>
          {/* Emergency Icon */}
          <View style={styles.emergencyIconContainer}>
            <Ionicons name="warning" size={40} color="#ef4444" />
            <Text style={styles.emergencyText}>Emergency Alert</Text>
          </View>

          {/* Title Field */}
          <View style={styles.inputContainer}>
            <Ionicons name="create-outline" size={20} color="#667eea" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Emergency Title"
              placeholderTextColor="#a0a0a0"
              value={formData.title}
              onChangeText={(value) => updateFormData("title", value)}
            />
          </View>

          {/* Description Field */}
          <View style={styles.inputContainer}>
            <Ionicons name="document-text-outline" size={20} color="#667eea" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe the emergency situation..."
              placeholderTextColor="#a0a0a0"
              value={formData.description}
              onChangeText={(value) => updateFormData("description", value)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Location Field */}
          <View style={styles.inputContainer}>
            <Ionicons name="location-outline" size={20} color="#667eea" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Location/Address"
              placeholderTextColor="#a0a0a0"
              value={formData.location}
              onChangeText={(value) => updateFormData("location", value)}
            />
          </View>

          {/* Emergency Type */}
          <Text style={styles.sectionTitle}>Emergency Type</Text>
          <TouchableOpacity 
            style={styles.pickerContainer}
            onPress={() => setShowEmergencyPicker(!showEmergencyPicker)}
          >
            <Text style={styles.pickerText}>{formData.emergencyType}</Text>
            <Ionicons 
              name={showEmergencyPicker ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#667eea" 
            />
          </TouchableOpacity>

          {/* Urgency Level */}
          <Text style={styles.sectionTitle}>Urgency Level</Text>
          <View style={styles.urgencyContainer}>
            {["Low", "Medium", "High", "Critical"].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.urgencyButton,
                  formData.urgencyLevel === level && styles.urgencyButtonActive
                ]}
                onPress={() => updateFormData("urgencyLevel", level)}
              >
                <Text style={[
                  styles.urgencyText,
                  formData.urgencyLevel === level && styles.urgencyTextActive
                ]}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Resource Type */}
          <Text style={styles.sectionTitle}>Resource Type</Text>
          <TouchableOpacity 
            style={styles.pickerContainer}
            onPress={() => setShowResourcePicker(!showResourcePicker)}
          >
            <Text style={styles.pickerText}>{formData.resourceType}</Text>
            <Ionicons 
              name={showResourcePicker ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#667eea" 
            />
          </TouchableOpacity>

          {/* Contact Information */}
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color="#667eea" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Contact Information (Phone/Email)"
              placeholderTextColor="#a0a0a0"
              value={formData.contactInfo}
              onChangeText={(value) => updateFormData("contactInfo", value)}
            />
          </View>

          {/* Additional Information */}
          <View style={styles.inputContainer}>
            <Ionicons name="information-circle-outline" size={20} color="#667eea" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Additional Information (Optional)"
              placeholderTextColor="#a0a0a0"
              value={formData.additionalInfo}
              onChangeText={(value) => updateFormData("additionalInfo", value)}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Create Post Button */}
          <TouchableOpacity
            style={[styles.createButton, loading && styles.createButtonDisabled]}
            onPress={handleCreatePost}
            disabled={loading}
          >
            <Ionicons name="warning" size={20} color="white" style={styles.buttonIcon} />
            <Text style={styles.createButtonText}>
              {loading ? "Submitting..." : "Submit"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Emergency Type Modal Dropdown */}
      {showEmergencyPicker && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop}
            onPress={() => setShowEmergencyPicker(false)}
            activeOpacity={1}
          />
          <View style={styles.modalDropdown}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Emergency Type</Text>
              <TouchableOpacity onPress={() => setShowEmergencyPicker(false)}>
                <Ionicons name="close" size={24} color="#667eea" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
              {["Medical Emergency", "Accident/Injury", "Blood Donation Needed", "Medicine Required", "Medical Equipment", "Transportation Needed", "Other"].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.modalDropdownItem}
                  onPress={() => {
                    updateFormData("emergencyType", type)
                    setShowEmergencyPicker(false)
                  }}
                >
                  <Text style={[
                    styles.modalDropdownText,
                    formData.emergencyType === type && styles.modalDropdownTextActive
                  ]}>
                    {type}
                  </Text>
                  {formData.emergencyType === type && (
                    <Ionicons name="checkmark" size={20} color="#667eea" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Resource Type Modal Dropdown */}
      {showResourcePicker && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop}
            onPress={() => setShowResourcePicker(false)}
            activeOpacity={1}
          />
          <View style={styles.modalDropdown}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Resource Type</Text>
              <TouchableOpacity onPress={() => setShowResourcePicker(false)}>
                <Ionicons name="close" size={24} color="#667eea" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
              {["Medical Supplies", "Blood Donation", "Medicine", "Medical Equipment", "Transportation", "Financial Help", "Volunteer Help", "Other"].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.modalDropdownItem}
                  onPress={() => {
                    updateFormData("resourceType", type)
                    setShowResourcePicker(false)
                  }}
                >
                  <Text style={[
                    styles.modalDropdownText,
                    formData.resourceType === type && styles.modalDropdownTextActive
                  ]}>
                    {type}
                  </Text>
                  {formData.resourceType === type && (
                    <Ionicons name="checkmark" size={20} color="#667eea" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
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
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: {
    alignItems: "center",
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
  placeholder: {
    width: 40,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  emergencyIconContainer: {
    alignItems: "center",
    marginBottom: 30,
    paddingVertical: 20,
  },
  emergencyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginTop: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
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
    marginTop: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
    color: "#333",
    paddingVertical: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 12,
    marginTop: 8,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  pickerText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#333",
    flex: 1,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalDropdown: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
  },
  modalScrollView: {
    maxHeight: 300,
  },
  modalDropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  modalDropdownText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#333",
  },
  modalDropdownTextActive: {
    color: "#667eea",
    fontWeight: "600",
  },
  urgencyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  urgencyButton: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingVertical: 12,
    marginHorizontal: 4,
    alignItems: "center",
  },
  urgencyButtonActive: {
    backgroundColor: "#667eea",
  },
  urgencyText: {
    fontSize: 14,
    fontWeight: "500",
    color: "white",
  },
  urgencyTextActive: {
    color: "white",
  },
  createButton: {
    backgroundColor: "#ef4444",
    borderRadius: 16,
    marginTop: 30,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#ef4444",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  createButtonDisabled: {
    opacity: 0.7,
  },
  buttonIcon: {
    marginRight: 8,
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
})
