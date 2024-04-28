import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { TwitterPicker } from "react-color";
import { useDraw } from "../hooks/useDraw";
import { drawLine } from "../utils/drawLine";
import { useParams } from "react-router-dom";
import { ClearOutlined, DownloadOutlined } from "@ant-design/icons";

export default function Board() {
  const [color, setColor] = useState("#000");
  const { canvasRef, onMouseDown, clearCanvas } = useDraw(createLine);
  const { id } = useParams();
  const containerRef = useRef(null);

  const socket = io("http://localhost:8000");

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    socket.on("connect", () => {
      console.log("Connected to server");
      socket.emit("client-ready", id);
    });

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
  }, [canvasRef, id, containerRef]);

  function createLine({ prevPoint, currentPoint, ctx }) {
    socket.emit("draw-line", { prevPoint, currentPoint, color, boardId: id });
    drawLine({ prevPoint, currentPoint, ctx, color });
    const canvasData = canvasRef.current.toDataURL();
    socket.emit("canvas-state", { boardId: id, canvasData });
  }

  function exportCanvasToJPEG() {
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = containerRef.current.offsetWidth;
    tempCanvas.height = containerRef.current.offsetHeight;

    tempCtx.fillStyle = "#fff";
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    tempCtx.drawImage(canvasRef.current, 0, 0);

    const timestamp = new Date().toISOString().replace(/:/g, "-");
    const filename = `canvas_${timestamp}.jpg`;

    const link = document.createElement("a");
    link.download = filename;
    link.href = tempCanvas.toDataURL("image/jpeg");
    link.click();
  }

  return (
    <div className="w-screen h-screenflex flex-col justify-center items-center">
      <div className="flex justify-start items-center gap-3 mb-2">
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
          <ClearOutlined />
        </button>
        <button
          className="p-2 border rounded-md border-black"
          type="button"
          onClick={exportCanvasToJPEG}
        >
          <DownloadOutlined />
        </button>
      </div>
      <div
        ref={containerRef}
        className="h-screen w-screen flex grow overflow-auto"
      >
        <canvas
          className="h-screen w-screen border border-gray-300"
          width={containerRef.current ? containerRef.current.offsetWidth : 750}
          height={
            containerRef.current ? containerRef.current.offsetHeight : 750
          }
          onMouseDown={onMouseDown}
          ref={canvasRef}
        />
      </div>
    </div>
  );
}
