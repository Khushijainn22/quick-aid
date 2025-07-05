"use client"

import React from "react"
import { View, Text, FlatList, StyleSheet, RefreshControl } from "react-native"
import { useData } from "../context/DataContext"
import PostCard from "../components/PostCard"

export default function FeedScreen({ navigation }) {
  const { posts, loadPosts } = useData()
  const [refreshing, setRefreshing] = React.useState(false)

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true)
    await loadPosts()
    setRefreshing(false)
  }, [])

  const renderPost = ({ item }) => (
    <PostCard post={item} onPress={() => navigation.navigate("PostDetail", { post: item })} />
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Healthcare Feed</Text>
      </View>

      <FlatList
        data={posts}
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
  listContainer: {
    paddingVertical: 8,
  },
})
