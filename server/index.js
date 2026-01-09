import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL || "http://localhost:5173", methods: ["GET", "POST"] },
});

const players = {};

const randomPosition = () => [Math.random() * 5, 0, Math.random() * 5];

io.on("connection", (socket) => {
  console.log("🟢 Connected:", socket.id);

  players[socket.id] = { id: socket.id, position: randomPosition(), rotation: [0, 0, 0], avatar: null };

  // Log total connected players
  console.log(`Total players connected: ${Object.keys(players).length}`);

  // Send all existing players to new client
  socket.emit("players:init", Object.values(players));

  // Notify others about new player
  socket.broadcast.emit("players:add", players[socket.id]);

  // Receive movement from client
  socket.on("player:move", ({ position, rotation }) => {
    if (!players[socket.id]) return;

    players[socket.id].position = position;
    players[socket.id].rotation = rotation;

    // Broadcast to others
    socket.broadcast.emit("player:update", { id: socket.id, position, rotation });
  });

  // Update avatar
  socket.on("player:avatar", (avatar) => {
    if (!players[socket.id]) return;

    players[socket.id].avatar = avatar;
    socket.broadcast.emit("player:avatar", { id: socket.id, avatar });
  });

  // Disconnect
  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("players:remove", socket.id);

    console.log("🔴 Disconnected:", socket.id);
    console.log(`Total players connected: ${Object.keys(players).length}`);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => console.log(`🚀 Multiplayer server running on port ${PORT}`));
