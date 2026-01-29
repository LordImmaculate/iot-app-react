import { View } from "react-native";
import { useSharedMqtt } from "@/components/providers/mqtt-context";
import RgbLed from "@/components/rgb-led";
import { Snackbar } from "react-native-paper";
import { useEffect, useState } from "react";

// noinspection JSUnusedGlobalSymbols
export default function HomeScreen() {
  const { status } = useSharedMqtt();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (status !== "Connected") setVisible(true);
  }, [status]);

  return (
    <View className="flex-1 items-center justify-center  gap-4">
      <RgbLed topic="rgb-led" name="RGB Led" />
      <Snackbar
        visible={visible}
        onDismiss={() => {
          setVisible(false);
        }}
      >
        {status}
      </Snackbar>
    </View>
  );
}
