import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "./globals.css";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MqttProvider } from "@/components/providers/mqtt-context";

export const unstable_settings = {
  anchor: "(tabs)"
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <MqttProvider brokerUrl="ws://192.168.1.2:9001/mqtt">
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
          </Stack>
          <StatusBar style="auto" />
        </GestureHandlerRootView>
      </MqttProvider>
    </ThemeProvider>
  );
}
