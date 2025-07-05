"use client"

import React from "react"
import { View, Text, FlatList, StyleSheet, RefreshControl, StatusBar, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useData } from "../context/DataContext"
import PostCard from "../components/PostCard"

const { width, height } = Dimensions.get("window")

const DUMMY_POSTS = [
  {
    id: "1",
    userId: "u1",
    userName: "Alice Smith",
    userEmail: "alice@email.com",
    userPhone: "123-456-7890",
    createdAt: new Date().toISOString(),
    postType: "Request",
    title: "Need O+ Blood Urgently",
    description: "My father needs O+ blood for surgery at City Hospital. Please help if you can donate!",
    location: "City Hospital, Main St",
    emergencyType: "Blood Donation Needed",
    urgencyLevel: "Critical",
    resourceType: "Blood Donation",
    contactInfo: "123-456-7890",
    additionalInfo: "Any healthy donor welcome.",
    timestamp: new Date().toISOString(),
    status: "Pending",
    comments: [
      { id: "c1", userName: "John Doe", text: "Shared with my group!", timestamp: new Date().toISOString() },
    ],
  },
  {
    id: "2",
    userId: "u2",
    userName: "Bob Lee",
    userEmail: "bob@email.com",
    userPhone: "555-123-4567",
    createdAt: new Date().toISOString(),
    postType: "Offer",
    title: "Available: Wheelchair for Rent",
    description: "I have a wheelchair available for rent or temporary use. Perfect for elderly patients or post-surgery recovery.",
    location: "Green Park Area",
    emergencyType: "Medical Equipment",
    urgencyLevel: "Low",
    resourceType: "Medical Equipment",
    contactInfo: "555-123-4567",
    additionalInfo: "Clean, well-maintained. Flexible rental terms.",
    timestamp: new Date().toISOString(),
    status: "Available",
    comments: [],
  },
  {
    id: "3",
    userId: "u3",
    userName: "Carol Jones",
    userEmail: "carol@email.com",
    userPhone: "987-654-3210",
    createdAt: new Date().toISOString(),
    postType: "Request",
    title: "Ambulance Needed for Accident",
    description: "There has been a road accident at 5th Avenue. Need ambulance and first aid urgently!",
    location: "5th Avenue, Downtown",
    emergencyType: "Accident/Injury",
    urgencyLevel: "Critical",
    resourceType: "Transportation",
    contactInfo: "987-654-3210",
    additionalInfo: "Multiple injured.",
    timestamp: new Date().toISOString(),
    status: "Pending",
    comments: [],
  },
  {
    id: "4",
    userId: "u4",
    userName: "David Wilson",
    userEmail: "david@email.com",
    userPhone: "444-555-6666",
    createdAt: new Date().toISOString(),
    postType: "Offer",
    title: "Volunteer Nurse Available",
    description: "Registered nurse with 10 years experience available for home care, elderly assistance, or emergency support.",
    location: "Downtown Area",
    emergencyType: "Medical Emergency",
    urgencyLevel: "Low",
    resourceType: "Volunteer Help",
    contactInfo: "444-555-6666",
    additionalInfo: "Available evenings and weekends. Specialized in geriatric care.",
    timestamp: new Date().toISOString(),
    status: "Available",
    comments: [
      { id: "c2", userName: "Alice Smith", text: "Thank you for offering help!", timestamp: new Date().toISOString() },
    ],
  },
  {
    id: "5",
    userId: "u5",
    userName: "Emma Davis",
    userEmail: "emma@email.com",
    userPhone: "777-888-9999",
    createdAt: new Date().toISOString(),
    postType: "Request",
    title: "Need Insulin Medication",
    description: "Urgently need insulin medication. Can anyone help with spare vials or know where to get it quickly?",
    location: "Westside Medical Center",
    emergencyType: "Medicine Required",
    urgencyLevel: "High",
    resourceType: "Medicine",
    contactInfo: "777-888-9999",
    additionalInfo: "Type 1 diabetic, running low on supplies.",
    timestamp: new Date().toISOString(),
    status: "Pending",
    comments: [],
  },
]

export default function FeedScreen({ navigation }) {
  const { posts, loadPosts } = useData()
  const [refreshing, setRefreshing] = React.useState(false)

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true)
    await loadPosts()
    setRefreshing(false)
  }, [])

  // Use dummy data if posts is empty
  const displayPosts = posts && posts.length > 0 ? posts : DUMMY_POSTS

  const renderPost = ({ item }) => (
    <PostCard post={item} onPress={() => navigation.navigate("PostDetail", { post: item })} />
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e293b" />
      <LinearGradient
        colors={["#1e293b", "#334155", "#475569"]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={styles.header}>
        <View style={styles.headerCapsule}>
          <Text style={styles.headerTitle}>Quick Aid Feed</Text>
          <Text style={styles.headerSubtitle}>Requests and offers from the community</Text>
        </View>
      </View>
      <FlatList
        data={displayPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
})
