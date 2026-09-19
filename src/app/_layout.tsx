import { Stack } from "expo-router";
import { ResurfaceProvider } from "../../context/ResurfaceContext";

export default function RootLayout() {
  return (
    <ResurfaceProvider>
      <Stack />
    </ResurfaceProvider>
  );
}
