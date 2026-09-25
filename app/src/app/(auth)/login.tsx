import { useState } from "react";
import { Text, View } from "react-native";
import { Link, router } from "expo-router";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/TextField";
import { Button } from "@/components/Button";
import { loginRequest } from "@/api/auth";
import { apiErrorMessage } from "@/api/client";
import { useAuthStore } from "@/state/authStore";

export default function LoginScreen() {
  const setSession = useAuthStore((s) => s.setSession);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    setLoading(true);
    setError(null);
    try {
      const { token, user } = await loginRequest({ email: email.trim(), password });
      await setSession(token, user);
      router.replace("/(tabs)");
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <View className="mt-10 mb-8">
        <Text className="text-3xl font-bold text-ink-900">Welcome back</Text>
        <Text className="text-base text-ink-600 mt-1">
          Sign in to connect with musicians, producers, and venues.
        </Text>
      </View>

      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="you@example.com"
      />
      <TextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="••••••••"
      />

      {error ? <Text className="text-sm text-red-600 mb-4">{error}</Text> : null}

      <Button label="Sign in" onPress={onSubmit} loading={loading} disabled={!email || !password} />

      <View className="flex-row justify-center mt-6">
        <Text className="text-ink-600">New here? </Text>
        <Link href="/(auth)/register" className="text-brand-600 font-medium">
          Create an account
        </Link>
      </View>
    </Screen>
  );
}
