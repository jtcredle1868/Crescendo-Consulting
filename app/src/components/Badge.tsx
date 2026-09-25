import { Text, View } from "react-native";
import type { VerificationStatus } from "@/constants/roles";

const styles: Record<VerificationStatus, { bg: string; text: string; label: string }> = {
  VERIFIED: { bg: "bg-emerald-100", text: "text-emerald-800", label: "Verified" },
  PENDING: { bg: "bg-amber-100", text: "text-amber-800", label: "Verification pending" },
  REJECTED: { bg: "bg-red-100", text: "text-red-800", label: "Verification rejected" },
  UNVERIFIED: { bg: "bg-ink-100", text: "text-ink-600", label: "Not verified" },
};

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  const s = styles[status];
  return (
    <View className={`px-2.5 py-1 rounded-full self-start ${s.bg}`}>
      <Text className={`text-xs font-medium ${s.text}`}>{s.label}</Text>
    </View>
  );
}

export function Pill({ label }: { label: string }) {
  return (
    <View className="px-2.5 py-1 rounded-full bg-brand-50 mr-1.5 mb-1.5">
      <Text className="text-xs font-medium text-brand-700">{label}</Text>
    </View>
  );
}
