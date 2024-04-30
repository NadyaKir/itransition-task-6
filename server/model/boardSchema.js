import mongoose from "mongoose";
import { type } from "os";

const boardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  canvasData: {
    type: Object,
    default: {},
  },
  previewData: { type: String, default: "" },
});

const Board = mongoose.model("Board", boardSchema);

export default Board;
