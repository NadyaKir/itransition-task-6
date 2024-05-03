// BoardItem.jsx
import React from "react";
import { Link } from "react-router-dom";
import EmptyCanvas from "../assets/empty_canvas.jpeg";

const BoardItem = ({ board, index }) => {
  return (
    <div
      key={board._id}
      className="h-72 border border-gray-100 shadow-sm rounded-lg overflow-hidden"
    >
      <Link to={`/boards/${board._id}`}>
        <div className="relative h-full hover:scale-105 hover:shadow-md transition-transform duration-300">
          <img
            className="w-full"
            src={board.previewData || EmptyCanvas}
            alt={`Board Preview ${index}`}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-[#FFA500] bg-opacity-60 text-white text-center py-2">
            <span className="block font-bold">{board.name}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BoardItem;
