import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { TwitterPicker } from "react-color";
import { useDraw } from "../hooks/useDraw";
import { drawLine } from "../utils/drawLine";
import { useParams } from "react-router-dom";

export default function Board() {
  const [color, setColor] = useState("#000");
  const { canvasRef, onMouseDown, clearCanvas } = useDraw(createLine);
  const { id } = useParams();

  console.log("id", id);
  const socket = io("http://localhost:8000");

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    socket.emit("client-ready", id);

    socket.on("get-canvas-state", () => {
      if (!canvasRef.current?.toDataURL()) return;
      console.log("sending canvas state");
      const canvasData = canvasRef.current.toDataURL();
      socket.emit("canvas-state", canvasData);
    });

    socket.on("canvas-state-from-server", (state) => {
      console.log("I received the state");
      const img = new Image();
      img.src = state;
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
      };
    });

    socket.on("draw-line", ({ prevPoint, currentPoint, color }) => {
      if (!ctx) return;
      drawLine({ prevPoint, currentPoint, ctx, color });
    });

    socket.on("clear", clearCanvas);

    return () => {
      socket.off("draw-line");
      socket.off("get-canvas-state");
      socket.off("canvas-state-from-server");
      socket.off("clear");
      socket.disconnect();
    };
  }, [canvasRef, id]);

  function createLine({ prevPoint, currentPoint, ctx }) {
    socket.emit("draw-line", { prevPoint, currentPoint, color, boardId: id });
    drawLine({ prevPoint, currentPoint, ctx, color });
    const canvasData = canvasRef.current.toDataURL();
    socket.emit("canvas-state", canvasData);
  }

  return (
    <div className="w-screen h-screen bg-white flex justify-center items-center">
      <div className="flex flex-col gap-10 pr-10">
        <TwitterPicker
          color={color}
          onChange={(e) => {
            setColor(e.hex);
          }}
        />
        <button
          className="p-2 border rounded-md border-black"
          type="button"
          onClick={() => {
            socket.emit("clear", { boardId: id });
          }}
        >
          Clear
        </button>
      </div>
      <canvas
        className="border border-black"
        width={750}
        height={750}
        onMouseDown={onMouseDown}
        ref={canvasRef}
      />
    </div>
  );
}
