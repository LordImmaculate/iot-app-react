import { TextInput } from "react-native";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Props = ComponentProps<typeof TextInput>;

export default function Input({ className }: Props) {
  return (
    <TextInput
      className={cn(
        className,
        "border-2 border-blue-500 rounded-2xl p-4 min-w-20 dark:text-white"
      )}
    />
  );
}
