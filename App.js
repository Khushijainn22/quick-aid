"use client"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { Ionicons } from "@expo/vector-icons"

// Import screens
import LoginScreen from "./screens/LoginScreen"
import SignUpScreen from "./screens/SignUpScreen"
import FeedScreen from "./screens/FeedScreen"
import CreatePostScreen from "./screens/CreatePostScreen"
import SearchScreen from "./screens/SearchScreen"
import MessagesScreen from "./screens/MessagesScreen"
import ProfileScreen from "./screens/ProfileScreen"
import PostDetailScreen from "./screens/PostDetailScreen"
import EditProfileScreen from "./screens/EditProfileScreen"
import ConversationScreen from "./screens/ConversationScreen"

// Context
import { AuthProvider, useAuth } from "./context/AuthContext"
import { DataProvider } from "./context/DataContext"

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  )
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName
          if (route.name === "Feed") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "Create") {
            iconName = focused ? "add-circle" : "add-circle-outline"
          } else if (route.name === "Search") {
            iconName = focused ? "search" : "search-outline"
          } else if (route.name === "Messages") {
            iconName = focused ? "chatbubbles" : "chatbubbles-outline"
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline"
          }
          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: "#6366f1",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Create" component={CreatePostScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} options={{ title: "Post Details" }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: "Edit Profile" }} />
      <Stack.Screen name="Conversation" component={ConversationScreen} options={{ title: "Messages" }} />
    </Stack.Navigator>
  )
}

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return null // You could add a loading screen here
  }

  return <NavigationContainer>{user ? <AppStack /> : <AuthStack />}</NavigationContainer>
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  )
}
