import { View } from "react-native";
import Button from "@/components/ui/button";

// noinspection JSUnusedGlobalSymbols
export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Button
        label="Hello"
        onPress={() => {
          alert("Hi!");
        }}
      />
    </View>
  );
}
