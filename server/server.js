import express from "express";
import http from "http";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import route from "./routes/routes.js";
import { Server } from "socket.io";
import Board from "./model/boardSchema.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const participants = {};

io.on("connection", (socket) => {
  console.log("connection");

  socket.on("joinRoom", async (roomId, userName) => {
    participants[socket.id] = userName;
    socket.room = roomId;
    socket.userName = userName;
    socket.join(roomId);

    io.to(roomId).emit("userJoined", { userName });
    const room = io.sockets.adapter.rooms.get(roomId);
    const participantsCount = room ? room.size : 0;
    io.to(roomId).emit("participantsCount", participantsCount);

    const roomParticipants = getRoomParticipants(roomId);
    io.to(roomId).emit("participantsList", roomParticipants);
  });

  socket.on("leaveRoom", async (roomId, userName) => {
    const room = io.sockets.adapter.rooms.get(roomId);
    if (room) {
      socket.leave(room);
      io.to(roomId).emit("userLeft", { userName });
      const participantsCount = room ? room.size : 0;
      io.to(roomId).emit("participantsCount", participantsCount);
      const roomParticipants = getRoomParticipants(roomId);
      io.to(roomId).emit("participantsList", roomParticipants);
    }
  });

  socket.on("client-ready", async (boardId) => {
    try {
      socket.join(boardId);
      const board = await Board.findById(boardId);
      const canvasData = board.canvasData;
      io.to(boardId).emit("canvas-state-from-server", canvasData);
    } catch (error) {
      console.log("Error getting canvas data", error);
    }
  });

  socket.on("canvas-state", async ({ boardId, canvasData, previewData }) => {
    if (!canvasData) return;
    try {
      const board = await Board.findById(boardId);
      board.canvasData = canvasData;
      board.previewData = previewData;
      await board.save();

      io.to(boardId).emit("canvas-state-from-server", canvasData);
      console.log("received canvas state");
    } catch (error) {
      console.log("Error updating canvas data", error);
    }
  });

  socket.on("clear", async ({ boardId }) => {
    try {
      const board = await Board.findById(boardId);
      board.canvasData = {};
      await board.save();
      socket.join(boardId);
      io.to(boardId).emit("clear");
    } catch (error) {
      console.error("Error clearing canvas data:", error);
    }
  });

  socket.on("disconnect", () => {
    const room = io.sockets.adapter.rooms.get(socket.room);
    const participantsCount = room ? room.size : 0;
    io.to(socket.room).emit("participantsCount", participantsCount);
    const roomParticipants = getRoomParticipants(socket.room);
    io.to(socket.room).emit("participantsList", roomParticipants);
    delete participants[socket.id];
  });
});

function getRoomParticipants(roomId) {
  const room = io.sockets.adapter.rooms.get(roomId);
  const participantIds = room ? Array.from(room) : [];

  const roomParticipants = participantIds.map((id) => participants[id]);

  return roomParticipants;
}

app.use(bodyParser.json());
app.use(cors());
dotenv.config();

const PORT = process.env.PORT || 3000;
const URL = process.env.MONGOURL;

mongoose.set("strictQuery", false);
mongoose
  .connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("DB connected successfully");

    server.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT} `);
    });
  })
  .catch((error) => console.error(error));

app.use("/api", route);
