"use client"

import { useEffect, useState } from "react"
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useData } from "../context/DataContext"
import { useAuth } from "../context/AuthContext"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Dummy conversations for testing
const DUMMY_CONVERSATIONS = [
  {
    id: "conv1",
    participants: ["u1", "currentUser"],
    lastMessage: "Hi, I can help with the blood donation. When are you available?",
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    messages: [
      {
        id: "msg1",
        senderId: "u1",
        message: "Hi, I saw your post about blood donation. I'm available to help!",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "msg2",
        senderId: "currentUser",
        message: "Thank you so much! That's really helpful.",
        timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "msg3",
        senderId: "u1",
        message: "Hi, I can help with the blood donation. When are you available?",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "conv2",
    participants: ["u2", "currentUser"],
    lastMessage: "The wheelchair is still available. Would you like to see it?",
    lastMessageTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    messages: [
      {
        id: "msg4",
        senderId: "u2",
        message: "Hello! I have a wheelchair available for rent.",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "msg5",
        senderId: "currentUser",
        message: "That's perfect! How much is the rental fee?",
        timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "msg6",
        senderId: "u2",
        message: "It's $20 per week. Very reasonable!",
        timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "msg7",
        senderId: "currentUser",
        message: "That sounds great. Can I see it first?",
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "msg8",
        senderId: "u2",
        message: "The wheelchair is still available. Would you like to see it?",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "conv3",
    participants: ["u4", "currentUser"],
    lastMessage: "I'm available this weekend for home care assistance.",
    lastMessageTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    messages: [
      {
        id: "msg9",
        senderId: "u4",
        message: "Hi! I'm a registered nurse available for home care.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "msg10",
        senderId: "currentUser",
        message: "That's exactly what we need! What are your rates?",
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "msg11",
        senderId: "u4",
        message: "I charge $25/hour for home care services.",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "msg12",
        senderId: "currentUser",
        message: "Perfect! When are you available?",
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      },
      {
        id: "msg13",
        senderId: "u4",
        message: "I'm available this weekend for home care assistance.",
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
    ],
  },
]

// Dummy users for conversations
const DUMMY_USERS = [
  { id: "u1", fullName: "Alice Smith", email: "alice@email.com" },
  { id: "u2", fullName: "Bob Lee", email: "bob@email.com" },
  { id: "u4", fullName: "David Wilson", email: "david@email.com" },
]

export default function MessagesScreen({ navigation }) {
  const { conversations } = useData()
  const { user } = useAuth()
  const [userConversations, setUserConversations] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    loadUsers()
    filterUserConversations()
  }, [conversations, user])

  const loadUsers = async () => {
    try {
      const usersData = await AsyncStorage.getItem("users")
      if (usersData) {
        const parsedUsers = JSON.parse(usersData)
        setUsers([...parsedUsers, ...DUMMY_USERS])
      } else {
        setUsers(DUMMY_USERS)
      }
    } catch (error) {
      console.error("Error loading users:", error)
      setUsers(DUMMY_USERS)
    }
  }

  const filterUserConversations = () => {
    // Use dummy conversations if no real conversations exist
    const allConversations = conversations.length > 0 ? conversations : DUMMY_CONVERSATIONS
    const filtered = allConversations.filter((conv) => conv.participants.includes(user.id))
    setUserConversations(filtered)
  }

  const getOtherParticipant = (conversation) => {
    const otherUserId = conversation.participants.find((id) => id !== user.id)
    return users.find((u) => u.id === otherUserId)
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`
    }
  }

  const renderConversation = ({ item }) => {
    const otherUser = getOtherParticipant(item)
    if (!otherUser) return null

    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() =>
          navigation.navigate("Conversation", {
            conversation: item,
            otherUser,
          })
        }
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{otherUser.fullName.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={styles.userName}>{otherUser.fullName}</Text>
            <Text style={styles.timestamp}>{formatTime(item.lastMessageTime)}</Text>
          </View>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e293b" />
      <LinearGradient
        colors={["#1e293b", "#334155", "#475569"]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerCapsule}>
          <Text style={styles.headerTitle}>Messages</Text>
          <Text style={styles.headerSubtitle}>Your conversations</Text>
        </View>
      </View>

      {userConversations.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="chatbubbles-outline" size={64} color="#94a3b8" />
          <Text style={styles.emptyText}>No conversations yet</Text>
          <Text style={styles.emptySubtext}>Start messaging by visiting post details</Text>
        </View>
      ) : (
        <FlatList
          data={userConversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#fafafa",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#fafafa",
    marginTop: 4,
    textAlign: "center",
  },
  listContainer: {
    paddingVertical: 8,
  },
  conversationItem: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#667eea",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  timestamp: {
    fontSize: 12,
    color: "#64748b",
  },
  lastMessage: {
    fontSize: 14,
    color: "#64748b",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#64748b",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 20,
  },
})
