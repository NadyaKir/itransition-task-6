import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Input, Flex, Card, Space } from "antd";

const BoardList = (props) => {
  const { boards, handleAddBoard, newBoardName, setBoards, setNewBoardName } =
    props;

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
        <Flex gap="small">
          <form onSubmit={handleAddBoard}>
            <Input
              type="text"
              value={newBoardName}
              onChange={(event) => setNewBoardName(event.target.value)}
              placeholder="Enter board name"
            />
          </form>
          <Button type="dashed" ghost>
            Add board
          </Button>
        </Flex>

        <h2>Список досок</h2>
        <Space size={[8, 16]} wrap>
          {boards.map((board) => (
            <Card key={board._id}>{board.name}</Card>
          ))}
        </Space>
      </Flex>
    </Flex>
  );
};

export default BoardList;
