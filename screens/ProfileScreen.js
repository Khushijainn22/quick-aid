"use client"
import { View, Text, TouchableOpacity, StyleSheet, Alert, StatusBar, Dimensions, ScrollView, FlatList } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"
import { useData } from "../context/DataContext"
import PostCard from "../components/PostCard"

const { width, height } = Dimensions.get("window")

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth()
  const { getUserPosts, deletePost } = useData()
  
  // Get user's posts
  const userPosts = getUserPosts(user.id)
  
  // Add a dummy post for demonstration if user has no posts
  const displayPosts = userPosts.length > 0 ? userPosts : [
    {
      id: "dummy1",
      userId: user.id,
      userName: user.fullName,
      userEmail: user.email,
      userPhone: user.phoneNumber,
      createdAt: new Date().toISOString(),
      postType: "Request",
      title: "Need Medical Supplies Urgently",
      description: "Looking for insulin and diabetes testing strips. Running low on supplies and need help from the community.",
      location: "Downtown Medical Center",
      emergencyType: "Medicine Required",
      urgencyLevel: "High",
      resourceType: "Medicine",
      contactInfo: user.phoneNumber,
      additionalInfo: "Type 1 diabetic, any help appreciated.",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      status: "Pending",
      comments: [
        { id: "c1", userName: "John Doe", text: "I can help with testing strips!", timestamp: new Date().toISOString() },
      ],
    }
  ]

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: logout, style: "destructive" },
    ])
  }

  const handleDeletePost = (post) => {
    Alert.alert(
      "Delete Post",
      `Are you sure you want to delete "${post.title}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          onPress: async () => {
            const result = await deletePost(post.id, user.id)
            if (result.success) {
              Alert.alert("Success", "Post deleted successfully")
            } else {
              Alert.alert("Error", result.error)
            }
          }, 
          style: "destructive" 
        },
      ]
    )
  }

  const renderUserPost = ({ item }) => (
    <View style={styles.postContainer}>
      <PostCard post={item} onPress={() => navigation.navigate("PostDetail", { post: item })} />
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => handleDeletePost(item)}
      >
        <Ionicons name="trash-outline" size={20} color="#ef4444" />
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e293b" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={["#1e293b", "#334155", "#475569"]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerCapsule}>
          <Text style={styles.headerTitle}>My Profile</Text>
          <Text style={styles.headerSubtitle}>Manage your account</Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.fullName.charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={styles.userName}>{user.fullName}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>

          {/* Profile Info Cards */}
          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <Ionicons name="person-outline" size={20} color="#667eea" />
                <Text style={styles.infoCardTitle}>Personal Information</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Full Name</Text>
                <Text style={styles.infoValue}>{user.fullName}</Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Phone Number</Text>
                <Text style={styles.infoValue}>{user.phoneNumber}</Text>
              </View>

              {/* <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Member Since</Text>
                <Text style={styles.infoValue}>{new Date(user.createdAt).toLocaleDateString()}</Text>
              </View> */}
            </View>
          </View>

          {/* User Posts Section */}
          <View style={styles.postsSection}>
            <View style={styles.postsHeader}>
              <View style={styles.postsHeaderLeft}>
                <Ionicons name="document-text-outline" size={20} color="#667eea" />
                <Text style={styles.postsSectionTitle}>My Posts ({displayPosts.length})</Text>
              </View>
              <TouchableOpacity 
                style={styles.createPostHeaderButton}
                onPress={() => navigation.navigate("Create")}
              >
                <Ionicons name="add-outline" size={16} color="#667eea" />
                <Text style={styles.createPostHeaderText}>New Post</Text>
              </TouchableOpacity>
            </View>
            
            {/* Disclaimer */}
            <View style={styles.disclaimerCard}>
              <Ionicons name="information-circle-outline" size={18} color="#f59e0b" />
              <Text style={styles.disclaimerText}>
                Posts are automatically deleted after 2 weeks to keep the feed current and relevant.
              </Text>
            </View>

            {displayPosts.length > 0 ? (
              <FlatList
                data={displayPosts}
                renderItem={renderUserPost}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.postsList}
              />
            ) : (
              <View style={styles.emptyPostsContainer}>
                <Ionicons name="document-outline" size={48} color="#64748b" />
                <Text style={styles.emptyPostsText}>No posts yet</Text>
                {/* <Text style={styles.emptyPostsSubtext}>Create your first post to get started</Text> */}
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={() => navigation.navigate("EditProfile")}
            >
              <LinearGradient
                colors={["#667eea", "#764ba2"]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="create-outline" size={20} color="white" style={styles.buttonIcon} />
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <LinearGradient
                colors={["#ef4444", "#dc2626"]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="log-out-outline" size={20} color="white" style={styles.buttonIcon} />
                <Text style={styles.logoutButtonText}>Logout</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  avatarText: {
    color: "white",
    fontSize: 48,
    fontWeight: "bold",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.8)",
  },
  infoSection: {
    marginBottom: 30,
  },
  infoCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginLeft: 8,
  },
  infoItem: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
  },
  postsSection: {
    marginBottom: 30,
  },
  postsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  postsHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  postsSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginLeft: 8,
  },
  createPostHeaderButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  createPostHeaderText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#667eea",
    marginLeft: 4,
  },
  disclaimerCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  disclaimerText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
    marginLeft: 8,
    flex: 1,
  },
  postsList: {
    paddingVertical: 8,
  },
  postContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: "#fef2f2",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ef4444",
    marginLeft: 6,
  },
  emptyPostsContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyPostsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyPostsSubtext: {
    fontSize: 14,
    fontWeight: "400",
    color: "#64748b",
    marginBottom: 24,
    textAlign: "center",
  },
  buttonIcon: {
    marginRight: 8,
  },
  actionSection: {
    gap: 12,
    marginBottom: 32,
  },
  editButton: {
    borderRadius: 25,
    shadowColor: "#667eea",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  editButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
  logoutButton: {
    borderRadius: 25,
    shadowColor: "#ef4444",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
})

