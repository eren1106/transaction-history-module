import { Redirect, Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="(protected)"
          options={{
            headerShown: false
          }}
        />
      </Stack>
      <Redirect href="/login" />
    </>
  );
}
