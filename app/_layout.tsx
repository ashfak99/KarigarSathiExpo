import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import '../src/utils/i18n';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#1E88E5' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          contentStyle: { backgroundColor: '#F5F5F5' },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="category" options={{ title: 'Select Category' }} />
        <Stack.Screen name="subcategory" options={{ title: 'Select Profession' }} />
        <Stack.Screen name="form/personal" options={{ title: 'Personal Details' }} />
        <Stack.Screen name="form/professional" options={{ title: 'Professional Details' }} />
        <Stack.Screen name="preview" options={{ title: 'Preview Resume' }} />
        <Stack.Screen name="download" options={{ title: 'Download' }} />
        <Stack.Screen name="payment" options={{ title: 'Payment' }} />
      </Stack>
    </>
  );
}