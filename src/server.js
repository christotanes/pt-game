import { Server } from "socket.io";
import express from "express";
import { createServer } from "http";
import cors from "cors";
import "dotenv/config"

const app = express();
const httpServer = createServer(app);
const PORT = `${process.env.PORT}`;

const io = new Server(httpServer, {
  cors: {
    origin: `http://localhost:${PORT}`
  }
});

io.on("connection", (socket) => {
  console.log(socket.id, 'socket id')
});

app.use(express.static('public'));
app.use(cors());

httpServer.listen(PORT, () => {
  console.log(`Server running at ${PORT}`)
})