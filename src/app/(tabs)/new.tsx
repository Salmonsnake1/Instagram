import { Text, View, Image, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import Button from '~/src/components/Button';
import { uploadImage } from '~/src/lib/cloudinary';
import { supabase } from '~/src/lib/supabase';
import { useAuth } from '~/src/providers/AuthProvider';
import { router } from 'expo-router';

export default function CreatePost() {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const { session } = useAuth();

  useEffect(() => {
    if (!image) {
      pickImage();
    }
  }, [image]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const createPost = async () => {
    if (!image) {
      return;
    }

    // Upload the image to Cloudinary
    const response = await uploadImage(image);
    console.log('image id: ', response?.public_id);

    // Insert the post into the database
    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          caption,
          image: response?.public_id,
          user_id: session?.user.id,
        },
      ])
      .select();

    if (error) {
      Alert.alert('Error', 'There was an error creating the post.');
    } else {
      Alert.alert('Success', 'Post was uploaded successfully!');

      setCaption('');
      setImage(null);

      router.push('/(tabs)');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{ padding: 16, flex: 1, alignItems: 'center' }}>
        {/* Image picker */}
        {image ? (
          <Image
            source={{ uri: image }}
            style={{
              width: 200,
              aspectRatio: 3 / 4,
              borderRadius: 12,
              backgroundColor: '#e5e5e5',
            }}
          />
        ) : (
          <View
            style={{
              width: 200,
              aspectRatio: 3 / 4,
              borderRadius: 12,
              backgroundColor: '#e5e5e5',
            }}
          />
        )}

        {/* Add a photo */}
        <Text
          onPress={pickImage}
          style={{
            color: '#fff',
            fontWeight: 'bold',
            marginTop: 20,
            paddingVertical: 12,
            paddingHorizontal: 40,
            borderWidth: 1,
            borderColor: '#9CA3AF',
            borderRadius: 8,
            backgroundColor: '#9CA3AF',
            textAlign: 'center',
            marginBottom: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          Add a photo
        </Text>

        {/* TextInput for caption */}
        <TextInput
          value={caption}
          onChangeText={(newValue) => setCaption(newValue)}
          placeholder="What's on your mind?"
          style={{
            width: '100%',
            padding: 16,
            borderWidth: 1,
            borderColor: '#d1d5db',
            borderRadius: 8,
            marginBottom: 16,
            height: 128,
            textAlignVertical: 'top',
            fontSize: 16,
          }}
          multiline={true}
          numberOfLines={4}
        />

        {/* Share button */}
        <View style={{ marginTop: 'auto', width: '100%', alignItems: 'center' }}>
          <Button
            title="Share"
            onPress={createPost}
            style={{
              backgroundColor: '#9CA3AF',
              width: '50%',
              paddingVertical: 12,
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
