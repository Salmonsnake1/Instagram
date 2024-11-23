import { View, Text, Image } from 'react-native';
import { Ionicons, Feather, AntDesign } from '@expo/vector-icons';

type PostListItemProps = {
  post: {
    user: {
      username: string;
      avatar_url: string;
    };
    content: string;
    image: string;
  };
};

const PostListItem: React.FC<PostListItemProps> = ({ post }) => {
  // Use the avatar_url as is; fallback to a placeholder if unavailable
  const avatarUrl = post.user.avatar_url || 'https://cdn-icons-png.flaticon.com/128/1326/1326377.png';

  return (
    <View style={{ backgroundColor: 'white', padding: 10 }}>
      {/* Header: Avatar and Username */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 0 }}>
        {/* Avatar */}
        <Image
          source={{ uri: avatarUrl }}
          style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
        />
        {/* Username */}
        <Text style={{ fontWeight: 'bold' }}>
          {post.user.username || 'New user'}
        </Text>
      </View>

      {/* Content: Post Text */}
      <Text style={{ marginBottom: 5 }}>{post.content}</Text>

      {/* Post Image (if any) */}
      {post.image && (
        <Image
          source={{
            uri: `https://res.cloudinary.com/dupithuzj/image/upload/${post.image}.jpg`,
          }}
          style={{ width: '100%', height: 240, marginTop: 0 }} // Reduced marginTop to 0
        />
      )}

      {/* Icons */}
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
        <AntDesign name="hearto" size={20} />
        <Ionicons name="chatbubble-outline" size={20} />
        <Feather name="send" size={20} />
        <Feather name="bookmark" size={20} style={{ marginLeft: 'auto' }} />
      </View>
    </View>
  );
};

export default PostListItem;
