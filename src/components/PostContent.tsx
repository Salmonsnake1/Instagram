import { useWindowDimensions } from 'react-native';
import { cld } from '../lib/cloudinary';
import { thumbnail, scale } from '@cloudinary/url-gen/actions/resize';
import { AdvancedImage } from 'cloudinary-react-native';
import { ResizeMode, Video } from 'expo-av';

// Define the type for a Post object
interface Post {
  media_type: 'image' | 'video';  // Assuming the media_type can only be 'image' or 'video'
  image: string;  // The image URL or ID
}

interface PostContentProps {
  post: Post;  // Use the Post type for the post prop
}

export default function PostContent({ post }: PostContentProps) {
  const { width } = useWindowDimensions();

  if (post.media_type === 'image') {
    const image = cld.image(post.image);
    image.resize(thumbnail().width(width).height(width));

    return <AdvancedImage cldImg={image} className="w-full aspect-[4/3]" />;
  }

  if (post.media_type === 'video') {
    const video = cld.video(post.image);
    video.resize(scale().width(400));

    return (
      <Video
        className="w-52 aspect-[3/4] rounded-lg bg-slate-300"
        style={{ width: '100%', aspectRatio: 16 / 9 }}
        source={{
          uri: video.toURL(),
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        // shouldPlay
      />
    );
  }

  return null;  // Return null if neither image nor video is found
}
