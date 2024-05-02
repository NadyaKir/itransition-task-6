import { useEffect, useState } from "react";
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
import { InputNumber, Statistic, Col } from "antd";
import { createGeometryShape } from "../utils/createGeometryShape";
import { useSelector } from "react-redux";
import exportCanvasToJPEG from "../utils/exoprtCanvasToJPEG";

export default function Board() {
  const { editor, onReady } = useFabricJSEditor();
  const [color, setColor] = useState("#000");
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState();
  const [userCount, setUserCount] = useState(0);

  const [actions, setActions] = useState([]);
  const [participants, setParticipants] = useState([]);

  console.log(actions);
  console.log(participants);

  const { id } = useParams();
  const socket = io("http://localhost:8000");
  const userNameFromState = useSelector((state) => state.users.userName);

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

  const onSizeChange = (value) => {
    setBrushSize(value);
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

  const handleExportCanvas = () => {
    exportCanvasToJPEG(editor.canvas);
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

    socket.on("participantsList", (participantsList) => {
      setParticipants(participantsList);
    });

    socket.emit("joinRoom", id, userNameFromState);

    socket.on("userJoined", ({ userName }) => {
      console.log(`${userName} присоединился к комнате UI`);
      const joinMessage =
        userName === userNameFromState
          ? "You have joined the room. ACTIONS"
          : `${userName} joined the room. ACTIONS`;
      setActions((prevActions) => [...prevActions, joinMessage]);
    });

    socket.on("participantsCount", (count) => {
      setUserCount(count);
    });

    window.addEventListener("beforeunload", () => {
      socket.emit("leaveRoom", id, userNameFromState);
    });

    socket.on("canvas-state-from-server", (state) => {
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

    socket.on("userLeft", ({ userName }) => {
      // console.log(userName, "useLeft socket on client");
      const leaveMessage = `${userName} leaves the room.UI`;
      setActions((prevActions) => [...prevActions, leaveMessage]);
      socket.on("participantsList", (participantsList) => {
        setParticipants(participantsList);
      });
      console.log(`${userName} покидает комнату`);
    });

    return () => {
      removeUpdateEvents();
      socket.disconnect();
      socket.off("canvas-state-from-server");
      socket.off("clear");
      socket.off("participantsList");
      socket.off("participantsCount");
    };
  }, [editor, id]);

  return (
    <div className="relative w-screen h-screen flex justify-center items-center">
      <div className="absolute top-0 right-0 flex gap-10 bg-red-300">
        <ul>
          {actions.map((p) => (
            <li>{p}</li>
          ))}
        </ul>
        <ul>
          {participants.map((p) => (
            <li>{p}</li>
          ))}
        </ul>
      </div>
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
        <ToolButton handleEvent={handleExportCanvas}>
          <DownloadOutlined
            className="text-black hover:text-orange-500 text-3xl"
            title="Export to JPEG"
          />
        </ToolButton>
      </div>
      <Col className="absolute bottom-0 left-0 p-3" span={12}>
        <Statistic title="Active Users" value={userCount} />
      </Col>
      <FabricJSCanvas
        className="sample-canvas border h-screen w-screen border-black"
        onReady={onReady}
      />
    </div>
  );
}
