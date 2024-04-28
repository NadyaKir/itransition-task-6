import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button, Input, Flex, Col, Row, Typography } from "antd";

const BoardList = (props) => {
  const { Title } = Typography;

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

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = () => {
    axios
      .get("http://localhost:8000/api/boards")
      .then((response) => {
        console.log("Данные о досках:", response.data);
        setBoards(response.data);
      })
      .catch((error) => {
        console.error("Ошибка при загрузке списка досок:", error);
      });
  };

  return (
    <Flex className="h-screen" justify="center" align="center">
      <Flex justify="center" align="center" vertical>
        <Flex>
          <form onSubmit={handleAddBoard}>
            <Flex justify="center" align="center" gap="small">
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
            </Flex>
          </form>
        </Flex>
        <Flex vertical>
          <Title>Board list</Title>
          {boards.map((board) => (
            <ul span={6} key={board._id}>
              <li>
                <Link to={`/boards/${board._id}`}>{board.name}</Link>
              </li>
            </ul>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default BoardList;
