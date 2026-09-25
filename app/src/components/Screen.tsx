import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function Screen({ children, scroll = true }: { children: ReactNode; scroll?: boolean }) {
  const Container = scroll ? ScrollView : View;
  return (
    <SafeAreaView className="flex-1 bg-ink-50" edges={["top", "bottom"]}>
      <Container
        className="flex-1"
        contentContainerClassName={scroll ? "px-5 py-6 pb-10" : undefined}
        style={!scroll ? { flex: 1, padding: 20 } : undefined}
      >
        {children}
      </Container>
    </SafeAreaView>
  );
}
