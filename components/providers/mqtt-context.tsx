import { createContext, useContext } from "react";
import mqttClient from "@/singletons/mqtt-client";

const MqttContext = createContext(mqttClient);

export default function MqttProvider({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <MqttContext.Provider value={mqttClient}>{children}</MqttContext.Provider>
  );
}

export const useMqtt = () => useContext(MqttContext);
export class useSharedMqtt {}
