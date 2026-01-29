import React from "react";
import HomeScreen from "@/app/(tabs)/index";

export default function TabLayout() {
  // const colorScheme = useColorScheme();
  // return (
  //   <Tabs
  //     screenOptions={{
  //       tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
  //       headerShown: false,
  //       tabBarButton: HapticTab
  //     }}
  //   >
  //     <Tabs.Screen
  //       name="index"
  //       options={{
  //         title: "Home",
  //         tabBarIcon: ({ color }) => (
  //           <IconSymbol size={28} name="house.fill" color={color} />
  //         )
  //       }}
  //     />
  //   </Tabs>
  // );

  return <HomeScreen />;
}
