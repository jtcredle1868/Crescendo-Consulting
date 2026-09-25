import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Screen } from "@/components/Screen";
import { VerificationBadge } from "@/components/Badge";
import { listConnections } from "@/api/connections";
import { useAuthStore } from "@/state/authStore";
import { roleLabel } from "@/constants/roles";

const statusStyles: Record<string, string> = {
  PENDING: "text-amber-700",
  ACCEPTED: "text-emerald-700",
  DECLINED: "text-red-700",
  BLOCKED: "text-red-700",
};

export default function ConnectionsScreen() {
  const currentUserId = useAuthStore((s) => s.user?.id);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["connections"],
    queryFn: () => listConnections(),
  });

  return (
    <Screen>
      <Text className="text-2xl font-bold text-ink-900 mb-1">Connections</Text>
      <Text className="text-sm text-ink-600 mb-4">
        Requests you&apos;ve sent and received. Accept one to start messaging and plan a meetup.
      </Text>

      {isLoading ? (
        <ActivityIndicator className="mt-8" />
      ) : isError ? (
        <Text className="text-red-600">Couldn&apos;t load connections.</Text>
      ) : data && data.length > 0 ? (
        data.map((connection) => {
          const isRequester = connection.requesterId === currentUserId;
          const other = isRequester ? connection.recipient : connection.requester;
          return (
            <Pressable
              key={connection.id}
              onPress={() => router.push(`/connections/${connection.id}`)}
              className="bg-white border border-ink-100 rounded-2xl p-4 mb-3"
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-base font-semibold text-ink-900">
                    {other?.profile?.displayName ?? other?.email}
                  </Text>
                  <Text className="text-sm text-ink-600 mt-0.5">
                    {other ? roleLabel(other.role) : ""} ·{" "}
                    <Text className={statusStyles[connection.status]}>{connection.status.toLowerCase()}</Text>
                  </Text>
                </View>
                {other ? <VerificationBadge status={other.verificationStatus} /> : null}
              </View>
              {connection.message ? (
                <Text className="text-sm text-ink-700 mt-2">&quot;{connection.message}&quot;</Text>
              ) : null}
            </Pressable>
          );
        })
      ) : (
        <Text className="text-ink-600 mt-8 text-center">
          No connections yet. Head to Discover to reach out to someone.
        </Text>
      )}
    </Screen>
  );
}
