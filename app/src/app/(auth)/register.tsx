import { useState } from "react";
import { Pressable, Switch, Text, View } from "react-native";
import { Link, router } from "expo-router";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/TextField";
import { Button } from "@/components/Button";
import { registerRequest } from "@/api/auth";
import { apiErrorMessage } from "@/api/client";
import { useAuthStore } from "@/state/authStore";
import { SELECTABLE_ROLES, type UserRole } from "@/constants/roles";

export default function RegisterScreen() {
  const setSession = useAuthStore((s) => s.setSession);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Exclude<UserRole, "ADMIN">>("MUSICIAN");
  const [isBusiness, setIsBusiness] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    setLoading(true);
    setError(null);
    try {
      const { token, user } = await registerRequest({
        email: email.trim(),
        password,
        role,
        displayName: displayName.trim(),
        isBusiness,
        businessName: isBusiness ? businessName.trim() : undefined,
      });
      await setSession(token, user);
      router.replace("/verification");
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <View className="mt-10 mb-6">
        <Text className="text-3xl font-bold text-ink-900">Join Crescendo</Text>
        <Text className="text-base text-ink-600 mt-1">
          Connect with musicians, producers, technicians, venues, and services.
        </Text>
      </View>

      <Text className="text-sm font-medium text-ink-800 mb-2">I am a...</Text>
      <View className="flex-row flex-wrap mb-4 -mx-1">
        {SELECTABLE_ROLES.map((option) => {
          const selected = role === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => setRole(option.value)}
              className={`m-1 px-3.5 py-2.5 rounded-xl border ${
                selected ? "bg-brand-600 border-brand-600" : "bg-white border-ink-100"
              }`}
            >
              <Text className={`text-sm font-medium ${selected ? "text-white" : "text-ink-800"}`}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <TextField label="Full name or act name" value={displayName} onChangeText={setDisplayName} />
      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextField label="Password" value={password} onChangeText={setPassword} secureTextEntry />

      <View className="flex-row items-center justify-between mb-4 bg-white border border-ink-100 rounded-xl px-4 py-3.5">
        <View className="flex-1 pr-3">
          <Text className="text-sm font-medium text-ink-900">Signing up as a business</Text>
          <Text className="text-xs text-ink-600 mt-0.5">
            Venues, studios, and agencies can submit business verification next.
          </Text>
        </View>
        <Switch value={isBusiness} onValueChange={setIsBusiness} />
      </View>

      {isBusiness ? (
        <TextField label="Business name" value={businessName} onChangeText={setBusinessName} />
      ) : null}

      {error ? <Text className="text-sm text-red-600 mb-4">{error}</Text> : null}

      <Button
        label="Create account"
        onPress={onSubmit}
        loading={loading}
        disabled={!email || !password || !displayName}
      />

      <View className="flex-row justify-center mt-6">
        <Text className="text-ink-600">Already have an account? </Text>
        <Link href="/(auth)/login" className="text-brand-600 font-medium">
          Sign in
        </Link>
      </View>
    </Screen>
  );
}
