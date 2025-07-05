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
    postType: "Request", // "Request" or "Offer"
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
      Alert.alert("Success", "Healthcare post created successfully", [{ text: "OK", onPress: () => navigation.navigate("Feed") }])
      setFormData({
        postType: "Request",
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
        <View style={styles.header}>
          <View style={styles.headerCapsule}>
            <Text style={styles.headerTitle}>Create Post</Text>
            <Text style={styles.headerSubtitle}>Share your request or offer</Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Post Type Selector */}
          <View style={styles.postTypeContainer}>
            <Text style={styles.sectionTitle}>Post Type</Text>
            <View style={styles.postTypeButtons}>
              <TouchableOpacity
                style={[
                  styles.postTypeButton,
                  formData.postType === "Request" && styles.postTypeButtonActive
                ]}
                onPress={() => updateFormData("postType", "Request")}
              >
                <Ionicons 
                  name="help-circle-outline" 
                  size={20} 
                  color={formData.postType === "Request" ? "white" : "#667eea"} 
                />
                <Text style={[
                  styles.postTypeText,
                  formData.postType === "Request" && styles.postTypeTextActive
                ]}>
                  Request Help
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.postTypeButton,
                  formData.postType === "Offer" && styles.postTypeButtonActive
                ]}
                onPress={() => updateFormData("postType", "Offer")}
              >
                <Ionicons 
                  name="heart-outline" 
                  size={20} 
                  color={formData.postType === "Offer" ? "white" : "#10b981"} 
                />
                <Text style={[
                  styles.postTypeText,
                  formData.postType === "Offer" && styles.postTypeTextActive
                ]}>
                  Offer Help
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Title Field */}
          <View style={styles.inputContainer}>
            <Ionicons name="create-outline" size={20} color="#667eea" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={formData.postType === "Request" ? "What do you need?" : "What can you offer?"}
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
              placeholder={formData.postType === "Request" ? "Describe what you need..." : "Describe what you can provide..."}
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

          {/* Emergency Type - Only show for requests */}
          {formData.postType === "Request" && (
            <>
              <Text style={styles.sectionTitle}>Need Type</Text>
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
            </>
          )}

          {/* Urgency Level - Only show for requests */}
          {formData.postType === "Request" && (
            <>
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
            </>
          )}

          {/* Resource Type */}
          <Text style={styles.sectionTitle}>
            {formData.postType === "Request" ? "Resource Type" : "What You're Offering"}
          </Text>
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
            <Ionicons 
              name={formData.postType === "Request" ? "help-circle" : "heart"} 
              size={20} 
              color="white" 
              style={styles.buttonIcon} 
            />
            <Text style={styles.createButtonText}>
              {loading ? "Submitting..." : formData.postType === "Request" ? "Submit Request" : "Submit Offer"}
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
              <Text style={styles.modalTitle}>Select Need Type</Text>
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
              <Text style={styles.modalTitle}>
                {formData.postType === "Request" ? "Select Resource Type" : "Select What You're Offering"}
              </Text>
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
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  postTypeContainer: {
    marginBottom: 30,
  },
  postTypeButtons: {
    flexDirection: "row",
    gap: 12,
  },
  postTypeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  postTypeButtonActive: {
    backgroundColor: "#667eea",
  },
  postTypeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  postTypeTextActive: {
    color: "white",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1e293b",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 8,
    marginTop: 8,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pickerText: {
    fontSize: 16,
    color: "#1e293b",
    flex: 1,
  },
  urgencyContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  urgencyButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  urgencyButtonActive: {
    backgroundColor: "#ef4444",
  },
  urgencyText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  urgencyTextActive: {
    color: "white",
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#667eea",
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 20,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  createButtonDisabled: {
    backgroundColor: "#94a3b8",
  },
  buttonIcon: {
    marginRight: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
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
    flex: 1,
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
    maxHeight: height * 0.6,
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
    fontWeight: "bold",
    color: "#1e293b",
  },
  modalScrollView: {
    maxHeight: height * 0.5,
  },
  modalDropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  modalDropdownText: {
    fontSize: 16,
    color: "#1e293b",
  },
  modalDropdownTextActive: {
    color: "#667eea",
    fontWeight: "600",
  },
})
