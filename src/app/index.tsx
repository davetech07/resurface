import * as SQLite from "expo-sqlite";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function Index() {
  const [result, setResult] = useState("loading...");

  useEffect(() => {
    async function runToyExample() {
      // Opens (or creates) a file called "test.db" on the device.
      const db = await SQLite.openDatabaseAsync("test.db");

      // CREATE TABLE = define the shape, once.
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS notes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          text TEXT
        )
      `);

      // INSERT = add one row. The '?' is safely filled by the array below.
      await db.runAsync(`INSERT INTO notes (text) VALUES (?)`, ["Hello world"]);

      // SELECT = read rows back out.
      const rows = await db.getAllAsync(`SELECT * FROM notes`);

      console.log(rows); // watch your TERMINAL for this, not the phone screen
      setResult(JSON.stringify(rows));
    }

    runToyExample();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{result}</Text>
    </View>
  );
}
