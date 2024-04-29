import axios from "axios";

export const fetchBoards = (setData, setIsLoading) => {
  setIsLoading(true);
  axios
    .get("http://localhost:8000/api/boards")
    .then((response) => {
      console.log("Данные о досках:", response.data);
      setData(response.data);
      setIsLoading(false);
    })
    .catch((error) => {
      console.error("Ошибка при загрузке списка досок:", error);
    });
};
