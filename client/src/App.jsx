import React, { useState } from "react";
import BoardList from "./components/BoardList";
import axios from "axios";

function App() {
  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState("");

  const handleAddBoard = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:8000/api/boards", { name: newBoardName })
      .then((response) => {
        setBoards([...boards, response.data]);
        setNewBoardName("");
      })
      .catch((error) => {
        console.error("Error set new board:", error);
      });
  };

  return (
    <div className="bg-amber-600 h-screen">
      <BoardList
        boards={boards}
        handleAddBoard={handleAddBoard}
        newBoardName={newBoardName}
        setNewBoardName={setNewBoardName}
        setBoards={setBoards}
      />
    </div>
  );
}

export default App;
