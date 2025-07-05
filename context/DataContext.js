"use client"

import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}

export const DataProvider = ({ children }) => {
  const [posts, setPosts] = useState([])
  const [conversations, setConversations] = useState([])

  useEffect(() => {
    loadPosts()
    loadConversations()
  }, [])

  const loadPosts = async () => {
    try {
      const postsData = await AsyncStorage.getItem("posts")
      if (postsData) {
        setPosts(JSON.parse(postsData))
      }
    } catch (error) {
      console.error("Error loading posts:", error)
    }
  }

  const loadConversations = async () => {
    try {
      const conversationsData = await AsyncStorage.getItem("conversations")
      if (conversationsData) {
        setConversations(JSON.parse(conversationsData))
      }
    } catch (error) {
      console.error("Error loading conversations:", error)
    }
  }

  const createPost = async (postData) => {
    try {
      const newPost = {
        id: Date.now().toString(),
        ...postData,
        timestamp: new Date().toISOString(),
        comments: [],
      }

      const updatedPosts = [newPost, ...posts]
      setPosts(updatedPosts)
      await AsyncStorage.setItem("posts", JSON.stringify(updatedPosts))

      return { success: true }
    } catch (error) {
      return { success: false, error: "Failed to create post" }
    }
  }

  const addComment = async (postId, comment) => {
    try {
      const updatedPosts = posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [
              ...post.comments,
              {
                id: Date.now().toString(),
                ...comment,
                timestamp: new Date().toISOString(),
              },
            ],
          }
        }
        return post
      })

      setPosts(updatedPosts)
      await AsyncStorage.setItem("posts", JSON.stringify(updatedPosts))

      return { success: true }
    } catch (error) {
      return { success: false, error: "Failed to add comment" }
    }
  }

  const sendMessage = async (recipientId, message, currentUserId) => {
    try {
      const conversationId = [currentUserId, recipientId].sort().join("-")

      const newMessage = {
        id: Date.now().toString(),
        senderId: currentUserId,
        message,
        timestamp: new Date().toISOString(),
      }

      const existingConversation = conversations.find((c) => c.id === conversationId)

      let updatedConversations
      if (existingConversation) {
        updatedConversations = conversations.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                messages: [...c.messages, newMessage],
                lastMessage: message,
                lastMessageTime: newMessage.timestamp,
              }
            : c,
        )
      } else {
        const newConversation = {
          id: conversationId,
          participants: [currentUserId, recipientId],
          messages: [newMessage],
          lastMessage: message,
          lastMessageTime: newMessage.timestamp,
        }
        updatedConversations = [...conversations, newConversation]
      }

      setConversations(updatedConversations)
      await AsyncStorage.setItem("conversations", JSON.stringify(updatedConversations))

      return { success: true }
    } catch (error) {
      return { success: false, error: "Failed to send message" }
    }
  }

  const value = {
    posts,
    conversations,
    createPost,
    addComment,
    sendMessage,
    loadPosts,
    loadConversations,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
