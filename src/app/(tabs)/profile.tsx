import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Alert,
  FlatList,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import { useAuth } from '~/src/providers/AuthProvider';
import { supabase } from '~/src/lib/supabase';
import Button from '~/src/components/Button';

const avatarOptions = [
  'https://cdn-icons-png.flaticon.com/128/1326/1326377.png',
  'https://cdn-icons-png.flaticon.com/128/3940/3940403.png',
  'https://cdn-icons-png.flaticon.com/128/1308/1308845.png',
  'https://cdn-icons-png.flaticon.com/128/1326/1326390.png',
  'https://cdn-icons-png.flaticon.com/128/4322/4322991.png',
  'https://cdn-icons-png.flaticon.com/128/3940/3940417.png',
  'https://cdn-icons-png.flaticon.com/128/1326/1326405.png',
  'https://cdn-icons-png.flaticon.com/128/4322/4322992.png',
  'https://cdn-icons-png.flaticon.com/128/9308/9308979.png',
  'https://cdn-icons-png.flaticon.com/128/9308/9308963.png',
  'https://cdn-icons-png.flaticon.com/128/1810/1810917.png',
  'https://cdn-icons-png.flaticon.com/128/9308/9308891.png',
  'https://cdn-icons-png.flaticon.com/128/9308/9308938.png',
  'https://cdn-icons-png.flaticon.com/128/9308/9308879.png',
  'https://cdn-icons-png.flaticon.com/128/6740/6740990.png',
  'https://cdn-icons-png.flaticon.com/128/9308/9308872.png',
  'https://cdn-icons-png.flaticon.com/128/2021/2021646.png',
  'https://cdn-icons-png.flaticon.com/128/9985/9985812.png',
];


export default function ProfileScreen() {
  const { user } = useAuth();
  const [username, setUsername] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    getProfile();
    fetchUserPosts();

    // Real-time update on avatar change
    const channel = supabase
      .channel('profile-updates')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'profiles' },
        (payload) => {
          const updatedProfile = payload.new;
          if (updatedProfile.id === user?.id) {
            setSelectedAvatar(updatedProfile.avatar_url);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      Alert.alert('Failed to fetch profile');
      return;
    }

    setUsername(data?.username || '');
    setSelectedAvatar(data?.avatar_url || null);
  };

  const fetchUserPosts = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      Alert.alert('Failed to fetch posts');
      return;
    }

    setPosts(data || []);
  };

  const updateProfile = async () => {
    if (!user) return;

    const avatar_url = selectedAvatar;

    const { error } = await supabase
      .from('profiles')
      .update({ username, avatar_url })
      .eq('id', user.id);

    if (error) {
      Alert.alert('Failed to update profile');
    } else {
      Alert.alert('Profile updated successfully!');
    }
  };

  const renderAvatarOption = (avatar: string) => (
    <TouchableOpacity
      key={avatar}
      onPress={() => setSelectedAvatar(avatar)}
      style={{ margin: 5 }}
    >
      <Image
        source={{ uri: avatar }}
        style={{
          width: 80,
          height: 80,
          borderRadius: 999,
          borderWidth: selectedAvatar === avatar ? 2 : 0,
          borderColor: 'blue',
        }}
      />
    </TouchableOpacity>
  );

  const renderPostImage = ({ item }: { item: any }) => {
    return (
      <View
        key={item.id}
        style={{ width: '23%', margin: 5 }}
      >
        {item.image ? (
          <Image
            source={{
              uri: `https://res.cloudinary.com/dupithuzj/image/upload/${item.image}.jpg`,
            }}
            style={{
              width: '100%',
              height: 80,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#ddd',
            }}
          />
        ) : null}
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16, paddingBottom: 16 }}>
        <TouchableOpacity
          onPress={() => supabase.auth.signOut()}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            padding: 10,
            backgroundColor: '#f44336',
            borderRadius: 5,
            elevation: 3,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Sign Out</Text>
        </TouchableOpacity>

        <View>
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            {selectedAvatar ? (
              <Image
                source={{ uri: selectedAvatar }}
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: 75,
                  backgroundColor: '#d3d3d3',
                }}
              />
            ) : (
              <View
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: 75,
                  backgroundColor: '#d3d3d3',
                }}
              />
            )}
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Enter your username"
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                padding: 10,
                borderRadius: 5,
                marginTop: 10,
                width: '80%',
                textAlign: 'center',
              }}
            />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
            <View style={{ marginRight: 10 }}>
              <Button title="Change Avatar" onPress={() => setModalVisible(true)} />
            </View>
            <Button title="Update Profile" onPress={updateProfile} />
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Your Posts:</Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {posts.length > 0 ? posts.map((item) => renderPostImage({ item })) : null}
            </View>
          </View>
        </View>

        <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 20,
              backgroundColor: 'white',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>
              Select Your Avatar
            </Text>
            <FlatList
              data={avatarOptions}
              renderItem={({ item }) => renderAvatarOption(item)}
              numColumns={3}
              keyExtractor={(item) => item}
              contentContainerStyle={{
                paddingHorizontal: 10,
                justifyContent: 'center',
              }}
            />
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </Modal>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}
