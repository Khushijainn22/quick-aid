"use client"

import { useEffect, useState } from "react"
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native"
import { useData } from "../context/DataContext"
import { useAuth } from "../context/AuthContext"
import AsyncStorage from "@react-native-async-storage/async-storage"

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
        setUsers(JSON.parse(usersData))
      }
    } catch (error) {
      console.error("Error loading users:", error)
    }
  }

  const filterUserConversations = () => {
    const filtered = conversations.filter((conv) => conv.participants.includes(user.id))
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
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      {userConversations.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No conversations yet</Text>
          <Text style={styles.emptySubtext}>Start messaging by visiting post details</Text>
        </View>
      ) : (
        <FlatList
          data={userConversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  conversationItem: {
    backgroundColor: "white",
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
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
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
  },
})
