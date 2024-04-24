import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
  name: String,
  drawing: [String],
});

const Board = mongoose.model("Board", boardSchema);

export default Board;
