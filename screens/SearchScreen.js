"use client"

import { useState, useEffect } from "react"
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from "react-native"
import { Picker } from "@react-native-picker/picker"
import { useData } from "../context/DataContext"
import PostCard from "../components/PostCard"

export default function SearchScreen({ navigation }) {
  const { posts } = useData()
  const [searchQuery, setSearchQuery] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [filteredPosts, setFilteredPosts] = useState([])

  useEffect(() => {
    filterPosts()
  }, [searchQuery, locationFilter, typeFilter, statusFilter, posts])

  const filterPosts = () => {
    let filtered = posts

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.location.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by location
    if (locationFilter) {
      filtered = filtered.filter((post) => post.location.toLowerCase().includes(locationFilter.toLowerCase()))
    }

    // Filter by type
    if (typeFilter !== "All") {
      filtered = filtered.filter((post) => post.postType === typeFilter)
    }

    // Filter by status
    if (statusFilter !== "All") {
      filtered = filtered.filter((post) => post.status === statusFilter)
    }

    setFilteredPosts(filtered)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setLocationFilter("")
    setTypeFilter("All")
    setStatusFilter("All")
  }

  const renderPost = ({ item }) => (
    <PostCard post={item} onPress={() => navigation.navigate("PostDetail", { post: item })} />
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search Posts</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by keywords..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <TextInput
          style={styles.searchInput}
          placeholder="Filter by location..."
          value={locationFilter}
          onChangeText={setLocationFilter}
        />

        <View style={styles.filterRow}>
          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>Type</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={typeFilter} onValueChange={setTypeFilter} style={styles.picker}>
                <Picker.Item label="All" value="All" />
                <Picker.Item label="Emergency" value="Emergency" />
                <Picker.Item label="Availability" value="Availability" />
              </Picker>
            </View>
          </View>

          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>Status</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={statusFilter} onValueChange={setStatusFilter} style={styles.picker}>
                <Picker.Item label="All" value="All" />
                <Picker.Item label="Pending" value="Pending" />
                <Picker.Item label="Fulfilled" value="Fulfilled" />
              </Picker>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
          <Text style={styles.clearButtonText}>Clear Filters</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {filteredPosts.length} result{filteredPosts.length !== 1 ? "s" : ""}
        </Text>
      </View>

      <FlatList
        data={filteredPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
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
  searchContainer: {
    backgroundColor: "white",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  searchInput: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  filterItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    color: "#374151",
  },
  pickerContainer: {
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
  },
  picker: {
    height: 40,
  },
  clearButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  clearButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  resultsHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  resultsText: {
    fontSize: 14,
    color: "#64748b",
  },
  listContainer: {
    paddingVertical: 8,
  },
})
