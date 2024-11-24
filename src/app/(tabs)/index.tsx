import React, { useEffect, useState } from 'react';
import { Alert, FlatList, View, Text, Modal, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PostListItem from '~/src/components/PostListItem';
import { supabase } from '~/src/lib/supabase';

type Post = {
  id: string;
  created_at: string;
  caption: string;
  image: string;
  user: {
    id: string;
    username: string;
    avatar_url: string;
  };
};

export default function FeedScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select(
        `*,
        user:profiles(id, username, avatar_url)`
      )
      .order('created_at', { ascending: false });

    if (error) {
      Alert.alert('Something went wrong');
      setPosts([]);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => (
        <PostListItem post={item} />
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{
        gap: 10,
        maxWidth: 512,
        alignSelf: 'center',
        width: '100%',
      }}
      showsVerticalScrollIndicator={false}
      onRefresh={fetchPosts}
      refreshing={loading}
    />
  );
}
