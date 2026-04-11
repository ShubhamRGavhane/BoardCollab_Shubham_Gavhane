# BoardCollab – Real-Time Collaborative Whiteboard

A **real-time collaborative whiteboard application** built with the **MERN stack** that allows multiple users to draw and collaborate on the same canvas simultaneously.

This project simulates collaborative tools like **Figma** or **Miro** for remote teams and demonstrates **real-time synchronization using WebSockets**.

---

## Architecture Overview

```
+----------------------+
|        React         |
|   (Konva Canvas UI)  |
+----------+-----------+
           |
           | WebSocket (Socket.IO)
           |
+----------v-----------+
|   Node.js + Express  |
|   API + WS Hub       |
+----------+-----------+
           |
           |
        MongoDB
```

---

## Features

### Authentication

- User registration
- User login
- JWT-based authentication

### Room Management

- Create collaboration rooms
- Join existing rooms
- Multiple users collaborate in the same session

### Real-Time Drawing

- Freehand drawing
- Real-time stroke synchronization
- Instant canvas updates

### Canvas Tools

- Freehand strokes
- Shapes (extensible)
- Undo / Redo (per-user)
- Clear canvas

### Persistence

- Canvas state stored in MongoDB
- Automatic session saving
- Canvas restored when users reconnect

### Export

- Export whiteboard as PNG or SVG

---

## Technology Stack

### Frontend

- React
- React Konva
- Redux Toolkit
- Socket.IO Client

### Backend

- Node.js
- Express.js
- Socket.IO

### Database

- MongoDB
- Mongoose

### Authentication

- JSON Web Token (JWT)
- bcrypt

---

## Project Structure

```
BoardCollab_Sh
│
├── README.md
│
├── backend
│   ├── server.js
│   ├── socket.js
│   │
│   ├── config
│   │   └── db.js
│   │
│   ├── models
│   │   ├── User.js
│   │   └── Session.js
│   │
│   ├── routes
│   │   ├── auth.js
│   │   └── rooms.js
│   │
│   └── middleware
│       └── authMiddleware.js
│
└── frontend
    ├── src
    │   ├── components
    │   │   ├── CanvasBoard.jsx
    │   │   └── Toolbar.jsx
    │   │
    │   ├── socket.js
    │   └── App.js
```

---

## Installation & Setup

### Prerequisites

- Node.js
- npm
- MongoDB
- Git

---

## Backend Setup

### Navigate to backend

```bash
cd backend
```

### Install dependencies

```bash
npm install
```

### Create `.env` file

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/boardcollab
JWT_SECRET=supersecret
```

### Start backend

```bash
npm run dev
```

Backend runs at:

```
http://localhost:5000
```

---

## Frontend Setup

### Navigate to frontend

```bash
cd frontend
```

### Install dependencies

```bash
npm install
```

### Start frontend

```bash
npm start
```

Frontend runs at:

```
http://localhost:3000
```

---

## WebSocket Events

### join-room

Client emits:

```javascript
socket.emit("join-room", roomId);
```

Server responds:

```javascript
socket.emit("init-canvas", elements);
```

---

### draw-stroke

Client emits:

```javascript
socket.emit("draw-stroke", {
  roomId,
  stroke,
});
```

Server broadcasts:

```javascript
socket.to(roomId).emit("draw-stroke", stroke);
```

---

## Database Schema

### Session Schema

```javascript
const SessionSchema = new Schema({
  roomId: { type: String, required: true, unique: true },

  elements: [
    {
      type: { type: String },
      data: Object,
      timestamp: Date,
    },
  ],

  users: [
    {
      userId: Schema.Types.ObjectId,
      joinedAt: Date,
    },
  ],

  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});
```

---

## Performance Optimizations

### Batched Database Writes

```javascript
setInterval(() => {
  saveBufferedStrokes();
}, 5000);
```

### WebSocket Room Broadcasting

```javascript
socket.to(roomId).emit("draw-stroke", stroke);
```

---

## Conflict Resolution Strategy

### Operational Transformation (OT)

Example:

```
User A moves shape
User B deletes shape
```

Library:

```
ot-json0
```

---

### CRDT (Conflict-Free Replicated Data Types)

- Y.js
- Automerge

---

## Scaling Strategy

### Redis Adapter

```
socket.io-redis
```

### MongoDB Sharding

```
roomId
```

### MongoDB Change Streams

Used for real-time sync across instances.

---

## Performance Benchmark

### Test Scenario

```
20 concurrent users
200 strokes per minute
```

### Result

```
Average sync latency: ~50–80ms
```

---

## Assumptions

- Maximum 10k elements per canvas
- Maximum 50–100 users per room
- Single region deployment

---

## Future Improvements

- Full OT implementation
- Redis adapter integration
- Offline mode (IndexedDB)
- AI shape recognition
- Collaborative cursors
- Canvas virtualization

---

## Deployment

### Frontend

- Vercel
- Netlify

### Backend

- AWS EC2
- Docker

### Database

- MongoDB Atlas

---

## Author

**Shubham Gavhane**
