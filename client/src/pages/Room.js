import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import CanvasBoard from "../components/CanvasBoard";
import Toolbar from "../components/Toolbar";

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const { logout } = useAuth();
  const [elements, setElements] = useState([]);
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(5);

  useEffect(() => {
    if (!socket) return;

    const fetchRoom = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `http://localhost:5000/api/rooms/${roomId}`,
          {
            headers: { "x-auth-token": token },
          },
        );
        setElements(res.data.elements || []);
      } catch (err) {
        console.error("Failed to fetch room", err);
      }
    };
    fetchRoom();

    socket.emit("join-room", { roomId });

    socket.on("init-canvas", (initialElements) => {
      setElements(initialElements);
    });

    socket.on("draw-stroke", (newElement) => {
      setElements((prev) => [...prev, newElement]);
    });

    return () => {
      socket.off("init-canvas");
      socket.off("draw-stroke");
    };
  }, [socket, roomId]);

  const addElement = (element) => {
    setElements((prev) => [...prev, element]);
    socket.emit("draw-stroke", { roomId, element });
  };

  const handleLeave = () => {
    navigate("/rooms");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div className="room-header">
        <span>Room: {roomId}</span>
        <button onClick={logout}>Logout</button>
      </div>
      <div style={{ display: "flex", flex: 1 }}>
        <Toolbar
          tool={tool}
          setTool={setTool}
          color={color}
          setColor={setColor}
          size={size}
          setSize={setSize}
        />
        <CanvasBoard
          elements={elements}
          addElement={addElement}
          tool={tool}
          color={color}
          size={size}
        />
      </div>
    </div>
  );
};

export default Room;
