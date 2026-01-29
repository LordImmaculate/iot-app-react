import { useState, useEffect, useRef, useCallback } from "react";
import mqtt, { MqttClient, IClientOptions } from "mqtt";

interface MqttHookReturn {
  status: "Connected" | "Disconnected" | "Connecting" | "Error";

  messages: Record<string, string>;

  sendMessage: (topic: string, payload: string) => void;
}

type Props = {
  brokerUrl: string;
  options?: IClientOptions;
  subscriptions?: string[];
};

export function useMqtt({
  brokerUrl,
  options,
  subscriptions = []
}: Props): MqttHookReturn {
  const [status, setStatus] =
    useState<MqttHookReturn["status"]>("Disconnected");
  const [messages, setMessages] = useState<MqttHookReturn["messages"]>({});

  // Use a Ref to hold the client so it doesn't trigger re-renders
  const clientRef = useRef<MqttClient | null>(null);

  useEffect(() => {
    setStatus("Connecting");
    const client = mqtt.connect(brokerUrl, options);
    clientRef.current = client;

    client.on("connect", () => {
      setStatus("Connected");
      subscriptions.forEach((topic) => client.subscribe(topic));
    });

    client.on("message", (topic, payload) => {
      setMessages((prev) => ({
        ...prev,
        [topic]: payload.toString() // This overwrites the old value for this topic
      }));
    });

    client.on("error", () => {
      setStatus("Error");
    });

    client.on("close", () => {
      setStatus("Disconnected");
    });

    // CLEANUP: This is vital. It closes the connection when the component unmounts.
    return () => {
      if (clientRef.current) {
        clientRef.current.end();
      }
    };
  }, [brokerUrl]); // Only reconnect if the URL changes

  // Use useCallback so these functions have a stable identity
  const sendMessage = useCallback((topic: string, payload: string) => {
    clientRef.current?.publish(topic, payload);
  }, []);

  return { status, messages, sendMessage };
}
