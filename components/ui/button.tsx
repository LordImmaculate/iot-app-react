import { TouchableOpacity } from "react-native";
import { cn } from "@/lib/cn";

type Props = {
  onPress?: () => void;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
};

export default function Button({
  onPress,
  className,
  children,
  disabled
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={cn(className, "bg-blue-500 rounded-2xl p-4")}
      disabled={disabled}
    >
      {children}
    </TouchableOpacity>
  );
}
