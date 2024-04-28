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
      board.canvasData =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABJklEQVRYR+2WPU7DUBCGv3RAikkljJowQdRIGKoJFIoCOgKo4x6iiYNUJpFhIzBEYqZGkyB1Us5wLc+dIzCMe45nZvZvFHz7xN7PLwV+mPNNru1Sv4CeZm1TS1bZKuHoUyfFVwIi9WuI/lbvoiq2VV9VTU1N9ShzD1fV3q7X1tvf39nH9+jw4gmeP2s6+T6cEEDKjqoaC0tLSWAZ+fbVOrv6//frU01NRUpFhYUPF4gZa6M8YhSJVUJdHR2ovLi+PHz8ZFCxWW27WrF69Gu9SovKyclRUREa9fPt3W3t4eBgBx3d3fx8fFw4cPky1+5vra0NKCgoA9nzpyhlkG6tWrx5s1a5j58+bMmzdvN1vb29n6enaqqrr6+vqnMw1NbWhqakpR8fHyJ4KiKnp6eomXgr6+v6+vrP5+ft5eXlpaWk3rfz+dtLS0sbDwcFAoKiouIimfIvOzp07d+5c2ePj4yMjKycnJqXH4bG5u3t7e7q6unp6fWrVvz8/OQrVbr++vqV6sDHFxcWq1Wry8nJqbm3t7e3t6enh4eHhUVFTi4uL69evR0tKCsrKwAULFkRnZ2dUqVOnD9/PzQ0NC+vr6ioqLQqFFRUWpqaoKCwvr6+Uqk2DQ0Nvb29FycnKSkpLS0tLS0tAaUkmWlj6XR6TFAAAAAElFTkSuQmCC";
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
