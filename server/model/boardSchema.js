import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  canvasData: {
    type: Object,
    default: {},
  },
  previewData: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const Board = mongoose.model("Board", boardSchema);

export default Board;
