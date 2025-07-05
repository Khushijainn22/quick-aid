"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useData } from "../context/DataContext"
import { useAuth } from "../context/AuthContext"

export default function ConversationScreen({ route, navigation }) {
  const { conversation, otherUser } = route.params
  const [message, setMessage] = useState("")
  const [currentConversation, setCurrentConversation] = useState(conversation)
  const { sendMessage, conversations } = useData()
  const { user } = useAuth()
  const flatListRef = useRef(null)

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
      // Auto-scroll to bottom after sending message
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true })
      }, 100)
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
        {!isMyMessage && (
          <View style={styles.otherUserAvatar}>
            <Text style={styles.otherUserAvatarText}>{otherUser.fullName.charAt(0).toUpperCase()}</Text>
          </View>
        )}
        <View style={[styles.messageBubble, isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble]}>
          <Text style={[styles.messageText, isMyMessage ? styles.myMessageText : styles.otherMessageText]}>
            {item.message}
          </Text>
          <Text style={[styles.messageTime, isMyMessage ? styles.myMessageTime : styles.otherMessageTime]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </View>
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
          <Text style={styles.headerTitle}>Chat</Text>
          <Text style={styles.headerSubtitle}>Message conversation</Text>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.chatContainer} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <FlatList
          ref={flatListRef}
          data={currentConversation.messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.messageInput}
              placeholder="Type a message..."
              placeholderTextColor="#94a3b8"
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
              textAlignVertical="top"
            />
            <TouchableOpacity 
              style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]} 
              onPress={handleSendMessage} 
              disabled={!message.trim()}
            >
              <Ionicons name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  myMessage: {
    justifyContent: "flex-end",
  },
  otherMessage: {
    justifyContent: "flex-start",
  },
  otherUserAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#667eea",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  otherUserAvatarText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  messageBubble: {
    maxWidth: "75%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  myMessageBubble: {
    backgroundColor: "#667eea",
    borderBottomRightRadius: 6,
  },
  otherMessageBubble: {
    backgroundColor: "white",
    borderBottomLeftRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 4,
  },
  myMessageText: {
    color: "white",
  },
  otherMessageText: {
    color: "#1e293b",
  },
  messageTime: {
    fontSize: 11,
  },
  myMessageTime: {
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "right",
  },
  otherMessageTime: {
    color: "#94a3b8",
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#f8fafc",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    color: "#1e293b",
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: "#667eea",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: "#94a3b8",
  },
})
