// app/capture.tsx

import DateTimePicker from "@expo/ui/community/datetime-picker";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useResurfaceService } from "../../../context/ResurfaceContext";

type ItemType = "link" | "text";
type Intent = "read" | "watch" | "try" | "reference";

export default function Capture() {
  const service = useResurfaceService();
  const [type, setType] = useState<ItemType>("link");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [intent, setIntent] = useState<Intent>("read");
  const [scheduledAt, setScheduledAt] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  function pickTomorrow() {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(20, 0, 0, 0); // 8:00 PM
    setScheduledAt(date.toISOString());
  }

  function pickNextWeek() {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    date.setHours(20, 0, 0, 0);
    setScheduledAt(date.toISOString());
  }

  function pickThisWeekend() {
    const date = new Date();
    const daysUntilSaturday = (6 - date.getDay() + 7) % 7 || 7;
    date.setDate(date.getDate() + daysUntilSaturday);
    date.setHours(20, 0, 0, 0);
    setScheduledAt(date.toISOString());
  }

  async function handleSave() {
    try {
      await service.captureItem({
        type,
        content,
        title: title || undefined,
        intent,
        scheduledAt: scheduledAt as string,
      });

      Alert.alert("Saved!", "Item captured successfully.");

      // reset form
      setContent("");
      setTitle("");
      setIntent("read");
      setScheduledAt(null);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F7F9F8", padding: 20 }}>
      {/* Header */}
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 4 }}>
        Capture Item
      </Text>
      <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 20 }}>
        Set an intentional review date
      </Text>

      {/* Type toggle */}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#EAEAEA",
          borderRadius: 24,
          padding: 4,
          marginBottom: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => setType("link")}
          style={{
            flex: 1,
            paddingVertical: 10,
            borderRadius: 20,
            alignItems: "center",
            backgroundColor: type === "link" ? "#FFFFFF" : "transparent",
          }}
        >
          <Text
            style={{
              fontWeight: "600",
              color: type === "link" ? "#111827" : "#6B7280",
            }}
          >
            🔗 Link
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setType("text")}
          style={{
            flex: 1,
            paddingVertical: 10,
            borderRadius: 20,
            alignItems: "center",
            backgroundColor: type === "text" ? "#FFFFFF" : "transparent",
          }}
        >
          <Text
            style={{
              fontWeight: "600",
              color: type === "text" ? "#111827" : "#6B7280",
            }}
          >
            ☰ Text Snippet
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content input */}
      <Text
        style={{
          fontSize: 13,
          fontWeight: "600",
          color: "#374151",
          marginBottom: 6,
        }}
      >
        {type === "link" ? "Source URL" : "Text"}
      </Text>
      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder={
          type === "link" ? "https://..." : "Paste or type your note"
        }
        multiline={type === "text"}
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#E5E7EB",
          padding: 14,
          fontSize: 14,
          marginBottom: 20,
          minHeight: type === "text" ? 90 : undefined,
        }}
      />

      {/* Title */}
      <Text style={{ marginBottom: 5 }}>Title (optional)</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Give it a title"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 15,
        }}
      />

      {/* Intent picker */}
      <Text style={{ marginBottom: 5 }}>Intent</Text>
      <View
        style={{ flexDirection: "row", marginBottom: 15, flexWrap: "wrap" }}
      >
        {(["read", "watch", "try", "reference"] as Intent[]).map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => setIntent(option)}
            style={{
              padding: 8,
              paddingHorizontal: 14,
              backgroundColor: intent === option ? "#207A4E" : "#eee",
              marginRight: 8,
              marginBottom: 8,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: intent === option ? "white" : "black" }}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Review date presets */}
      <Text style={{ marginBottom: 5 }}>Review Date *</Text>
      <View
        style={{ flexDirection: "row", marginBottom: 10, flexWrap: "wrap" }}
      >
        <TouchableOpacity
          onPress={pickTomorrow}
          style={{
            padding: 10,
            backgroundColor: "#eee",
            marginRight: 10,
            marginBottom: 10,
          }}
        >
          <Text>Tomorrow</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={pickThisWeekend}
          style={{
            padding: 10,
            backgroundColor: "#eee",
            marginRight: 10,
            marginBottom: 10,
          }}
        >
          <Text>This Weekend</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={pickNextWeek}
          style={{
            padding: 10,
            backgroundColor: "#eee",
            marginRight: 10,
            marginBottom: 10,
          }}
        >
          <Text>Next Week</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          style={{ padding: 10, backgroundColor: "#eee", marginBottom: 10 }}
        >
          <Text>Custom...</Text>
        </TouchableOpacity>
      </View>

      {showPicker && (
        <DateTimePicker
          value={scheduledAt ? new Date(scheduledAt) : new Date()}
          mode="datetime"
          presentation="dialog"
          onValueChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) {
              setScheduledAt(selectedDate.toISOString());
            }
          }}
          onDismiss={() => setShowPicker(false)}
        />
      )}

      <Text style={{ marginBottom: 20, color: "#555" }}>
        {scheduledAt
          ? `Scheduled for: ${new Date(scheduledAt).toLocaleString()}`
          : "No date selected yet"}
      </Text>

      {/* Save button */}
      <TouchableOpacity
        onPress={handleSave}
        style={{
          backgroundColor: "#207A4E",
          padding: 15,
          alignItems: "center",
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Save Item</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
