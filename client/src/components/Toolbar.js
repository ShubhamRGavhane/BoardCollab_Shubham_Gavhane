import React from "react";

const Toolbar = ({ tool, setTool, color, setColor, size, setSize }) => {
  return (
    <div className="toolbar">
      <div>
        <h3>Tools</h3>
        <div className="tool-group">
          <button
            className={`tool-btn ${tool === "pen" ? "active" : ""}`}
            onClick={() => setTool("pen")}
          >
            Pen
          </button>
          <button
            className={`tool-btn ${tool === "rect" ? "active" : ""}`}
            onClick={() => setTool("rect")}
          >
            Rectangle
          </button>
          <button
            className={`tool-btn ${tool === "circle" ? "active" : ""}`}
            onClick={() => setTool("circle")}
          >
            Circle
          </button>
        </div>
      </div>
      <div>
        <h3>Color</h3>
        <div className="color-picker">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
          <span style={{ color: "white" }}>{color}</span>
        </div>
      </div>
      <div>
        <h3>Size</h3>
        <div className="size-slider">
          <input
            type="range"
            min="1"
            max="20"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />
          <span style={{ color: "white", minWidth: "30px" }}>{size}</span>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
