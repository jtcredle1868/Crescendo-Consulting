import { Text, TextInput, View, type TextInputProps } from "react-native";

interface TextFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export function TextField({ label, error, ...inputProps }: TextFieldProps) {
  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-ink-800 mb-1.5">{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor="#94a3b8"
        className={`border rounded-xl px-4 py-3 text-base text-ink-900 bg-white ${
          error ? "border-red-500" : "border-ink-100"
        }`}
        {...inputProps}
      />
      {error ? <Text className="text-xs text-red-600 mt-1">{error}</Text> : null}
    </View>
  );
}
