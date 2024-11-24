import React from 'react';
import { View, Text, Image } from 'react-native';

type PostListItemProps = {
  post: {
    user: {
      username: string;
      avatar_url: string;
    };
    caption: string;
    image?: string;
    created_at: string;
  };
};

const PostListItem: React.FC<PostListItemProps> = ({ post }) => {
  const avatarUrl = post.user.avatar_url || 'https://cdn-icons-png.flaticon.com/128/1326/1326377.png';

  // Function to calculate the time ago
  const formatTimestamp = (timestamp: string) => {
    const postDate = new Date(timestamp);
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - postDate.getTime();

    const seconds = Math.floor(timeDiff / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  return (
    <View style={{ backgroundColor: 'white', padding: 10 }}>
      {/* Header: Avatar and Username */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Image
          source={{ uri: avatarUrl }}
          style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
        />
        <Text style={{ fontWeight: 'bold' }}>
          {post.user.username || 'New user'}
        </Text>
      </View>

      {/* Post Image */}
      {post.image ? (
        <Image
          source={{
            uri: `https://res.cloudinary.com/dupithuzj/image/upload/${post.image}.jpg`,
          }}
          style={{ width: '100%', height: 240, marginTop: 0 }}
        />
      ) : null}

      {/* Caption (if available) */}
      {post.caption ? (
        <Text style={{ marginTop: 5, marginBottom: 5 }}>{post.caption}</Text>
      ) : null}

      {/* Timestamp */}
      <Text style={{ fontSize: 12, color: 'gray', marginTop: 5 }}>
        {formatTimestamp(post.created_at)}
      </Text>
    </View>
  );
};

export default PostListItem;
