import express from "express";
import cors from "cors";
import mqtt from "mqtt";

const app = express();
app.use(cors());
app.use(express.json());

// الاتصال بالـ MQTT Broker
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

client.on("connect", () => console.log("✅ Connected to MQTT Broker"));


app.get("/", express.static("public"));
// لما المستخدم يضغط زر مثلاً في الويب
app.post("/move", (req, res) => {
  const { x, y } = req.body;
  const message = JSON.stringify({ command: "move", x, y });

  client.publish("robot/command", message); // بنبعت أمر للروبوت
  console.log("📡 Sent command:", message);

  res.json({ message: "Command sent to robot via MQTT!" });
});

// السيرفر يسمع لو الروبوت رجعله Status
client.subscribe("robot/status");
client.on("message", (topic, message) => {
  if (topic === "robot/status") {
    console.log("🤖 Robot Status:", message.toString());
  }
});

app.listen(3000, () => console.log("🚀 Server running on port 3000"));
