import { useState } from "react";
import { Text, View } from "react-native";
import { router } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/TextField";
import { Button } from "@/components/Button";
import { VerificationBadge } from "@/components/Badge";
import { useAuthStore } from "@/state/authStore";
import { updateMyProfile } from "@/api/profiles";
import { apiErrorMessage } from "@/api/client";
import { roleLabel } from "@/constants/roles";

export default function MyProfileScreen() {
  const { user, setUser, signOut } = useAuthStore();
  const queryClient = useQueryClient();
  const [headline, setHeadline] = useState(user?.profile?.headline ?? "");
  const [bio, setBio] = useState(user?.profile?.bio ?? "");
  const [city, setCity] = useState(user?.profile?.city ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const mutation = useMutation({
    mutationFn: () => updateMyProfile({ headline, bio, city }),
    onSuccess: (profile) => {
      if (user) setUser({ ...user, profile });
      setSaved(true);
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
    },
    onError: (err) => setError(apiErrorMessage(err)),
  });

  if (!user) return null;

  return (
    <Screen>
      <View className="mb-6">
        <Text className="text-2xl font-bold text-ink-900">{user.profile?.displayName}</Text>
        <Text className="text-sm text-ink-600 mt-0.5">
          {roleLabel(user.role)} · {user.email}
        </Text>
        <View className="mt-2">
          <VerificationBadge status={user.verificationStatus} />
        </View>
        {user.verificationStatus !== "VERIFIED" ? (
          <View className="mt-3">
            <Button label="Continue verification" variant="secondary" onPress={() => router.push("/verification")} />
          </View>
        ) : null}
      </View>

      <TextField label="Headline" value={headline} onChangeText={setHeadline} placeholder="What you do, in one line" />
      <TextField
        label="Bio"
        value={bio}
        onChangeText={setBio}
        placeholder="Tell people about your work"
        multiline
        numberOfLines={4}
        style={{ minHeight: 96, textAlignVertical: "top" }}
      />
      <TextField label="City" value={city} onChangeText={setCity} />

      {error ? <Text className="text-sm text-red-600 mb-3">{error}</Text> : null}
      {saved ? <Text className="text-sm text-emerald-600 mb-3">Saved.</Text> : null}

      <Button
        label="Save profile"
        onPress={() => {
          setSaved(false);
          mutation.mutate();
        }}
        loading={mutation.isPending}
      />

      <View className="mt-6">
        <Button label="Sign out" variant="secondary" onPress={() => signOut()} />
      </View>
    </Screen>
  );
}
