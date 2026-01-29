import { View, Text } from "react-native";
import Button from "@/components/ui/button";
import Color from "@/components/ui/color";
import { useState } from "react";
import Input from "@/components/ui/input";
import { useMqtt } from "@/hooks/use-mqtt";

// noinspection JSUnusedGlobalSymbols
export default function HomeScreen() {
  const [color, setColor] = useState<string>("rgb(43, 127, 255)");
  const { status, messages, sendMessage } = useMqtt({
    brokerUrl: "ws://test.mosquitto.org:8080/mqtt",
    subscriptions: ["babeerbabeer"]
  });

  return (
    <View className="flex-1 items-center justify-center  gap-4">
      <Text className="text-white">{status}</Text>
      {Object.entries(messages).map(([topic, payload]) => (
        <Text className="text-white" key={topic}>
          {payload}
        </Text>
      ))}

      <Color color={color} setColor={setColor} />
      <Button
        title="Turn Light On"
        onPress={() => sendMessage("babeerbabeer", "OFF BABEER")}
      />
      <Input />
    </View>
  );
}
