import { useEffect, useState } from "react";
import { useMqtt } from "@/components/providers/mqtt-context";
import Color from "@/components/ui/color";
import { View, Text } from "react-native";
import { Lightbulb } from "lucide-react-native";
import Button from "@/components/ui/button";

type Props = {
  topic: string;
  name: string;
};

export default function RgbLed({ topic, name }: Props) {
  const [color, setColor] = useState<string>("rgb(43, 127, 255)");
  const mqtt = useMqtt();

  useEffect(() => {
    const fColor = color.match(/\d+/g)?.join(",") || "";
    mqtt.publish(`${topic}/set`, fColor);
  }, [color, mqtt, topic]);

  return (
    <View className="flex flex-row items-center gap-4">
      <Color color={color} setColor={setColor}>
        <Button className="flex flex-row items-center gap-2">
          <Text className="text-white">{name}</Text>
          <View className="bg-white rounded-full p-2">
            <Lightbulb color={color} />
          </View>
        </Button>
      </Color>
    </View>
  );
}
