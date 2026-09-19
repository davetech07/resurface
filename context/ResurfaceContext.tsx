import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { Text, View } from "react-native";
import { setupNotifications } from "../services/notifications";
import { ResurfaceService } from "../services/resurfaceService";
import { SQLiteItemRepository } from "../services/sqliteItemRepository";

const ResurfaceContext = createContext<ResurfaceService | null>(null);

export function ResurfaceProvider({ children }: { children: ReactNode }) {
  const [service, setService] = useState<ResurfaceService | null>(null);

  useEffect(() => {
    async function init() {
      const repo = await SQLiteItemRepository.init();
      setService(new ResurfaceService(repo));
      await setupNotifications(); // ask for permission once, at app start
    }
    init();
  }, []);

  if (!service) {
    // Nothing can use the database until this finishes — show a simple
    // loading state instead of letting any screen render and try to
    // call a service that doesn't exist yet.
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ResurfaceContext.Provider value={service}>
      {children}
    </ResurfaceContext.Provider>
  );
}

export function useResurfaceService(): ResurfaceService {
  const service = useContext(ResurfaceContext);
  if (!service) {
    throw new Error(
      "useResurfaceService must be used inside ResurfaceProvider",
    );
  }
  return service;
}
