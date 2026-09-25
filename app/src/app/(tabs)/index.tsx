import { useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Screen } from "@/components/Screen";
import { ProfileCard } from "@/components/ProfileCard";
import { searchProfiles } from "@/api/profiles";
import { SELECTABLE_ROLES, type UserRole } from "@/constants/roles";

export default function DiscoverScreen() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [role, setRole] = useState<UserRole | undefined>(undefined);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["profiles", { q, city, role }],
    queryFn: () => searchProfiles({ q: q || undefined, city: city || undefined, role }),
  });

  return (
    <Screen>
      <Text className="text-2xl font-bold text-ink-900 mb-1">Discover</Text>
      <Text className="text-sm text-ink-600 mb-4">
        Find musicians, producers, technicians, venues, and services.
      </Text>

      <TextInput
        value={q}
        onChangeText={setQ}
        onSubmitEditing={() => refetch()}
        placeholder="Search name, headline, bio..."
        placeholderTextColor="#94a3b8"
        className="border border-ink-100 bg-white rounded-xl px-4 py-3 mb-2"
      />
      <TextInput
        value={city}
        onChangeText={setCity}
        onSubmitEditing={() => refetch()}
        placeholder="City"
        placeholderTextColor="#94a3b8"
        className="border border-ink-100 bg-white rounded-xl px-4 py-3 mb-3"
      />

      <View className="flex-row flex-wrap mb-3 -mx-1">
        <Pressable
          onPress={() => setRole(undefined)}
          className={`m-1 px-3 py-2 rounded-full border ${
            !role ? "bg-brand-600 border-brand-600" : "bg-white border-ink-100"
          }`}
        >
          <Text className={`text-xs font-medium ${!role ? "text-white" : "text-ink-800"}`}>All</Text>
        </Pressable>
        {SELECTABLE_ROLES.map((option) => {
          const selected = role === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => setRole(option.value)}
              className={`m-1 px-3 py-2 rounded-full border ${
                selected ? "bg-brand-600 border-brand-600" : "bg-white border-ink-100"
              }`}
            >
              <Text className={`text-xs font-medium ${selected ? "text-white" : "text-ink-800"}`}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {isLoading ? (
        <ActivityIndicator className="mt-8" />
      ) : isError ? (
        <Text className="text-red-600 mt-4">Couldn&apos;t load profiles. Pull to try again.</Text>
      ) : data && data.results.length > 0 ? (
        <View className="flex-1">
          {isFetching ? <ActivityIndicator className="mb-2" /> : null}
          {data.results.map((user) => (
            <ProfileCard key={user.id} user={user} />
          ))}
        </View>
      ) : (
        <Text className="text-ink-600 mt-8 text-center">No matches yet. Try a different search.</Text>
      )}
    </Screen>
  );
}
