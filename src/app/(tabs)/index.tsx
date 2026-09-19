import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useResurfaceService } from "../../../context/ResurfaceContext";
import { SQLiteItemRepository } from "../../../services/sqliteItemRepository";
export default function Index() {
  const service = useResurfaceService();
  const [result, setResult] = useState("loading...");

  useEffect(() => {
    async function setup() {
      const repo = await SQLiteItemRepository.init();

      const items = await service.getAllItems();
      setResult(JSON.stringify(items));
    }
    setup();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{result}</Text>
    </View>
  );
}
