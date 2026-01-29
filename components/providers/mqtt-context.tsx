import React, { createContext, useContext } from "react";
import { useMqtt } from "@/hooks/use-mqtt";

const MqttContext = createContext<ReturnType<typeof useMqtt>>({
  status: "Disconnected",
  messages: {},
  sendMessage: () => {}
});

export const MqttProvider = ({
  children,
  brokerUrl,
  options,
  subscriptions
}: Parameters<typeof useMqtt>[0] & { children: React.ReactNode }) => {
  // Call your hook ONCE here
  const mqttData = useMqtt({ brokerUrl, options, subscriptions });

  return (
    <MqttContext.Provider value={mqttData}>{children}</MqttContext.Provider>
  );
};

// Create a small helper hook to consume the context
export const useSharedMqtt = () => {
  const context = useContext(MqttContext);
  if (!context)
    throw new Error("useSharedMqtt must be used within MqttProvider");
  return context;
};
