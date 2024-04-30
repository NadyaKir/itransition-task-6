import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { ClearOutlined, DownloadOutlined } from "@ant-design/icons";
import { fabric } from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { BsBrush } from "react-icons/bs";
import { FaRegCircle } from "react-icons/fa";
import { BiRectangle } from "react-icons/bi";
import { BiUndo, BiRedo } from "react-icons/bi";

export default function Board() {
  const { editor, onReady } = useFabricJSEditor();
  const [color, setColor] = useState("#000");
  const { id } = useParams();
  const socket = io("http://localhost:8000");

  const updateEventList = [
    "object:modified",
    "object:added",
    "object:removed",
    "object:moved",
  ];

  const update = () => {
    console.log("canvas updated");
    const data = editor.canvas.toJSON();
    const preview = editor.canvas.toDataURL();
    socket.emit("canvas-state", {
      boardId: id,
      canvasData: data,
      previewData: preview,
    });
  };

  const addUpdateEvents = () => {
    updateEventList.forEach((event) => {
      editor.canvas.on(event, () => {
        update();
      });
    });
  };

  const removeUpdateEvents = () => {
    updateEventList.forEach((event) => {
      editor.canvas.off(event);
    });
  };

  useEffect(() => {
    if (!editor || !fabric) {
      return;
    }
    editor.canvas.freeDrawingBrush.color = color;
    editor.setStrokeColor(color);
  }, [color]);

  const onAddCircle = () => {
    editor.addCircle();
  };

  const onAddRectangle = () => {
    const rectangle = new fabric.Rect({
      width: 200,
      height: 100,
      fill: "",
      stroke: color,
      strokeWidth: 3,
    });
    console.log(rectangle);
    editor.canvas.add(rectangle);
    socket.emit("rectangleAdded", {
      boardId: id,
      rectangleData: rectangle.toObject(),
    });
  };

  const toggleDrawingMode = () => {
    editor.canvas.isDrawingMode = !editor.canvas.isDrawingMode;
  };

  const history = [];

  const undo = () => {
    if (editor.canvas._objects.length > 0) {
      history.push(editor.canvas._objects.pop());
    }
    editor.canvas.renderAll();
  };

  const redo = () => {
    if (history.length > 0) {
      editor.canvas.add(history.pop());
    }
  };

  useEffect(() => {
    if (!editor || !editor.canvas) {
      return;
    }

    removeUpdateEvents();
    addUpdateEvents();

    socket.on("connect", () => {
      console.log("Connected to server");
      socket.emit("client-ready", id);
    });

    socket.on("canvas-state-from-server", (state) => {
      console.log("I received the state");
      console.log("state from db", state);
      removeUpdateEvents();
      editor.canvas.loadFromJSON(
        state,
        editor.canvas.renderAll.bind(editor.canvas)
      );
      addUpdateEvents();
    });

    socket.on("clear", () => {
      editor.canvas._objects.splice(0, editor.canvas._objects.length);
      history.splice(0, history.length);
      editor.canvas.renderAll();
    });

    return () => {
      removeUpdateEvents();
      socket.off("canvas-state-from-server");
      socket.off("clear");
      socket.disconnect();
    };
  }, [editor, id]);

  function exportCanvasToJPEG() {
    if (!editor.canvas) return;
    const originalBackgroundColor = editor.canvas.backgroundColor;
    editor.canvas.backgroundColor = "white";

    const timestamp = new Date().toISOString().replace(/:/g, "-");
    const filename = `canvas_${timestamp}.jpg`;
    const link = document.createElement("a");

    link.download = filename;
    link.href = editor.canvas.toDataURL({ format: "jpeg", quality: 0.8 });
    editor.canvas.backgroundColor = originalBackgroundColor;

    link.click();
  }

  return (
    <div className="relative w-screen h-screen flex flex-col justify-center items-center">
      <div className=" flex justify-start items-center gap-3 mb-2 p-4">
        <label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </label>
        <button
          className="px-2 py-1 border rounded-md border-black"
          type="button"
          onClick={() => {
            socket.emit("clear", { boardId: id });
          }}
        >
          <ClearOutlined />
        </button>
        <button
          className="px-2 py-1 border rounded-md border-black"
          type="button"
          onClick={exportCanvasToJPEG}
        >
          <DownloadOutlined />
        </button>
        <button
          className="px-2 py-1 border rounded-md border-black"
          onClick={toggleDrawingMode}
        >
          <BsBrush />
        </button>
        <button
          className="px-2 py-1 border rounded-md border-black"
          type="button"
          onClick={onAddCircle}
        >
          <FaRegCircle />
        </button>
        <button
          className="px-2 py-1 border rounded-md border-black"
          type="button"
          onClick={onAddRectangle}
        >
          <BiRectangle />
        </button>
        <button
          className="px-2 py-1 border rounded-md border-black"
          onClick={undo}
        >
          <BiUndo />
        </button>
        <button
          className="px-2 py-1 border rounded-md border-black"
          onClick={redo}
        >
          <BiRedo />
        </button>
      </div>
      <FabricJSCanvas
        className="sample-canvas border h-screen w-screen  border-black bg-gray-200 z-0 "
        onReady={onReady}
      />
    </div>
  );
}
