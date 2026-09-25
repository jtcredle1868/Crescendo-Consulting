import "../global.css";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "@/state/authStore";
import { meRequest } from "@/api/auth";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

function SessionBootstrap({ children }: { children: React.ReactNode }) {
  const { hydrate, hydrated, token, setUser, signOut } = useAuthStore();
  const [checkedSession, setCheckedSession] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!hydrated) return;

    async function checkSession() {
      if (token) {
        try {
          setUser(await meRequest());
        } catch {
          await signOut();
        }
      }
      setCheckedSession(true);
    }

    checkSession();
  }, [hydrated, token, setUser, signOut]);

  if (!hydrated || !checkedSession) {
    return <View className="flex-1 bg-ink-50" />;
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionBootstrap>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="profile/[userId]" options={{ headerShown: true, title: "Profile" }} />
          <Stack.Screen name="connections/[id]" options={{ headerShown: true, title: "Connection" }} />
          <Stack.Screen name="verification" options={{ headerShown: true, title: "Get Verified" }} />
        </Stack>
      </SessionBootstrap>
    </QueryClientProvider>
  );
}
