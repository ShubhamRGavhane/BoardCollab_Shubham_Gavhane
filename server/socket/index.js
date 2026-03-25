const Session = require("../models/Session");

// In-memory batch storage per room
let batches = {};

// Save batches to DB every 5 seconds
setInterval(() => {
  for (const [roomId, elements] of Object.entries(batches)) {
    if (elements.length === 0) continue;
    Session.findOneAndUpdate(
      { roomId },
      {
        $push: { elements: { $each: elements } },
        $set: { lastUpdated: new Date() },
      },
      { upsert: true },
    )
      .then(() => {
        batches[roomId] = []; // clear after successful save
      })
      .catch((err) => console.error("Batch save error", err));
  }
}, 5000);

module.exports = (io) => {
  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error"));
    try {
      const decoded = require("jsonwebtoken").verify(
        token,
        process.env.JWT_SECRET,
      );
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  // Handle new socket connections
  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("join-room", async ({ roomId }) => {
      socket.join(roomId);
      socket.roomId = roomId;

      // Send existing elements to this user
      const session = await Session.findOne({ roomId });
      if (session) {
        socket.emit("init-canvas", session.elements);
      }
    });

    socket.on("draw-stroke", ({ element }) => {
      const roomId = socket.roomId;
      if (!roomId) return;

      // Broadcast to all other clients in the room
      socket.to(roomId).emit("draw-stroke", element);

      // Add to batch for persistence
      if (!batches[roomId]) batches[roomId] = [];
      batches[roomId].push(element);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};
