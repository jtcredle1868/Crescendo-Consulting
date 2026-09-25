import { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Screen } from "@/components/Screen";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import { VerificationBadge } from "@/components/Badge";
import { getConnection, listMessages, sendMessage, respondToConnection } from "@/api/connections";
import { listMeetingSpaces } from "@/api/meetingSpaces";
import { listMeetings, proposeMeeting, respondToMeeting } from "@/api/meetings";
import { apiErrorMessage } from "@/api/client";
import { useAuthStore } from "@/state/authStore";
import { roleLabel } from "@/constants/roles";

export default function ConnectionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const currentUserId = useAuthStore((s) => s.user?.id);
  const queryClient = useQueryClient();

  const { data: connection, isLoading } = useQuery({
    queryKey: ["connection", id],
    queryFn: () => getConnection(id),
    enabled: !!id,
  });

  const other = useMemo(() => {
    if (!connection || !currentUserId) return undefined;
    return connection.requesterId === currentUserId ? connection.recipient : connection.requester;
  }, [connection, currentUserId]);

  const isAccepted = connection?.status === "ACCEPTED";
  const isRecipient = connection?.recipientId === currentUserId;

  const respondMutation = useMutation({
    mutationFn: (status: "ACCEPTED" | "DECLINED") => respondToConnection(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connection", id] });
      queryClient.invalidateQueries({ queryKey: ["connections"] });
    },
  });

  const { data: messages } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => listMessages(id),
    enabled: isAccepted,
    refetchInterval: isAccepted ? 4000 : false,
  });

  const [draft, setDraft] = useState("");
  const sendMutation = useMutation({
    mutationFn: () => sendMessage(id, draft.trim()),
    onSuccess: () => {
      setDraft("");
      queryClient.invalidateQueries({ queryKey: ["messages", id] });
    },
  });

  const { data: spaces } = useQuery({
    queryKey: ["meeting-spaces", other?.profile?.city],
    queryFn: () => listMeetingSpaces(other?.profile?.city ?? undefined),
    enabled: isAccepted,
  });

  const { data: meetings } = useQuery({
    queryKey: ["meetings", id],
    queryFn: () => listMeetings(id),
    enabled: isAccepted,
  });

  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const [proposedTime, setProposedTime] = useState("");
  const [meetingError, setMeetingError] = useState<string | null>(null);

  const proposeMutation = useMutation({
    mutationFn: () => {
      if (!selectedSpaceId) throw new Error("Choose a meeting space first");
      const date = new Date(proposedTime);
      if (Number.isNaN(date.getTime())) throw new Error("Enter a valid date, e.g. 2026-10-05 18:00");
      return proposeMeeting({ connectionId: id, meetingSpaceId: selectedSpaceId, proposedTime: date.toISOString() });
    },
    onSuccess: () => {
      setProposedTime("");
      setSelectedSpaceId(null);
      setMeetingError(null);
      queryClient.invalidateQueries({ queryKey: ["meetings", id] });
    },
    onError: (err) => setMeetingError(apiErrorMessage(err)),
  });

  const meetingRespondMutation = useMutation({
    mutationFn: ({ meetingId, status }: { meetingId: string; status: "ACCEPTED" | "DECLINED" | "CANCELLED" }) =>
      respondToMeeting(meetingId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["meetings", id] }),
  });

  if (isLoading || !connection) {
    return (
      <Screen>
        <ActivityIndicator className="mt-8" />
      </Screen>
    );
  }

  return (
    <Screen>
      <Text className="text-xl font-bold text-ink-900">{other?.profile?.displayName ?? other?.email}</Text>
      <View className="flex-row items-center mt-1 mb-4">
        <Text className="text-sm text-ink-600 mr-2">{other ? roleLabel(other.role) : ""}</Text>
        {other ? <VerificationBadge status={other.verificationStatus} /> : null}
      </View>

      {connection.status === "PENDING" && isRecipient ? (
        <View className="flex-row gap-2 mb-6">
          <View className="flex-1">
            <Button label="Accept" onPress={() => respondMutation.mutate("ACCEPTED")} />
          </View>
          <View className="flex-1">
            <Button label="Decline" variant="danger" onPress={() => respondMutation.mutate("DECLINED")} />
          </View>
        </View>
      ) : null}

      {connection.status === "PENDING" && !isRecipient ? (
        <Text className="text-sm text-ink-600 mb-6">Waiting for them to accept your request.</Text>
      ) : null}

      {isAccepted ? (
        <>
          <View className="mb-6">
            <Text className="text-base font-semibold text-ink-900 mb-2">Messages</Text>
            <View className="bg-white border border-ink-100 rounded-2xl p-3 mb-2">
              {messages && messages.length > 0 ? (
                messages.map((m) => (
                  <View
                    key={m.id}
                    className={`mb-2 max-w-[85%] rounded-xl px-3 py-2 ${
                      m.senderId === currentUserId ? "self-end bg-brand-600" : "self-start bg-ink-100"
                    }`}
                  >
                    <Text className={m.senderId === currentUserId ? "text-white" : "text-ink-900"}>{m.body}</Text>
                  </View>
                ))
              ) : (
                <Text className="text-sm text-ink-600">Say hello to get things started.</Text>
              )}
            </View>
            <View className="flex-row gap-2 items-end">
              <View className="flex-1">
                <TextField label="" value={draft} onChangeText={setDraft} placeholder="Type a message" />
              </View>
              <View className="mb-4">
                <Button label="Send" onPress={() => sendMutation.mutate()} disabled={!draft.trim()} loading={sendMutation.isPending} />
              </View>
            </View>
          </View>

          <View className="border-t border-ink-100 pt-4">
            <Text className="text-base font-semibold text-ink-900 mb-1">Meet in person, safely</Text>
            <Text className="text-sm text-ink-600 mb-3">
              Once you&apos;re ready, propose meeting at a public, neutral space instead of a private address.
            </Text>

            {spaces && spaces.length > 0 ? (
              <View className="flex-row flex-wrap mb-3 -mx-1">
                {spaces.map((space) => {
                  const selected = selectedSpaceId === space.id;
                  return (
                    <Pressable
                      key={space.id}
                      onPress={() => setSelectedSpaceId(space.id)}
                      className={`m-1 px-3 py-2 rounded-xl border ${
                        selected ? "bg-brand-600 border-brand-600" : "bg-white border-ink-100"
                      }`}
                    >
                      <Text className={`text-xs font-semibold ${selected ? "text-white" : "text-ink-900"}`}>
                        {space.name}
                      </Text>
                      <Text className={`text-xs ${selected ? "text-white" : "text-ink-600"}`}>{space.address}</Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : (
              <Text className="text-sm text-ink-600 mb-3">
                No neutral spaces listed for this city yet — an admin can add one.
              </Text>
            )}

            <TextField
              label="Proposed date & time"
              value={proposedTime}
              onChangeText={setProposedTime}
              placeholder="2026-10-05 18:00"
            />
            {meetingError ? <Text className="text-sm text-red-600 mb-3">{meetingError}</Text> : null}
            <Button
              label="Propose meetup"
              onPress={() => proposeMutation.mutate()}
              loading={proposeMutation.isPending}
              disabled={!selectedSpaceId || !proposedTime}
            />

            {meetings && meetings.length > 0 ? (
              <View className="mt-4">
                {meetings.map((meeting) => (
                  <View key={meeting.id} className="bg-white border border-ink-100 rounded-xl p-3 mb-2">
                    <Text className="text-sm font-semibold text-ink-900">{meeting.meetingSpace.name}</Text>
                    <Text className="text-xs text-ink-600">
                      {meeting.meetingSpace.address}, {meeting.meetingSpace.city}
                    </Text>
                    <Text className="text-xs text-ink-600 mt-1">
                      {new Date(meeting.proposedTime).toLocaleString()} · {meeting.status.toLowerCase()}
                    </Text>
                    {meeting.status === "PROPOSED" && meeting.proposedById !== currentUserId ? (
                      <View className="flex-row gap-2 mt-2">
                        <View className="flex-1">
                          <Button
                            label="Accept"
                            onPress={() => meetingRespondMutation.mutate({ meetingId: meeting.id, status: "ACCEPTED" })}
                          />
                        </View>
                        <View className="flex-1">
                          <Button
                            label="Decline"
                            variant="danger"
                            onPress={() => meetingRespondMutation.mutate({ meetingId: meeting.id, status: "DECLINED" })}
                          />
                        </View>
                      </View>
                    ) : null}
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        </>
      ) : null}
    </Screen>
  );
}
