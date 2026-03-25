import { useRef, useState } from "react";
import { Stage, Layer, Line, Rect, Circle } from "react-konva";

const CanvasBoard = ({ elements, addElement, tool, color, size }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState([]);
  const stageRef = useRef();
  const startPos = useRef(null);

  const handleMouseDown = (e) => {
    const pos = e.target.getStage().getPointerPosition();
    if (tool === "pen") {
      setIsDrawing(true);
      setCurrentPoints([pos.x, pos.y]);
    } else if (tool === "rect" || tool === "circle") {
      startPos.current = pos;
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || tool !== "pen") return;
    const pos = e.target.getStage().getPointerPosition();
    setCurrentPoints((prev) => [...prev, pos.x, pos.y]);
  };

  const handleMouseUp = (e) => {
    if (tool === "pen" && isDrawing) {
      const newElement = {
        id: Date.now() + Math.random(),
        type: "stroke",
        points: currentPoints,
        color,
        size,
        createdAt: new Date(),
      };
      addElement(newElement);
      setCurrentPoints([]);
      setIsDrawing(false);
    } else if (tool === "rect" || tool === "circle") {
      const endPos = e.target.getStage().getPointerPosition();
      const start = startPos.current;
      if (!start) return;
      const width = endPos.x - start.x;
      const height = endPos.y - start.y;
      const newElement = {
        id: Date.now() + Math.random(),
        type: tool,
        x: start.x,
        y: start.y,
        width,
        height,
        color,
        size,
        createdAt: new Date(),
      };
      addElement(newElement);
      startPos.current = null;
    }
  };

  return (
    <Stage
      width={window.innerWidth - 220}
      height={window.innerHeight - 50}
      ref={stageRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Layer>
        {elements.map((el) => {
          if (el.type === "stroke") {
            return (
              <Line
                key={el.id}
                points={el.points}
                stroke={el.color}
                strokeWidth={el.size}
                tension={0.5}
                lineCap="round"
              />
            );
          } else if (el.type === "rect") {
            return (
              <Rect
                key={el.id}
                x={el.x}
                y={el.y}
                width={el.width}
                height={el.height}
                stroke={el.color}
                strokeWidth={el.size}
              />
            );
          } else if (el.type === "circle") {
            return (
              <Circle
                key={el.id}
                x={el.x + el.width / 2}
                y={el.y + el.height / 2}
                radius={Math.abs(el.width) / 2}
                stroke={el.color}
                strokeWidth={el.size}
              />
            );
          }
          return null;
        })}
        {tool === "pen" && currentPoints.length > 0 && (
          <Line
            points={currentPoints}
            stroke={color}
            strokeWidth={size}
            tension={0.5}
            lineCap="round"
          />
        )}
      </Layer>
    </Stage>
  );
};

export default CanvasBoard;
