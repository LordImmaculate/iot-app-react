import React, {
  cloneElement,
  isValidElement,
  ReactElement,
  useState
} from "react";
import { Modal, Text, View } from "react-native";

import ColorPicker, {
  Panel1,
  Swatches,
  Preview,
  HueSlider
} from "reanimated-color-picker";
import Button from "@/components/ui/button";

type Props = {
  color: string;
  setColor: (color: string) => void;
  children?: React.ReactNode;
};
export default function Color({ color, setColor, children }: Props) {
  const [showModal, setShowModal] = useState(false);
  let currentColor = color;

  // Note: use `onCompleteJS` and `onChangeJS` for non-worklet functions
  const onSelectColor = ({ rgb }: { rgb: string }) => {
    currentColor = rgb;
  };

  if (!isValidElement(children))
    throw new Error("Color component must have 1 valid child element.");

  // @ts-ignore
  const originalOnPress = children.props.onPress;

  // noinspection JSUnusedGlobalSymbols
  const child = cloneElement(
    children as ReactElement<{ onPress?: () => void }>,
    {
      onPress: () => {
        setShowModal(true);
        if (typeof originalOnPress == "function") originalOnPress();
      }
    }
  );

  return (
    <View>
      {child || (
        <Button onPress={() => setShowModal(true)}>
          <Text className="text-white">Select Color</Text>
        </Button>
      )}

      <Modal visible={showModal} animationType="slide">
        <View className="flex-1 justify-center h-full p-4 gap-4 dark:bg-gray-800">
          <Text className="text-2xl font-bold text-white text-center">
            Select a Color
          </Text>
          <ColorPicker
            value={color}
            onCompleteJS={onSelectColor}
            boundedThumb
            thumbShape="circle"
          >
            <View className="gap-4 dark:bg-gray-800">
              <Preview colorFormat="rgb" style={{ borderRadius: 10 }} />
              <Panel1 style={{ borderRadius: 10 }} />
              <HueSlider style={{ borderRadius: 10 }} />
              <Swatches
                colors={[
                  "red",
                  "green",
                  "blue",
                  "rgb(43, 127, 255)",
                  "white",
                  "black"
                ]}
                swatchStyle={{ borderColor: "white", borderWidth: 1 }}
              />
              <Button
                onPress={() => {
                  setShowModal(false);
                  setColor(currentColor);
                }}
              >
                <Text className="text-white">Ok</Text>
              </Button>
            </View>
          </ColorPicker>
        </View>
      </Modal>
    </View>
  );
}
