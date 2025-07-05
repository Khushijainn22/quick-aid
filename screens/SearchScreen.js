"use client"

import { useState, useEffect } from "react"
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, StatusBar, Dimensions, ScrollView } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useData } from "../context/DataContext"
import PostCard from "../components/PostCard"

const { width, height } = Dimensions.get("window")

// Search suggestions for better UX
const SEARCH_SUGGESTIONS = [
  "blood donation", "insulin", "wheelchair", "ambulance", "medicine",
  "medical supplies", "nurse", "doctor", "emergency", "accident",
  "hospital", "clinic", "urgent care", "pharmacy", "oxygen"
]

const RESOURCE_TYPES = [
  "All Resources",
  "Medical Supplies",
  "Blood Donation", 
  "Medicine",
  "Medical Equipment",
  "Transportation",
  "Financial Help",
  "Volunteer Help",
  "Other"
]

const URGENCY_LEVELS = [
  "All Urgency",
  "Critical",
  "High", 
  "Medium",
  "Low"
]

const STATUS_OPTIONS = [
  "All Status",
  "Pending",
  "Available",
  "Resolved"
]

export default function SearchScreen({ navigation }) {
  const { posts } = useData()
  const [searchQuery, setSearchQuery] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [postTypeFilter, setPostTypeFilter] = useState("All")
  const [resourceTypeFilter, setResourceTypeFilter] = useState("All Resources")
  const [urgencyFilter, setUrgencyFilter] = useState("All Urgency")
  const [statusFilter, setStatusFilter] = useState("All Status")
  const [filteredPosts, setFilteredPosts] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    filterPosts()
  }, [searchQuery, locationFilter, postTypeFilter, resourceTypeFilter, urgencyFilter, statusFilter, posts])

  const filterPosts = () => {
    let filtered = posts

    // Filter by search query (search in title, description, resource type)
    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.resourceType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.emergencyType?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by location
    if (locationFilter) {
      filtered = filtered.filter((post) => 
        post.location?.toLowerCase().includes(locationFilter.toLowerCase())
      )
    }

    // Filter by post type
    if (postTypeFilter !== "All") {
      filtered = filtered.filter((post) => post.postType === postTypeFilter)
    }

    // Filter by resource type
    if (resourceTypeFilter !== "All Resources") {
      filtered = filtered.filter((post) => post.resourceType === resourceTypeFilter)
    }

    // Filter by urgency level (only for requests)
    if (urgencyFilter !== "All Urgency") {
      filtered = filtered.filter((post) => 
        post.postType === "Request" && post.urgencyLevel === urgencyFilter
      )
    }

    // Filter by status
    if (statusFilter !== "All Status") {
      filtered = filtered.filter((post) => post.status === statusFilter)
    }

    setFilteredPosts(filtered)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setLocationFilter("")
    setPostTypeFilter("All")
    setResourceTypeFilter("All Resources")
    setUrgencyFilter("All Urgency")
    setStatusFilter("All Status")
  }

  const handleSuggestionPress = (suggestion) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
  }

  const renderPost = ({ item }) => (
    <PostCard post={item} onPress={() => navigation.navigate("PostDetail", { post: item })} />
  )

  const renderSuggestion = ({ item }) => (
    <TouchableOpacity 
      style={styles.suggestionItem}
      onPress={() => handleSuggestionPress(item)}
    >
      <Ionicons name="search-outline" size={16} color="#64748b" />
      <Text style={styles.suggestionText}>{item}</Text>
    </TouchableOpacity>
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

      {/* Header */}
      <LinearGradient
        colors={["rgba(30, 41, 59, 0.95)", "rgba(51, 65, 85, 0.95)"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.headerTitle}>Search Community</Text>
        <Text style={styles.headerSubtitle}>Find healthcare resources and requests</Text>
      </LinearGradient>

      {/* Search Section */}
      <View style={styles.searchSection}>
        {/* Main Search Input */}
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#667eea" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for blood, medicine, equipment..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text)
              setShowSuggestions(text.length > 0)
            }}
            onFocus={() => setShowSuggestions(searchQuery.length > 0)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Search Suggestions */}
        {showSuggestions && (
          <View style={styles.suggestionsContainer}>
            <FlatList
              data={SEARCH_SUGGESTIONS.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()))}
              renderItem={renderSuggestion}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {/* Location Filter */}
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={20} color="#667eea" style={styles.locationIcon} />
          <TextInput
            style={styles.locationInput}
            placeholder="Filter by location..."
            placeholderTextColor="#94a3b8"
            value={locationFilter}
            onChangeText={setLocationFilter}
          />
        </View>

        {/* Filter Toggle */}
        <TouchableOpacity 
          style={styles.filterToggle}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="filter" size={20} color="white" />
          <Text style={styles.filterToggleText}>Advanced Filters</Text>
          <Ionicons 
            name={showFilters ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="white" 
          />
        </TouchableOpacity>

        {/* Advanced Filters */}
        {showFilters && (
          <View style={styles.filtersContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {/* Post Type Filter */}
              <View style={styles.filterChip}>
                <Text style={styles.filterChipLabel}>Type</Text>
                <View style={styles.chipRow}>
                  {["All", "Request", "Offer"].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.chip,
                        postTypeFilter === type && styles.chipActive
                      ]}
                      onPress={() => setPostTypeFilter(type)}
                    >
                      <Text style={[
                        styles.chipText,
                        postTypeFilter === type && styles.chipTextActive
                      ]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Resource Type Filter */}
              <View style={styles.filterChip}>
                <Text style={styles.filterChipLabel}>Resource</Text>
                <View style={styles.chipRow}>
                  {RESOURCE_TYPES.slice(0, 4).map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.chip,
                        resourceTypeFilter === type && styles.chipActive
                      ]}
                      onPress={() => setResourceTypeFilter(type)}
                    >
                      <Text style={[
                        styles.chipText,
                        resourceTypeFilter === type && styles.chipTextActive
                      ]}>
                        {type.replace("All Resources", "All")}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Urgency Filter */}
              <View style={styles.filterChip}>
                <Text style={styles.filterChipLabel}>Urgency</Text>
                <View style={styles.chipRow}>
                  {URGENCY_LEVELS.slice(0, 4).map((level) => (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.chip,
                        urgencyFilter === level && styles.chipActive
                      ]}
                      onPress={() => setUrgencyFilter(level)}
                    >
                      <Text style={[
                        styles.chipText,
                        urgencyFilter === level && styles.chipTextActive
                      ]}>
                        {level.replace("All Urgency", "All")}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Status Filter */}
              {/* <View style={styles.filterChip}>
                <Text style={styles.filterChipLabel}>Status</Text>
                <View style={styles.chipRow}>
                  {STATUS_OPTIONS.slice(0, 3).map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.chip,
                        statusFilter === status && styles.chipActive
                      ]}
                      onPress={() => setStatusFilter(status)}
                    >
                      <Text style={[
                        styles.chipText,
                        statusFilter === status && styles.chipTextActive
                      ]}>
                        {status.replace("All Status", "All")}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View> */}
            </ScrollView>

            {/* Clear Filters Button */}
            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <Ionicons name="refresh" size={16} color="white" />
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {filteredPosts.length} result{filteredPosts.length !== 1 ? "s" : ""} found
        </Text>
        {filteredPosts.length > 0 && (
          <Text style={styles.resultsSubtext}>
            {postTypeFilter !== "All" ? `${postTypeFilter}s` : "Posts"} 
            {locationFilter ? ` in ${locationFilter}` : ""}
          </Text>
        )}
      </View>

      {/* Results List */}
      <FlatList
        data={filteredPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color="#94a3b8" />
            <Text style={styles.emptyTitle}>No posts found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search terms or filters
            </Text>
          </View>
        }
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
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  searchSection: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1e293b",
  },
  suggestionsContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  suggestionText: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  locationIcon: {
    marginRight: 12,
  },
  locationInput: {
    flex: 1,
    fontSize: 16,
    color: "#1e293b",
  },
  filterToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#667eea",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  filterToggleText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
    marginRight: 8,
  },
  filtersContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  filterChip: {
    marginRight: 20,
    minWidth: 120,
  },
  filterChipLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  chip: {
    backgroundColor: "white",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  chipActive: {
    backgroundColor: "#667eea",
    borderColor: "#667eea",
  },
  chipText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748b",
  },
  chipTextActive: {
    color: "white",
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ef4444",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: "center",
    marginTop: 12,
  },
  clearButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  resultsHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  resultsText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  resultsSubtext: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 2,
  },
  listContainer: {
    paddingVertical: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#64748b",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 20,
  },
})
