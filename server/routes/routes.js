import express from "express";
import {
  getAllBoards,
  createBoard,
  updateCanvasData,
} from "../controller/boardController.js";

const route = express.Router();

route.post("/boards", createBoard);
route.get("/boards", getAllBoards);
route.put("/boards/:boardId", updateCanvasData);

export default route;
