# BoardCollab – Real-Time Collaborative Whiteboard

A **real-time collaborative whiteboard application** built with the **MERN stack** that allows multiple users to draw and collaborate on the same canvas simultaneously.

This project simulates collaborative tools like **Figma** or **Miro** for remote teams and demonstrates **real-time synchronization using WebSockets**.

---

# Architecture Overview

        +----------------------+
        |        React         |
        |   (Konva Canvas UI)  |
        +----------+-----------+
                   |
                   |  WebSocket (Socket.IO)
                   |
        +----------v-----------+
        |   Node.js + Express  |
        |   API + WS Hub       |
        +----------+-----------+
                   |
                   |
                MongoDB

---

# Features

## Authentication

- User registration
- User login
- JWT-based authentication

## Room Management

- Create collaboration rooms
- Join existing rooms
- Multiple users collaborate in the same session

## Real-Time Drawing

- Freehand drawing
- Real-time stroke synchronization
- Instant canvas updates

## Canvas Tools

- Freehand strokes
- Shapes (extensible)
- Undo / Redo (per-user)
- Clear canvas

## Persistence

- Canvas state stored in MongoDB
- Automatic session saving
- Canvas restored when users reconnect

## Export

- Export whiteboard as PNG or SVG

---

# Technology Stack

## Frontend

- React
- React Konva
- Redux Toolkit
- Socket.IO Client

## Backend

- Node.js
- Express.js
- Socket.IO

## Database

- MongoDB
- Mongoose

## Authentication

- JSON Web Token (JWT)
- bcrypt

---

# Project Structure

BoardCollab_Sh
│
├── README.md
│
├── backend
│ ├── server.js
│ ├── socket.js
│ │
│ ├── config
│ │ └── db.js
│ │
│ ├── models
│ │ ├── User.js
│ │ └── Session.js
│ │
│ ├── routes
│ │ ├── auth.js
│ │ └── rooms.js
│ │
│ └── middleware
│ └── authMiddleware.js
│
└── frontend
├── src
│ ├── components
│ │ ├── CanvasBoard.jsx
│ │ └── Toolbar.jsx
│ │
│ ├── socket.js
│ └── App.js

---

# Installation & Setup

## Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB
- Git

---

# Backend Setup

Navigate to backend folder

bash
cd backend

Install dependencies

npm install

Create .env file

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/boardcollab
JWT_SECRET=supersecret

Start backend server

npm run dev

Server runs at:

http://localhost:5000


# Frontend Setup

Navigate to frontend folder

cd frontend

Install dependencies

npm install

Start frontend

npm start

Frontend runs at:

http://localhost:3000


# WebSocket Events
join-room

User joins a collaboration room.

Client emits:

socket.emit("join-room", roomId);

Server responds with existing canvas data:

socket.emit("init-canvas", elements);
draw-stroke

Triggered when a user draws.

Client emits:

socket.emit("draw-stroke", {
  roomId,
  stroke
});

Server broadcasts to other users:

socket.to(roomId).emit("draw-stroke", stroke);


# Database Schema
Session Schema
const SessionSchema = new Schema({
  roomId: { type: String, required: true, unique: true },

  elements: [
    {
      type: { type: String },
      data: Object,
      timestamp: Date
    }
  ],

  users: [
    {
      userId: Schema.Types.ObjectId,
      joinedAt: Date
    }
  ],

  lastUpdated: {
    type: Date,
    default: Date.now
  }
});


# Performance Optimizations
Batched Database Writes

Stroke events are batched and saved every 5 seconds to reduce database load.

Example logic:

setInterval(() => {
  saveBufferedStrokes();
}, 5000);
WebSocket Room Broadcasting

Only users in the same room receive updates.

socket.to(roomId).emit("draw-stroke", stroke);


# Conflict Resolution Strategy

Two approaches are considered for concurrent editing.

Operational Transformation (OT)

Transforms operations against concurrent edits before applying them.

Example scenario:

User A moves shape
User B deletes shape

OT ensures both operations merge safely.

Library example:

ot-json0
CRDT (Conflict-Free Replicated Data Types)

Ensures eventual consistency across distributed systems.

Possible libraries:

Y.js

Automerge

# Scaling Strategy

To support 50+ concurrent users per room:

Redis Adapter for Socket.IO

Used for horizontal scaling across servers.

socket.io-redis


# MongoDB Sharding

Sessions can be sharded by:

roomId

This distributes load across clusters.

MongoDB Change Streams

Allows backend instances to receive real-time database updates.

# Performance Benchmark (Estimated)

Test scenario:

20 concurrent users
200 strokes per minute

Result:

Average sync latency: ~50–80ms


# Assumptions

Maximum 10k elements per canvas 
Maximum 50–100 users per room
Single region deployment

# Future Improvements

Full OT implementation

Redis adapter integration

Offline mode using IndexedDB

AI shape recognition

Collaborative cursors

Canvas virtualization

# Deployment

Frontend
  Vercel
  Netlify

Backend
  AWS EC2
  Docker

Database
  MongoDB Atlas

# Author

Shubham Gavhane

