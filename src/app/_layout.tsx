// src/layouts/RootLayout.tsx
import { Stack } from 'expo-router';
import '../../global.css';
import AuthProvider from '../providers/AuthProvider';

export default function RootLayout() {
  return (
    <AuthProvider>
      {/* Removed AvatarProvider */}
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
