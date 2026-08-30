import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const server = http.createServer(app);

    // Socket.IO
    const io = new Server(server, {
      cors: {
        origin: "http://localhost:5173",
        credentials: true,
      },
    });

    server.listen(PORT, () => {
      console.log(`
======================================

🚀 Server Running

URL : http://localhost:${PORT}

======================================
`);
    });

  } catch (err) {
    console.log(err);
  }
};

startServer();