import axios from "axios";

export const fetchBoards = (setData) => {
  axios
    .get("http://localhost:8000/api/boards")
    .then((response) => {
      console.log("Данные о досках:", response.data);
      setData(response.data);
    })
    .catch((error) => {
      console.error("Ошибка при загрузке списка досок:", error);
    });
};
