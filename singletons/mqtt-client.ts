import mqtt from "mqtt";

const mqttClient = mqtt.connect("wss://mqtt.lordimmaculate.dev:443/mqtt");

let retries = 0;

mqttClient.connect();

mqttClient.on("disconnect", () => {
  while (retries < 5) {
    retries++;
    setTimeout(() => mqttClient.reconnect(), 1000);
  }
});

mqttClient.on("error", console.error);

export default mqttClient;
