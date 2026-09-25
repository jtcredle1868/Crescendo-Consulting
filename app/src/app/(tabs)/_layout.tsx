import { Redirect, Tabs } from "expo-router";
import { Text } from "react-native";
import { useAuthStore } from "@/state/authStore";

function TabIcon({ symbol }: { symbol: string }) {
  return <Text style={{ fontSize: 20 }}>{symbol}</Text>;
}

export default function TabsLayout() {
  const token = useAuthStore((s) => s.token);
  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs screenOptions={{ headerShown: true, tabBarActiveTintColor: "#a21caf" }}>
      <Tabs.Screen
        name="index"
        options={{ title: "Discover", tabBarIcon: () => <TabIcon symbol="🔎" /> }}
      />
      <Tabs.Screen
        name="connections"
        options={{ title: "Connections", tabBarIcon: () => <TabIcon symbol="🤝" /> }}
      />
      <Tabs.Screen
        name="bookings"
        options={{ title: "Bookings", tabBarIcon: () => <TabIcon symbol="🗓️" /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile", tabBarIcon: () => <TabIcon symbol="👤" /> }}
      />
    </Tabs>
  );
}
