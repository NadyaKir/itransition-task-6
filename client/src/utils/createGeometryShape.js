import { fabric } from "fabric";

export const createGeometryShape = ({ canvas, shapeType, color }) => {
  const randomX = Math.random() * (canvas.width - 200);
  const randomY = Math.random() * (canvas.height - 100);

  const shapeOptions = {
    fill: "",
    stroke: color,
    strokeWidth: 3,
    left: randomX,
    top: randomY,
  };

  let shape;

  if (shapeType === "rect") {
    shape = new fabric.Rect({ ...shapeOptions, width: 200, height: 100 });
  } else if (shapeType === "circle") {
    shape = new fabric.Circle({
      ...shapeOptions,
      radius: 50,
    });
  }

  return { shape };
};
