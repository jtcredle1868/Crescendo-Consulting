import { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Screen } from "@/components/Screen";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import { VerificationBadge, Pill } from "@/components/Badge";
import { getProfile } from "@/api/profiles";
import { createConnection } from "@/api/connections";
import { apiErrorMessage } from "@/api/client";
import { roleLabel } from "@/constants/roles";

export default function ProfileDetailScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const { data: user, isLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getProfile(userId),
    enabled: !!userId,
  });

  const mutation = useMutation({
    mutationFn: () => createConnection(userId, message.trim() || undefined),
    onSuccess: () => setSent(true),
    onError: (err) => setError(apiErrorMessage(err)),
  });

  if (isLoading || !user) {
    return (
      <Screen>
        <ActivityIndicator className="mt-8" />
      </Screen>
    );
  }

  const profile = user.profile;

  return (
    <Screen>
      <Text className="text-2xl font-bold text-ink-900">{profile?.displayName}</Text>
      <Text className="text-sm text-ink-600 mt-0.5">
        {roleLabel(user.role)}
        {profile?.city ? ` · ${profile.city}${profile.state ? `, ${profile.state}` : ""}` : ""}
      </Text>
      <View className="mt-2 mb-4">
        <VerificationBadge status={user.verificationStatus} />
      </View>

      {profile?.headline ? <Text className="text-base text-ink-900 mb-2">{profile.headline}</Text> : null}
      {profile?.bio ? <Text className="text-sm text-ink-700 mb-4">{profile.bio}</Text> : null}

      {profile?.yearsExperience ? (
        <Text className="text-sm text-ink-600 mb-1">{profile.yearsExperience} years experience</Text>
      ) : null}
      {profile?.rateMin ? (
        <Text className="text-sm text-ink-600 mb-3">
          Rate: ${profile.rateMin}
          {profile.rateMax ? `–$${profile.rateMax}` : ""} / {profile.rateUnit ?? "hour"}
        </Text>
      ) : null}

      {profile?.genres?.length || profile?.skills?.length ? (
        <View className="flex-row flex-wrap mb-4">
          {[...(profile?.genres ?? []), ...(profile?.skills ?? [])].map((tag) => (
            <Pill key={tag} label={tag} />
          ))}
        </View>
      ) : null}

      <View className="border-t border-ink-100 pt-4 mt-2">
        {sent ? (
          <View>
            <Text className="text-sm text-emerald-700 mb-3">
              Request sent! Once they accept, you can message and plan a meetup at a neutral, public
              space.
            </Text>
            <Button label="Back to connections" variant="secondary" onPress={() => router.push("/(tabs)/connections")} />
          </View>
        ) : (
          <View>
            <TextField
              label="Introduce yourself (optional)"
              value={message}
              onChangeText={setMessage}
              placeholder="Say why you'd like to connect"
            />
            {error ? <Text className="text-sm text-red-600 mb-3">{error}</Text> : null}
            <Button label="Send connection request" onPress={() => mutation.mutate()} loading={mutation.isPending} />
          </View>
        )}
      </View>
    </Screen>
  );
}
