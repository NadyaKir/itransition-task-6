import axios from "axios";

export const fetchBoards = (setData, setIsLoading) => {
  setIsLoading(true);
  axios
    .get("https://itransition-task-6-y0ii.onrender.com/api/boards")
    .then((response) => {
      setData(response.data);
      setIsLoading(false);
    })
    .catch((error) => {
      console.error("Ошибка при загрузке списка досок:", error);
    });
};

export const addNewBoard = (
  boards,
  setBoards,
  setNewBoardName,
  newBoardName
) => {
  axios
    .post("https://itransition-task-6-y0ii.onrender.com/api/boards", {
      name: newBoardName,
    })
    .then((response) => {
      setBoards([...boards, response.data]);
      setNewBoardName("");
    })
    .catch((error) => {
      console.error("Error set new board:", error);
    });
};
