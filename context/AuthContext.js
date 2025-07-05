"use client"

import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("user")
      if (userData) {
        setUser(JSON.parse(userData))
      }
    } catch (error) {
      console.error("Error loading user:", error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      // Simulate API call
      const users = await AsyncStorage.getItem("users")
      const userList = users ? JSON.parse(users) : []

      const foundUser = userList.find((u) => u.email === email && u.password === password)

      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser
        await AsyncStorage.setItem("user", JSON.stringify(userWithoutPassword))
        setUser(userWithoutPassword)
        return { success: true }
      } else {
        return { success: false, error: "Invalid credentials" }
      }
    } catch (error) {
      return { success: false, error: "Login failed" }
    }
  }

  const signUp = async (userData) => {
    try {
      const users = await AsyncStorage.getItem("users")
      const userList = users ? JSON.parse(users) : []

      // Check if user already exists
      const existingUser = userList.find((u) => u.email === userData.email)
      if (existingUser) {
        return { success: false, error: "User already exists" }
      }

      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString(),
      }

      userList.push(newUser)
      await AsyncStorage.setItem("users", JSON.stringify(userList))

      const { password, ...userWithoutPassword } = newUser
      await AsyncStorage.setItem("user", JSON.stringify(userWithoutPassword))
      setUser(userWithoutPassword)

      return { success: true }
    } catch (error) {
      return { success: false, error: "Sign up failed" }
    }
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user")
      setUser(null)
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const updateProfile = async (updatedData) => {
    try {
      const updatedUser = { ...user, ...updatedData }
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)

      // Update in users list
      const users = await AsyncStorage.getItem("users")
      const userList = users ? JSON.parse(users) : []
      const userIndex = userList.findIndex((u) => u.id === user.id)
      if (userIndex !== -1) {
        userList[userIndex] = { ...userList[userIndex], ...updatedData }
        await AsyncStorage.setItem("users", JSON.stringify(userList))
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: "Update failed" }
    }
  }

  const value = {
    user,
    loading,
    login,
    signUp,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
