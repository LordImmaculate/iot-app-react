import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Lightbulb, LightbulbOff } from "lucide-react-native";
import Button from "@/components/ui/button";
import { useMqtt } from "@/components/providers/mqtt-context";

type Props = {
  topic: string;
  name: string;
};

export default function RgbLed({ topic, name }: Props) {
  const [status, setStatus] = useState<boolean>(false);
  const mqtt = useMqtt();

  useEffect(() => {
    mqtt.subscribe(`${topic}/status`);

    function handleMessage(thisTopic: string, payload: Buffer) {
      if (thisTopic === `${topic}/status`) {
        setStatus(payload.toString() === "ON");
      }
    }

    mqtt.on("message", handleMessage);

    return () => {
      mqtt.off("message", handleMessage);
      mqtt.unsubscribe(`${topic}/status`);
    };
  }, [mqtt, topic]);

  return (
    <View className="flex flex-row items-center gap-4">
      <Button
        className="flex flex-row items-center gap-2"
        onPress={() => mqtt.publish(`${topic}/set`, status ? "OFF" : "ON")}
      >
        <Text className="text-white">{name}</Text>
        <View className="bg-white rounded-full p-2">
          {status ? (
            <Lightbulb color="black" />
          ) : (
            <LightbulbOff color="black" />
          )}
        </View>
      </Button>
    </View>
  );
}
