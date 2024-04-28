import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button, Input, Empty, Flex, Col, Row, Typography } from "antd";
import { fetchBoards } from "../api/fetchBoards";

const BoardList = (props) => {
  const { Title } = Typography;

  const [boards, setBoards] = useState([]);
  console.log(boards);
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

  useEffect(() => {
    fetchBoards(setBoards);
  }, [boards]);

  return (
    <div className="h-screen w-screen flex flex-col m-5">
      <div className="w-screen flex mt-5">
        <form onSubmit={handleAddBoard}>
          <div className="flex gap-3 wrap">
            <Input
              type="text"
              value={newBoardName}
              onChange={(event) => setNewBoardName(event.target.value)}
              placeholder="Enter board name"
            />
            <Button
              ghost
              htmlType="submit"
              style={{
                backgroundColor: "#FFA500",
                borderColor: "#FFA500",
                color: "white",
                transition: "background-color 0.3s",
              }}
            >
              Add board
            </Button>
          </div>
        </form>
      </div>
      <div className="mt-8">
        <Title>Board list</Title>
        {boards.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {boards.map((board, index) => (
              <div
                key={board._id}
                className="border border-gray-300 rounded-lg overflow-hidden"
              >
                <Link to={`/boards/${board._id}`}>
                  <div className="relative hover:scale-105 hover:shadow-md transition-transform duration-300">
                    {board.canvasData ? (
                      <img
                        className="w-full h-auto"
                        src={board.canvasData}
                        alt={`Board Preview ${index}`}
                      />
                    ) : (
                      <img
                        className="w-full h-auto"
                        src={emptyBoardIconBase64}
                        alt={`Empty Board ${index}`}
                      />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-[#FFA500] bg-opacity-50 text-white text-center py-2">
                      <span className="block">{board.name}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-screen w-screen flex justify-center items-center">
            <Empty />
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardList;
