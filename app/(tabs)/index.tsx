import { View } from "react-native";
import Button from "@/components/ui/button";
import Color from "@/components/ui/color";
import { useState } from "react";

// noinspection JSUnusedGlobalSymbols
export default function HomeScreen() {
  const [color, setColor] = useState<string>("rgb(43, 127, 255)");
  return (
    <View className="flex-1 items-center justify-center  gap-4">
      <Button
        title="Hello"
        onPress={() => {
          alert("Hi!");
        }}
      />
      <Color color={color} setColor={setColor} />
    </View>
  );
}
