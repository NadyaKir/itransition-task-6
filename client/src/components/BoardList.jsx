import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Space, Pagination } from "antd";
import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import { TbCalendarDown, TbCalendarUp } from "react-icons/tb";
import { fetchBoards, addNewBoard } from "../api/fetchBoards";
import Logo from "../assets/logo.png";
import Loader from "./Loader";
import EmptyData from "./EmptyData";
import { useSelector } from "react-redux";
import BoardItem from "./BoardItem";
import {
  sortBoardsByName,
  sortBoardsByDate,
  filterBoardsByName,
} from "../utils/sortAndFiltrForBoards";

const BoardList = () => {
  const [boards, setBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const user = useSelector((state) => state.users.userName);

  useEffect(() => {
    fetchBoards(setBoards, setIsLoading);
  }, []);

  const handleAddBoard = (event) => {
    event.preventDefault();
    addNewBoard(setBoards, setNewBoardName, newBoardName);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const itemsPerPage = 6;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const sortedAndFilteredBoards = filterBoardsByName(boards, searchQuery);
  const currentItems = sortedAndFilteredBoards.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalItems = sortedAndFilteredBoards.length;

  const sortBoardsAZ = () => {
    const sortedBoardsAZ = sortBoardsByName(boards);
    setBoards(sortedBoardsAZ);
  };

  const sortBoardsZA = () => {
    const sortedBoardsZA = sortBoardsByName(boards, false);
    setBoards(sortedBoardsZA);
  };

  const sortBoardDateASC = () => {
    const sortedBoardsDateFirst = sortBoardsByDate(boards);
    setBoards(sortedBoardsDateFirst);
  };

  const sortBoardDateDESC = () => {
    const sortedBoardsDateLast = sortBoardsByDate(boards, false);
    setBoards(sortedBoardsDateLast);
  };

  return (
    <div className="container mx-auto min-h-screen flex flex-col flex-wrap px-3 sm:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-center mt-2">
        <Link to={`/`}>
          <img src={Logo} alt="Logo" className="w-40 h-16" />
        </Link>
        <p>
          Hello,{" "}
          <span className="text-blue-800 font-semibold text-xl mr-auto sm:mr-0">
            {user}
          </span>
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
              <Button onClick={sortBoardDateASC} title="Earliest">
                <TbCalendarDown />
              </Button>
              <Button onClick={sortBoardDateDESC} title="Latest">
                <TbCalendarUp />
              </Button>
              <Button onClick={sortBoardsAZ} title="A-Z">
                <AiOutlineSortAscending />
              </Button>
              <Button onClick={sortBoardsZA} title="Z_A">
                <AiOutlineSortDescending />
              </Button>
              <Input
                type="text"
                value={searchQuery}
                onChange={(event) => handleSearch(event.target.value)}
                placeholder="Search boards"
              />
            </Space.Compact>
          </div>
        </div>

        {isLoading && <Loader />}

        {!isLoading && currentItems.length === 0 && boards.length > 0 && (
          <EmptyData />
        )}

        {currentItems.length > 0 && (
          <div className=" flex flex-col flex-1 justify-between">
            <div className="flex flex-col flex-1 h-full ">
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-4">
                {currentItems.map((board, index) => (
                  <BoardItem key={board._id} board={board} index={index} />
                ))}
              </div>
            </div>

            {!isLoading && (
              <div className="flex m-auto my-5">
                <Pagination
                  current={currentPage}
                  total={totalItems}
                  pageSize={itemsPerPage}
                  onChange={onPageChange}
                />
              </div>
            )}
          </div>
        )}

        {!isLoading && currentItems.length === 0 && boards.length === 0 && (
          <EmptyData />
        )}
      </div>
    </div>
  );
};

export default BoardList;
