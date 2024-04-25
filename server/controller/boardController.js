import Board from "../model/boardSchema.js";

export const createBoard = async (req, res) => {
  try {
    const { name } = req.body;
    const newBoard = await Board.create({ name });
    res.status(201).json(newBoard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllBoards = async (_, res) => {
  try {
    const boards = await Board.find();
    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCanvasData = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { canvasData } = req.body;
    const updatedBoard = await Board.findByIdAndUpdate(
      boardId,
      { canvasData },
      { new: true }
    );
    res.status(200).json(updatedBoard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
