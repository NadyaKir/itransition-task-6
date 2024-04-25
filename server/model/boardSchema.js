import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  canvasData: { type: String, default: "" },
});

const Board = mongoose.model("Board", boardSchema);

export default Board;
