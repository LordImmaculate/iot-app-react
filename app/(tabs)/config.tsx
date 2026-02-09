import React, { useState } from "react";
import {
  Text,
  View,
  FlatList,
  Platform,
  PermissionsAndroid,
  TextInput,
  Alert
} from "react-native";
import { BleManager, Device } from "react-native-ble-plx";
import { Buffer } from "buffer";
import Button from "@/components/ui/button";

const manager = new BleManager();

// MUST match your ESP32 code exactly
const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

export default function Config() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [connectingId, setConnectingId] = useState<string | null>(null);

  const requestPermissions = async () => {
    if (Platform.OS === "android" && Platform.Version >= 31) {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ]);
      return result["android.permission.BLUETOOTH_SCAN"] === "granted";
    }
    return true;
  };

  const startScan = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setIsScanning(true);
    setDevices([]);

    await manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        setIsScanning(false);
        return;
      }
      if (device && (device.name || device.localName)) {
        setDevices((prev) => {
          if (!prev.find((d) => d.id === device.id)) return [...prev, device];
          return prev;
        });
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      setIsScanning(false);
    }, 5000);
  };

  const connectAndProvision = async (device: Device) => {
    if (!ssid || !password) {
      Alert.alert("Error", "Please enter WiFi SSID and Password first.");
      return;
    }

    try {
      setConnectingId(device.id);
      console.log("Connecting to", device.id);

      // 1. Connect
      const connectedDevice = await device.connect();

      // 2. Discover services and characteristics
      await connectedDevice.discoverAllServicesAndCharacteristics();

      // 3. Prepare data (format: "ssid,password")
      const provisionData = `${ssid},${password}`;
      const base64Data = Buffer.from(provisionData).toString("base64");

      // 4. Write to ESP32
      await connectedDevice.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        base64Data
      );

      Alert.alert("Success", "Credentials sent! ESP32 is connecting to WiFi.");

      // 5. Cleanup
      await connectedDevice.cancelConnection();
    } catch (e: any) {
      console.log("Connection Error", e);
      Alert.alert("Connection Failed", e.message);
    } finally {
      setConnectingId(null);
    }
  };

  return (
    <View className="flex- p-6 pt-12">
      <Text className="text-2xl font-bold mb-4 dark:text-white">
        ESP32 WiFi Config
      </Text>

      {/* WiFi Inputs */}
      <View className="mb-6 space-y-2 gap-4">
        <TextInput
          placeholder="WiFi SSID"
          className="p-4 rounded-lg border border-slate-200 text-black dark:text-white"
          value={ssid}
          onChangeText={setSsid}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="WiFi Password"
          className="p-4 rounded-lg border border-slate-200 text-black dark:text-white"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <Button
        onPress={isScanning ? () => {} : startScan}
        className={`p-4 mb-5 rounded-xl items-center ${isScanning ? "bg-slate-400" : "bg-blue-600"}`}
      >
        <Text className="text-white font-semibold">
          {isScanning ? "Searching for ESP32..." : "Scan for Devices"}
        </Text>
      </Button>

      <FlatList
        className="mt-6"
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="p-4 mb-3 rounded-lg border border-slate-200 shadow-sm flex-row justify-between items-center">
            <View>
              <Text className="font-bold text-black dark:text-white">
                {item.name || "Unknown"}
              </Text>
              <Text className="text-xs text-slate-400">{item.id}</Text>
            </View>
            <Button
              onPress={() => connectAndProvision(item)}
              disabled={connectingId === item.id}
            >
              <Text className="text-white">
                {connectingId === item.id ? "..." : "Setup"}
              </Text>
            </Button>
          </View>
        )}
      />
    </View>
  );
}
