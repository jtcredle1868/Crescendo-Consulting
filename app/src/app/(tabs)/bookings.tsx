import { ActivityIndicator, Text, View } from "react-native";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Screen } from "@/components/Screen";
import { Button } from "@/components/Button";
import { listMyBookings, updateBookingStatus } from "@/api/bookings";
import { useAuthStore } from "@/state/authStore";
import type { BookingStatus } from "@/api/types";

const statusColor: Record<BookingStatus, string> = {
  REQUESTED: "text-amber-700",
  CONFIRMED: "text-emerald-700",
  DECLINED: "text-red-700",
  CANCELLED: "text-ink-600",
  COMPLETED: "text-brand-700",
};

export default function BookingsScreen() {
  const currentUserId = useAuthStore((s) => s.user?.id);
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({ queryKey: ["bookings"], queryFn: listMyBookings });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) => updateBookingStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookings"] }),
  });

  return (
    <Screen>
      <Text className="text-2xl font-bold text-ink-900 mb-1">Bookings</Text>
      <Text className="text-sm text-ink-600 mb-4">Session and gig requests you&apos;ve sent or received.</Text>

      {isLoading ? (
        <ActivityIndicator className="mt-8" />
      ) : isError ? (
        <Text className="text-red-600">Couldn&apos;t load bookings.</Text>
      ) : data && data.length > 0 ? (
        data.map((booking) => {
          const isProvider = booking.providerId === currentUserId;
          const other = isProvider ? booking.client : booking.provider;
          return (
            <View key={booking.id} className="bg-white border border-ink-100 rounded-2xl p-4 mb-3">
              <Text className="text-base font-semibold text-ink-900">{booking.title}</Text>
              <Text className="text-sm text-ink-600 mt-0.5">
                {isProvider ? "Client" : "Provider"}: {other?.profile?.displayName ?? other?.email}
              </Text>
              <Text className="text-sm text-ink-600 mt-0.5">
                {new Date(booking.startTime).toLocaleString()} — {new Date(booking.endTime).toLocaleTimeString()}
              </Text>
              {booking.rate ? <Text className="text-sm text-ink-600 mt-0.5">Rate: ${booking.rate}</Text> : null}
              {booking.meetingSpace ? (
                <Text className="text-sm text-ink-600 mt-0.5">
                  📍 {booking.meetingSpace.name}, {booking.meetingSpace.city}
                </Text>
              ) : null}
              <Text className={`text-sm font-medium mt-2 ${statusColor[booking.status]}`}>
                {booking.status.toLowerCase()}
              </Text>

              {isProvider && booking.status === "REQUESTED" ? (
                <View className="flex-row gap-2 mt-3">
                  <View className="flex-1">
                    <Button
                      label="Confirm"
                      onPress={() => mutation.mutate({ id: booking.id, status: "CONFIRMED" })}
                    />
                  </View>
                  <View className="flex-1">
                    <Button
                      label="Decline"
                      variant="danger"
                      onPress={() => mutation.mutate({ id: booking.id, status: "DECLINED" })}
                    />
                  </View>
                </View>
              ) : null}
            </View>
          );
        })
      ) : (
        <Text className="text-ink-600 mt-8 text-center">
          No bookings yet. Connect with someone and propose a booking from their profile.
        </Text>
      )}
    </Screen>
  );
}
