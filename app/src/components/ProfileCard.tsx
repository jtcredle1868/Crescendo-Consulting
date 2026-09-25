import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import type { User } from "@/api/types";
import { roleLabel } from "@/constants/roles";
import { VerificationBadge, Pill } from "@/components/Badge";

export function ProfileCard({ user }: { user: User }) {
  const profile = user.profile;
  return (
    <Pressable
      onPress={() => router.push(`/profile/${user.id}`)}
      className="bg-white border border-ink-100 rounded-2xl p-4 mb-3"
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-lg font-semibold text-ink-900">{profile?.displayName ?? user.email}</Text>
          <Text className="text-sm text-ink-600 mt-0.5">
            {roleLabel(user.role)}
            {profile?.city ? ` · ${profile.city}${profile.state ? `, ${profile.state}` : ""}` : ""}
          </Text>
          {profile?.headline ? (
            <Text className="text-sm text-ink-800 mt-2">{profile.headline}</Text>
          ) : null}
        </View>
        <VerificationBadge status={user.verificationStatus} />
      </View>

      {profile?.genres?.length || profile?.skills?.length ? (
        <View className="flex-row flex-wrap mt-3">
          {[...(profile?.genres ?? []), ...(profile?.skills ?? [])].slice(0, 5).map((tag) => (
            <Pill key={tag} label={tag} />
          ))}
        </View>
      ) : null}
    </Pressable>
  );
}
