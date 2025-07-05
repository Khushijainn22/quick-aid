"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { useData } from "../context/DataContext"
import { useAuth } from "../context/AuthContext"

export default function ConversationScreen({ route }) {
  const { conversation, otherUser } = route.params
  const [message, setMessage] = useState("")
  const [currentConversation, setCurrentConversation] = useState(conversation)
  const { sendMessage, conversations } = useData()
  const { user } = useAuth()

  useEffect(() => {
    // Update conversation when conversations change
    const updatedConversation = conversations.find((c) => c.id === conversation.id)
    if (updatedConversation) {
      setCurrentConversation(updatedConversation)
    }
  }, [conversations, conversation.id])

  const handleSendMessage = async () => {
    if (!message.trim()) return

    const result = await sendMessage(otherUser.id, message, user.id)
    if (result.success) {
      setMessage("")
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const renderMessage = ({ item }) => {
    const isMyMessage = item.senderId === user.id

    return (
      <View style={[styles.messageContainer, isMyMessage ? styles.myMessage : styles.otherMessage]}>
        <Text style={[styles.messageText, isMyMessage ? styles.myMessageText : styles.otherMessageText]}>
          {item.message}
        </Text>
        <Text style={[styles.messageTime, isMyMessage ? styles.myMessageTime : styles.otherMessageTime]}>
          {formatTime(item.timestamp)}
        </Text>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{otherUser.fullName.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.headerTitle}>{otherUser.fullName}</Text>
      </View>

      <FlatList
        data={currentConversation.messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={500}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage} disabled={!message.trim()}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: "80%",
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#6366f1",
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "white",
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: "white",
  },
  otherMessageText: {
    color: "#1e293b",
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
  },
  myMessageTime: {
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "right",
  },
  otherMessageTime: {
    color: "#94a3b8",
  },
  inputContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    padding: 16,
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  messageInput: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#6366f1",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sendButtonText: {
    color: "white",
    fontWeight: "600",
  },
})
