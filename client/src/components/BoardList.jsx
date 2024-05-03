import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button, Input, Space, Pagination } from "antd";
import { fetchBoards } from "../api/fetchBoards";
import Logo from "../assets/logo.png";
import EmptyCanvas from "../assets/empty_canvas.jpeg";
import Loader from "./Loader";
import EmptyData from "./EmptyData";
import { useSelector } from "react-redux";

const BoardList = () => {
  const [boards, setBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const user = useSelector((state) => state.users.userName);

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
    fetchBoards(setBoards, setIsLoading);
  }, [setBoards, setIsLoading, setSearchQuery]);

  const filteredBoards = boards.filter((board) =>
    board.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleBlur = () => {
    setSearchQuery("");
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBoards.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="container mx-auto min-h-screen flex flex-col flex-wrap px-3 sm:px-0">
      <div className="flex justify-between items-center mt-2">
        <Link to={`/`}>
          <img src={Logo} alt="Logo" className="w-40 h-16" />
        </Link>
        <p>
          Hello, <span className="text-blue-800 font-semibold">{user}</span>
        </p>
      </div>

      <div className="flex flex-col h-screen flex-1">
        <div className="flex justify-between items-center flex-wrap">
          <div className="flex mt-5 mb-5">
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

          <div className="flex mt-5 mb-5 items-center">
            <Space.Compact>
              <Input
                type="text"
                value={searchQuery}
                onChange={(event) => handleSearch(event.target.value)}
                onBlur={handleBlur}
                placeholder="Search boards"
              />
            </Space.Compact>
          </div>
        </div>

        {isLoading && <Loader />}

        {!isLoading && boards.length === 0 && <EmptyData />}

        {filteredBoards.length > 0 && (
          <div className=" flex flex-col flex-1 justify-between">
            <div className="flex flex-col flex-1 h-full ">
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-4">
                {currentItems.map((board, index) => (
                  <div
                    key={board._id}
                    className="h-72 border border-gray-100 shadow-sm rounded-lg overflow-hidden"
                  >
                    <Link to={`/boards/${board._id}`}>
                      <div className="relative h-full hover:scale-105 hover:shadow-md transition-transform duration-300">
                        <img
                          className="w-full"
                          src={
                            board.previewData ? board.previewData : EmptyCanvas
                          }
                          alt={`Board Preview ${index}`}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-[#FFA500] bg-opacity-60 text-white text-center py-2">
                          <span className="block font-bold">{board.name}</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {!isLoading && (
              <div className="flex m-auto my-5">
                <Pagination
                  current={currentPage}
                  total={filteredBoards.length}
                  pageSize={itemsPerPage}
                  onChange={onPageChange}
                />
              </div>
            )}
          </div>
        )}

        {!isLoading && (filteredBoards.length === 0 || boards.length === 0) && (
          <EmptyData />
        )}
      </div>
    </div>
  );
};

export default BoardList;
