"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert, Clipboard } from "react-native"
import { useData } from "../context/DataContext"
import { useAuth } from "../context/AuthContext"

export default function PostDetailScreen({ route, navigation }) {
  const { post } = route.params
  const [comment, setComment] = useState("")
  const [currentPost, setCurrentPost] = useState(post)
  const { addComment, posts, sendMessage } = useData()
  const { user } = useAuth()

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
    })

    if (result.success) {
      setComment("")
    } else {
      Alert.alert("Error", result.error)
    }
  }

  const handleCopyLink = () => {
    const link = `healthcare://post/${currentPost.id}`
    Clipboard.setString(link)
    Alert.alert("Success", "Post link copied to clipboard")
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

  const getStatusColor = (status) => {
    return status === "Pending" ? "#f59e0b" : "#10b981"
  }

  const getTypeColor = (type) => {
    return type === "Emergency" ? "#ef4444" : "#6366f1"
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{currentPost.userName.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{currentPost.userName}</Text>
            <Text style={styles.userContact}>{currentPost.userEmail}</Text>
            <Text style={styles.userContact}>{currentPost.userPhone}</Text>
          </View>
        </View>
        <Text style={styles.timestamp}>{formatTime(currentPost.timestamp)}</Text>
      </View>

      <View style={styles.postContent}>
        <View style={styles.badges}>
          <View style={[styles.badge, { backgroundColor: getTypeColor(currentPost.postType) }]}>
            <Text style={styles.badgeText}>{currentPost.postType}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: getStatusColor(currentPost.status) }]}>
            <Text style={styles.badgeText}>{currentPost.status}</Text>
          </View>
        </View>

        <Text style={styles.description}>{currentPost.description}</Text>

        <View style={styles.locationContainer}>
          <Text style={styles.locationLabel}>Location:</Text>
          <Text style={styles.location}>{currentPost.location}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleCopyLink}>
          <Text style={styles.actionButtonText}>Copy Link</Text>
        </TouchableOpacity>

        {currentPost.userId !== user.id && (
          <TouchableOpacity style={[styles.actionButton, styles.messageButton]} onPress={handleSendMessage}>
            <Text style={styles.actionButtonText}>Send Message</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.commentsSection}>
        <Text style={styles.commentsTitle}>Comments ({currentPost.comments?.length || 0})</Text>

        <View style={styles.addCommentContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            value={comment}
            onChangeText={setComment}
            multiline
          />
          <TouchableOpacity style={styles.commentButton} onPress={handleAddComment}>
            <Text style={styles.commentButtonText}>Post</Text>
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  postHeader: {
    backgroundColor: "white",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  userContact: {
    fontSize: 14,
    color: "#64748b",
  },
  timestamp: {
    fontSize: 12,
    color: "#94a3b8",
  },
  postContent: {
    backgroundColor: "white",
    padding: 16,
    marginBottom: 8,
  },
  badges: {
    flexDirection: "row",
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  description: {
    fontSize: 16,
    color: "#1e293b",
    lineHeight: 24,
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
    marginRight: 8,
  },
  location: {
    fontSize: 14,
    color: "#1e293b",
  },
  actions: {
    backgroundColor: "white",
    flexDirection: "row",
    padding: 16,
    marginBottom: 8,
  },
  actionButton: {
    backgroundColor: "#f1f5f9",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginRight: 12,
  },
  messageButton: {
    backgroundColor: "#6366f1",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  commentsSection: {
    backgroundColor: "white",
    padding: 16,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 16,
  },
  addCommentContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    maxHeight: 80,
  },
  commentButton: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: "center",
  },
  commentButtonText: {
    color: "white",
    fontWeight: "600",
  },
  commentItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
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
})
