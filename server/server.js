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

io.on("connection", (socket) => {
  console.log("connection");

  socket.on("client-ready", async (boardId) => {
    try {
      const board = await Board.findById(boardId);
      const canvasData = board.canvasData;

      // Добавляем клиента в комнату с соответствующим id доски
      socket.join(boardId);

      // Отправляем данные о холсте только в эту комнату
      io.to(boardId).emit("canvas-state-from-server", canvasData);

      // Отправляем запрос на получение данных о холсте только после того, как они получены из базы данных
      socket.emit("get-canvas-state");
    } catch (error) {
      console.error("Error getting canvas data:", error);
    }
  });

  socket.on("canvas-state", async ({ boardId, canvasData }) => {
    try {
      console.log("canvas-state id", boardId);
      const board = await Board.findById(boardId);

      if (!canvasData) return;
      board.canvasData = canvasData;

      await board.save();
      socket.join(boardId);
      io.to(boardId).emit("canvas-state-from-server", canvasData);
      console.log("received canvas state");
    } catch (error) {
      console.error("Error updating canvas data:", error);
    }
  });

  socket.on("draw-line", ({ prevPoint, currentPoint, color, boardId }) => {
    socket.join(boardId);
    io.to(boardId).emit("draw-line", { prevPoint, currentPoint, color });
  });

  socket.on("clear", async ({ boardId }) => {
    try {
      const board = await Board.findById(boardId);
      board.canvasData = "";
      await board.save();
      socket.join(boardId);
      io.to(boardId).emit("clear");
    } catch (error) {
      console.error("Error clearing canvas data:", error);
    }
  });
});

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
