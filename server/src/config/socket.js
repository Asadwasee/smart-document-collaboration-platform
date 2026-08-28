import { Server } from "socket.io";

// Active document presence tracking Map
// Format: { documentId -> Map(socketId -> userInfo) }
const roomUsersMap = new Map();

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // Production deployment ke waqt active frontend domain add karein
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {

    // 1. Join Document Room & Active Presence Update
    socket.on("join-document", ({ documentId, user }) => {
      socket.join(documentId);
      socket.documentId = documentId;
      socket.userData = user;

      if (!roomUsersMap.has(documentId)) {
        roomUsersMap.set(documentId, new Map());
      }

      const activeUsers = roomUsersMap.get(documentId);
      activeUsers.set(socket.id, {
        socketId: socket.id,
        userId: user._id,
        name: user.name,
        email: user.email,
      });

      // Room mein mojood sab logon ko active users ki updated list bhejna
      const userList = Array.from(activeUsers.values());
      io.to(documentId).emit("presence-update", userList);
    });

    // 2. Live Document Content Broadcast (Editor Typing Sync)
    socket.on("send-changes", (delta) => {
      if (socket.documentId) {
        // Sender ko chhor kar baki sab room members ko Broadcast karna
        socket.to(socket.documentId).emit("receive-changes", delta);
      }
    });

    // 3. Live Cursor Position & Selection Sync
    socket.on("cursor-move", (cursorPosition) => {
      if (socket.documentId) {
        socket.to(socket.documentId).emit("cursor-update", {
          socketId: socket.id,
          user: socket.userData,
          range: cursorPosition, // Text range / selection coordinates
        });
      }
    });

    // 4. Leave Document Room Explicitly
    socket.on("leave-document", () => {
      handleUserLeave(socket, io);
    });

    // 5. User Disconnect Handling (Tab Close / Network Drop)
    socket.on("disconnect", () => {
      handleUserLeave(socket, io);
    });
  });

  return io;
};

// Internal Helper Function for Presence Cleanup
const handleUserLeave = (socket, io) => {
  const { documentId } = socket;
  if (documentId && roomUsersMap.has(documentId)) {
    const activeUsers = roomUsersMap.get(documentId);
    activeUsers.delete(socket.id);

    if (activeUsers.size === 0) {
      roomUsersMap.delete(documentId);
    } else {
      const userList = Array.from(activeUsers.values());
      io.to(documentId).emit("presence-update", userList);
    }

    // Disconnected user ka cursor baki screens se remove karwana
    socket.to(documentId).emit("cursor-remove", socket.id);
    socket.leave(documentId);
  }
};