const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());
 
// app.use(express.static(path.join(__dirname, "public")));
let data={
  command: "move",
  x: 0,
  y: 0
};
// Socket.IO setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  // Send current move data on connection
  socket.emit("move_data", data);
 
  // Handle move command
  socket.on("move", ({ x, y }) => {
    data.x = x;
    data.y = y;
    console.log("[socket] move command received", x, y);
    socket.emit("move_data", { message: "Command sent successfully" });
    io.emit("move_data", data);
    console.log("move_data", data);
  });

  // Handle getMove request
  socket.on("getMove", () => {
    console.log("[socket] robot requested move data");
    socket.emit("move_data", data);
  });
 
  // Handle status updates from robot
  socket.on("status", ({ status, yaw }) => {
    console.log("[socket] status sent successfully", status, yaw);
    socket.emit("status_ack", { message: "status sent successfully", status, yaw });
    io.emit("status", { status, yaw });
  });

  socket.on("disconnect", () => {
    console.log("🔌 Client disconnected:", socket.id);
  });
});
app.post("/move", (req, res) => {
    const { x, y } = req.body;
    data.x=x;
    data.y=y;
    console.log("move command sent successfully");
    

  res.json({ message: "Command sent successfully" });
});


app.get("/getMove", (req, res) => {

  console.log("robot get the move message");
  res.json(data);
});


app.post("/status", (req, res) => {
  const { status ,yaw} = req.body;

  console.log("status sent successfully",status,yaw);

  res.json({ message: "status sent successfully" ,status,yaw});
});

// app.get("/", (req, res) => {
//   res.send(`
//     <h1>Delivery Robot Control Panel</h1>
//     <p>server is running successfully</p>
//     `);
// });
 
server.listen(3000, () => console.log("🚀 Server + Socket.IO running on port 3000"));
