import React, { useEffect, useState } from 'react';
import { Alert, FlatList, View } from 'react-native';
import PostListItem from '~/src/components/PostListItem';
import { supabase } from '~/src/lib/supabase';

type Post = {
  id: string;
  created_at: string;
  content: string;
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

  useEffect(() => {
    fetchPosts();

    const checkProfile = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
        return;
      }

      const userId = data?.user?.id;
      if (!userId) {
        console.warn('No user is logged in.');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('Current Profile:', profile, profileError);
    };

    checkProfile();

    // Real-time subscription to profile updates
    const channel = supabase
      .channel('profile-updates')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'profiles' },
        (payload) => {
          const updatedProfile = payload.new;

          // Update the avatar in posts where the user's id matches
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post.user.id === updatedProfile.id
                ? {
                    ...post,
                    user: {
                      ...post.user,
                      avatar_url: updatedProfile.avatar_url,
                    },
                  }
                : post
            )
          );
        }
      )
      .subscribe();

    return () => {
      // Clean up all active subscriptions
      supabase.getChannels().forEach((ch) => {
        supabase.removeChannel(ch);
      });
    };
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select(
        `
        *,
        user:profiles(id, username, avatar_url)
        `
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
      renderItem={({ item }) =>
        item ? <PostListItem post={item} /> : null
      }
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
