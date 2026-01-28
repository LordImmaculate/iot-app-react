import { TouchableOpacity, Text } from "react-native";
import { cn } from "@/lib/cn";

type Props = {
  label?: string;
  onPress?: () => void;
  className?: string;
};

export default function Button({ label, onPress, className }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={cn(className, "bg-blue-500 rounded-2xl p-4")}
    >
      <Text className="text-white">{label}</Text>
    </TouchableOpacity>
  );
}
