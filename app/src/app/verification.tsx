import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/TextField";
import { Button } from "@/components/Button";
import { VerificationBadge } from "@/components/Badge";
import { submitVerification, listMyVerificationRequests } from "@/api/verification";
import { apiErrorMessage } from "@/api/client";
import { useAuthStore } from "@/state/authStore";
import type { VerificationDocumentType } from "@/api/types";

const DOC_TYPES: { value: VerificationDocumentType; label: string }[] = [
  { value: "GOVERNMENT_ID", label: "Government ID" },
  { value: "BUSINESS_LICENSE", label: "Business license" },
  { value: "TAX_DOCUMENT", label: "Tax document" },
  { value: "PORTFOLIO_PROOF", label: "Portfolio / press proof" },
];

export default function VerificationScreen() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [docType, setDocType] = useState<VerificationDocumentType>("GOVERNMENT_ID");
  const [fileUrl, setFileUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data: requests } = useQuery({
    queryKey: ["verification-requests"],
    queryFn: listMyVerificationRequests,
  });

  const mutation = useMutation({
    mutationFn: () => submitVerification({ documents: [{ type: docType, fileUrl: fileUrl.trim() }], notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["verification-requests"] });
      setFileUrl("");
      setNotes("");
    },
    onError: (err) => setError(apiErrorMessage(err)),
  });

  return (
    <Screen>
      <Text className="text-2xl font-bold text-ink-900 mb-1">Verify your account</Text>
      <Text className="text-sm text-ink-600 mb-5">
        Verification helps everyone trust who they&apos;re connecting with before agreeing to meet or work
        together. Upload a document and a Crescendo admin will review it — most requests are reviewed
        within 1-2 business days.
      </Text>

      {user ? (
        <View className="mb-5">
          <VerificationBadge status={user.verificationStatus} />
        </View>
      ) : null}

      <Text className="text-sm font-medium text-ink-800 mb-2">Document type</Text>
      <View className="flex-row flex-wrap mb-3 -mx-1">
        {DOC_TYPES.map((option) => {
          const selected = docType === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => setDocType(option.value)}
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

      <TextField
        label="Document link"
        value={fileUrl}
        onChangeText={setFileUrl}
        placeholder="https://..."
        autoCapitalize="none"
      />
      <Text className="text-xs text-ink-600 -mt-3 mb-4">
        Upload your document to a secure file host (Google Drive, Dropbox, etc.) with link sharing on,
        and paste the link here for review.
      </Text>
      <TextField label="Notes for the reviewer (optional)" value={notes} onChangeText={setNotes} />

      {error ? <Text className="text-sm text-red-600 mb-3">{error}</Text> : null}

      <Button
        label="Submit for review"
        onPress={() => mutation.mutate()}
        loading={mutation.isPending}
        disabled={!fileUrl.trim()}
      />

      {requests && requests.length > 0 ? (
        <View className="mt-8">
          <Text className="text-base font-semibold text-ink-900 mb-2">Your submissions</Text>
          {requests.map((req) => (
            <View key={req.id} className="bg-white border border-ink-100 rounded-xl p-3 mb-2">
              <Text className="text-sm text-ink-900">{new Date(req.submittedAt).toLocaleDateString()}</Text>
              <VerificationBadge status={req.status} />
              {req.notes ? <Text className="text-xs text-ink-600 mt-1">{req.notes}</Text> : null}
            </View>
          ))}
        </View>
      ) : null}

      <View className="mt-8">
        <Button label="Skip for now" variant="secondary" onPress={() => router.replace("/(tabs)")} />
      </View>
    </Screen>
  );
}
