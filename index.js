const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
app.use(cors());
app.use(express.json());



app.get("/", express.static(path.join(__dirname, "public")));
let data={
  command: "move",
  x: 0,
  y: 0
};
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

app.get("/", (req, res) => {
  res.send(`
    <h1>Delivery Robot Control Panel</h1>
    <p>server is running successfully</p>
    `);
});

app.listen(3000, () => console.log("🚀 Server running on port 3000"));
