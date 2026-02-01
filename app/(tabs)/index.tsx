import { View } from "react-native";
import RgbLed from "@/components/rgb-led";
import { Snackbar } from "react-native-paper";
import { useEffect, useState } from "react";
import Led from "@/components/led";
import { useMqtt } from "@/components/providers/mqtt-context";

// noinspection JSUnusedGlobalSymbols
export default function HomeScreen() {
  const mqtt = useMqtt();
  const [status, setStatus] = useState<string>("Disconnected");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    mqtt.on("connect", () => {
      setStatus("Connected");
      setTimeout(() => setVisible(false), 3000);
    });

    mqtt.on("disconnect", () => {
      setVisible(true);
      setStatus("Disconnected");
    });
  }, [mqtt]);

  return (
    <View className="flex-1 items-center justify-center  gap-4">
      <RgbLed topic="iot/led1" name="RGB Led" />
      <Led topic="iot/led1" name="Led" />
      <Snackbar
        visible={visible}
        onDismiss={() => {
          setVisible(false);
        }}
        duration={Infinity}
      >
        {status}
      </Snackbar>
    </View>
  );
}
