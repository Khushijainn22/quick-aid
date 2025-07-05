import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export default function PostCard({ post, onPress }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "#f59e0b"
      case "Available": return "#10b981"
      case "Resolved": return "#6366f1"
      default: return "#64748b"
    }
  }

  const getPostTypeColor = (postType) => {
    switch (postType) {
      case "Request": return "#ef4444"
      case "Offer": return "#10b981"
      default: return "#6366f1"
    }
  }

  const getPostTypeIcon = (postType) => {
    switch (postType) {
      case "Request": return "help-circle-outline"
      case "Offer": return "heart-outline"
      default: return "document-outline"
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "Critical": return "#ef4444"
      case "High": return "#f59e0b"
      case "Medium": return "#6366f1"
      case "Low": return "#10b981"
      default: return "#64748b"
    }
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{post.userName.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{post.userName}</Text>
            <Text style={styles.userContact}>{post.userPhone}</Text>
          </View>
        </View>
        <Text style={styles.timestamp}>{formatTime(post.timestamp)}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.badges}>
          <View style={[styles.badge, { backgroundColor: getPostTypeColor(post.postType) }]}>
            <Ionicons 
              name={getPostTypeIcon(post.postType)} 
              size={12} 
              color="white" 
              style={{ marginRight: 4 }}
            />
            <Text style={styles.badgeText}>{post.postType}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: getStatusColor(post.status) }]}>
            <Text style={styles.badgeText}>{post.status}</Text>
          </View>
          {post.postType === "Request" && post.urgencyLevel && (
            <View style={[styles.badge, { backgroundColor: getUrgencyColor(post.urgencyLevel) }]}>
              <Text style={styles.badgeText}>{post.urgencyLevel}</Text>
            </View>
          )}
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {post.title}
        </Text>

        <Text style={styles.description} numberOfLines={3}>
          {post.description}
        </Text>

        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={14} color="#64748b" style={{ marginRight: 4 }} />
          <Text style={styles.location}>{post.location}</Text>
        </View>

        {post.comments && post.comments.length > 0 && (
          <Text style={styles.commentsCount}>
            {post.comments.length} comment{post.comments.length !== 1 ? "s" : ""}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  userContact: {
    fontSize: 14,
    color: "#64748b",
  },
  timestamp: {
    fontSize: 12,
    color: "#94a3b8",
  },
  content: {
    gap: 8,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "600",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    lineHeight: 20,
  },
  description: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    fontSize: 13,
    color: "#64748b",
    flex: 1,
  },
  commentsCount: {
    fontSize: 12,
    color: "#6366f1",
    fontWeight: "500",
  },
})
