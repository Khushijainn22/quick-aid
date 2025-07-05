import { View, Text, TouchableOpacity, StyleSheet } from "react-native"

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
    return status === "Pending" ? "#f59e0b" : "#10b981"
  }

  const getTypeColor = (type) => {
    return type === "Emergency" ? "#ef4444" : "#6366f1"
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
          <View style={[styles.badge, { backgroundColor: getTypeColor(post.postType) }]}>
            <Text style={styles.badgeText}>{post.postType}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: getStatusColor(post.status) }]}>
            <Text style={styles.badgeText}>{post.status}</Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={3}>
          {post.description}
        </Text>

        <View style={styles.locationContainer}>
          <Text style={styles.locationLabel}>📍</Text>
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
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  description: {
    fontSize: 16,
    color: "#1e293b",
    lineHeight: 22,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationLabel: {
    fontSize: 14,
    marginRight: 4,
  },
  location: {
    fontSize: 14,
    color: "#64748b",
    flex: 1,
  },
  commentsCount: {
    fontSize: 12,
    color: "#6366f1",
    fontWeight: "500",
  },
})
