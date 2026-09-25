import { Pressable, Text, ActivityIndicator } from "react-native";

interface ButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-brand-600 active:bg-brand-700",
  secondary: "bg-ink-100 active:bg-ink-200",
  danger: "bg-red-600 active:bg-red-700",
};

const variantTextStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "text-white",
  secondary: "text-ink-900",
  danger: "text-white",
};

export function Button({ label, onPress, loading, disabled, variant = "primary" }: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`rounded-xl px-5 py-3.5 items-center justify-center ${variantStyles[variant]} ${
        isDisabled ? "opacity-50" : ""
      }`}
    >
      {loading ? (
        <ActivityIndicator color={variant === "secondary" ? "#0f172a" : "#ffffff"} />
      ) : (
        <Text className={`font-semibold text-base ${variantTextStyles[variant]}`}>{label}</Text>
      )}
    </Pressable>
  );
}
