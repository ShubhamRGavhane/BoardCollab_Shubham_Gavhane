import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoomList = () => {
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();

  const createRoom = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/rooms', {}, {
        headers: { 'x-auth-token': token }
      });
      navigate(`/room/${res.data.roomId}`);
    } catch (err) {
      setError('Failed to create room');
    }
  };

  const joinRoom = () => {
    if (roomId.trim()) {
      navigate(`/room/${roomId}`);
    } else {
      setError('Please enter a room ID');
    }
  };

  return (
    <div className="rooms-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Whiteboard Rooms</h2>
        <button onClick={logout} style={{ padding: '0.5rem 1rem', background: '#e53e3e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      <div className="rooms-actions">
        <button onClick={createRoom}>Create New Room</button>
      </div>
      <div className="rooms-join">
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        />
        <button onClick={joinRoom}>Join Room</button>
      </div>
    </div>
  );
};

export default RoomList;