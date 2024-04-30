import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { Link, useParams } from "react-router-dom";
import { ClearOutlined, DownloadOutlined } from "@ant-design/icons";
import { fabric } from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { BsBrush } from "react-icons/bs";
import { FaRegCircle } from "react-icons/fa";
import { BiRectangle } from "react-icons/bi";
import { BiUndo, BiRedo } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";
import ToolButton from "./ToolButton";
import { InputNumber } from "antd";
import { createGeometryShape } from "../utils/createGeometryShape";

export default function Board() {
  const { editor, onReady } = useFabricJSEditor();
  const [color, setColor] = useState("#000");
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState();
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
    editor.canvas.freeDrawingBrush.width = brushSize;
    editor.setStrokeColor(color);
  }, [color, brushSize]);

  const onAddCircle = () => {
    const { shape: circle } = createGeometryShape({
      canvas: editor.canvas,
      shapeType: "circle",
      color,
    });

    editor.canvas.add(circle);
  };

  const onAddRectangle = () => {
    const { shape: rectangle } = createGeometryShape({
      canvas: editor.canvas,
      shapeType: "rect",
      color,
    });

    editor.canvas.add(rectangle);
  };

  const toggleDrawingMode = () => {
    editor.canvas.isDrawingMode = !editor.canvas.isDrawingMode;
    setIsDrawing(!isDrawing);
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

  const clear = () => {
    socket.emit("clear", { boardId: id });
  };

  const removeSelectedObject = () => {
    editor.canvas.remove(editor.canvas.getActiveObject());
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

  const onSizeChange = (value) => {
    setBrushSize(value);
  };

  return (
    <div className="relative w-screen h-screen flex justify-center items-center">
      <div className="absolute top-0 left-0 flex flex-col justify-start items-center gap-3 mb-2 p-4 z-10">
        <button className="mb-5 text-2xl">
          <Link to="/boards">Back</Link>
        </button>
        <ToolButton title="Select color">
          <label className="inline-block">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className=" h-11"
            />
          </label>
        </ToolButton>

        <ToolButton handleEvent={clear}>
          <ClearOutlined
            className="text-black hover:text-orange-500 text-3xl"
            title="Clear all"
          />
        </ToolButton>

        <ToolButton handleEvent={toggleDrawingMode}>
          <BsBrush
            className={`${
              isDrawing ? "text-orange-500" : "text-black"
            } text-3xl hover:text-orange-500`}
            title="Brush"
          />
        </ToolButton>
        {isDrawing && (
          <InputNumber
            size="small"
            min={1}
            max={10}
            defaultValue={3}
            onChange={onSizeChange}
            changeOnWheel
            className="hover:border-orange-500 w-12 border-transparent text-center focus:border-orange-500 transition-all duration-300"
          />
        )}

        <ToolButton handleEvent={onAddCircle}>
          <FaRegCircle
            className="text-black hover:text-orange-500 text-3xl"
            title="Circle"
          />
        </ToolButton>
        <ToolButton handleEvent={onAddRectangle}>
          <BiRectangle
            className="text-black hover:text-orange-500 text-3xl"
            title="Rectangle"
          />
        </ToolButton>
        <ToolButton handleEvent={removeSelectedObject}>
          <RiDeleteBinLine
            className="text-black hover:text-orange-500 text-3xl"
            title="Remove item"
          />
        </ToolButton>
        <div className="flex gap-1">
          <ToolButton handleEvent={undo}>
            <BiUndo
              className="text-black hover:text-orange-500 text-3xl"
              title="Undo"
            />
          </ToolButton>
          <ToolButton handleEvent={redo}>
            <BiRedo
              className="text-black hover:text-orange-500 text-3xl"
              title="Redo"
            />
          </ToolButton>
        </div>
        <ToolButton handleEvent={exportCanvasToJPEG}>
          <DownloadOutlined
            className="text-black hover:text-orange-500 text-3xl"
            title="Export to JPEG"
          />
        </ToolButton>
      </div>
      <FabricJSCanvas
        className="sample-canvas border h-screen w-screen  border-black"
        onReady={onReady}
      />
    </div>
  );
}
