"use client"

import { useState, useEffect, useRef } from "react"
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert, StatusBar, Dimensions, KeyboardAvoidingView, Platform } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useData } from "../context/DataContext"
import { useAuth } from "../context/AuthContext"

const { width, height } = Dimensions.get("window")

export default function PostDetailScreen({ route, navigation }) {
  const { post } = route.params
  const [comment, setComment] = useState("")
  const [currentPost, setCurrentPost] = useState(post)
  const { addComment, posts, sendMessage } = useData()
  const { user } = useAuth()
  const scrollViewRef = useRef(null)
  const commentInputRef = useRef(null)

  useEffect(() => {
    // Update post data when posts change
    const updatedPost = posts.find((p) => p.id === post.id)
    if (updatedPost) {
      setCurrentPost(updatedPost)
    }
  }, [posts, post.id])

  const handleAddComment = async () => {
    if (!comment.trim()) {
      Alert.alert("Error", "Please enter a comment")
      return
    }

    const result = await addComment(currentPost.id, {
      text: comment,
      userId: user.id,
      userName: user.fullName,
      timestamp: new Date().toISOString(),
    })

    if (result.success) {
      setComment("")
    } else {
      Alert.alert("Error", result.error)
    }
  }

  const handleSendMessage = async () => {
    if (currentPost.userId === user.id) {
      Alert.alert("Info", "You cannot message yourself")
      return
    }

    const result = await sendMessage(
      currentPost.userId,
      `Hi, I saw your post about: ${currentPost.description.substring(0, 50)}...`,
      user.id,
    )

    if (result.success) {
      Alert.alert("Success", "Message sent successfully", [
        { text: "OK", onPress: () => navigation.navigate("Messages") },
      ])
    } else {
      Alert.alert("Error", result.error)
    }
  }

  const handleCommentFocus = () => {
    // Auto-scroll to the comment input when focused
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    }, 500) // Delay to ensure keyboard is fully open and animation is smooth
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`
    } else {
      return `${Math.floor(diffInHours / 24)} days ago`
    }
  }

  // Modern badge color helpers
  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "Critical": return "#ef4444"
      case "High": return "#f59e0b"
      case "Medium": return "#6366f1"
      case "Low": return "#10b981"
      default: return "#64748b"
    }
  }
  const getPostTypeColor = (postType) => {
    switch (postType) {
      case "Request": return "#ef4444"
      case "Offer": return "#10b981"
      default: return "#6366f1"
    }
  }
  const getPostTypeIcon = (postType) => {
    switch (postType) {
      case "Request": return "help-circle-outline"
      case "Offer": return "heart-outline"
      default: return "document-outline"
    }
  }
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "#f59e0b"
      case "Available": return "#10b981"
      case "Resolved": return "#6366f1"
      default: return "#64748b"
    }
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1e293b" />
      <LinearGradient
        colors={["#1e293b", "#334155", "#475569"]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Header with back button */}
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
          <Text style={styles.headerTitle}>Post Details</Text>
          <Text style={styles.headerSubtitle}>{currentPost.postType}</Text>
        </View>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ref={scrollViewRef}
      >
        {/* Card-style post detail */}
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.avatarBox}>
              <Text style={styles.avatarText}>{currentPost.userName.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.userName}>{currentPost.userName}</Text>
              <Text style={styles.userContact}>{currentPost.userEmail}</Text>
              <Text style={styles.userContact}>{currentPost.userPhone}</Text>
            </View>
            <Text style={styles.timestamp}>{formatTime(currentPost.timestamp)}</Text>
          </View>

          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: getPostTypeColor(currentPost.postType) }]}> 
              <Ionicons name={getPostTypeIcon(currentPost.postType)} size={14} color="white" style={styles.badgeIcon} />
              <Text style={styles.badgeText}>{currentPost.postType}</Text>
            </View>
            {currentPost.postType === "Request" && currentPost.urgencyLevel && (
              <View style={[styles.badge, { backgroundColor: getUrgencyColor(currentPost.urgencyLevel) }]}> 
                <Text style={styles.badgeText}>{currentPost.urgencyLevel}</Text>
              </View>
            )}
            <View style={[styles.badge, { backgroundColor: "#6366f1" }]}> 
              <Text style={styles.badgeText}>{currentPost.resourceType}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: getStatusColor(currentPost.status) }]}> 
              <Text style={styles.badgeText}>{currentPost.status || "Pending"}</Text>
            </View>
          </View>

          <Text style={styles.title}>{currentPost.title}</Text>
          <Text style={styles.description}>{currentPost.description}</Text>

          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={18} color="#667eea" style={{ marginRight: 6 }} />
            <Text style={styles.location}>{currentPost.location}</Text>
          </View>

          {currentPost.additionalInfo ? (
            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={18} color="#6366f1" style={{ marginRight: 6 }} />
              <Text style={styles.infoBoxText}>{currentPost.additionalInfo}</Text>
            </View>
          ) : null}

          <View style={styles.actionRow}>
            {currentPost.userId !== user.id && (
              <TouchableOpacity style={styles.actionButton} onPress={handleSendMessage}>
                <Ionicons name="chatbubble-ellipses-outline" size={18} color="white" style={styles.actionIcon} />
                <Text style={styles.actionButtonText}>
                  {currentPost.postType === "Request" ? "Offer Help" : "Contact"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>Comments ({currentPost.comments?.length || 0})</Text>

          <View style={styles.addCommentRow}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              ref={commentInputRef}
              onFocus={handleCommentFocus}
            />
            <TouchableOpacity style={styles.commentButton} onPress={handleAddComment}>
              <Ionicons name="send" size={18} color="white" />
            </TouchableOpacity>
          </View>

          {currentPost.comments?.map((comment) => (
            <View key={comment.id} style={styles.commentItem}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentAuthor}>{comment.userName}</Text>
                <Text style={styles.commentTime}>{formatTime(comment.timestamp)}</Text>
              </View>
              <Text style={styles.commentText}>{comment.text}</Text>
            </View>
          ))}
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
  scrollContent: {
    padding: 20,
    paddingTop: 20, // Add top padding for custom header
    paddingBottom: 100, // Extra padding for bottom navigation
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarBox: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#667eea",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  avatarText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  headerInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  userContact: {
    fontSize: 13,
    color: "#64748b",
  },
  timestamp: {
    fontSize: 12,
    color: "#94a3b8",
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
    gap: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  badgeIcon: {
    marginRight: 8,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
    marginBottom: 10,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: "#6366f1",
    fontWeight: "600",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  infoBoxText: {
    fontSize: 14,
    color: "#334155",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6366f1",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  actionIcon: {
    marginRight: 8,
  },
  actionButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
  commentsSection: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 14,
  },
  addCommentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 8,
    fontSize: 14,
  },
  commentButton: {
    backgroundColor: "#667eea",
    borderRadius: 16,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  commentItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  commentTime: {
    fontSize: 12,
    color: "#94a3b8",
  },
  commentText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
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
})
