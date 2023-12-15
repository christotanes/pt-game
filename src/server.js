import { Server } from "socket.io";
import express from "express";
import { createServer } from "http";
import cors from "cors";
import fs from "fs/promises";
import "dotenv/config"

const app = express();
const httpServer = createServer(app);
const PORT = `${process.env.PORT}`;

const io = new Server(httpServer, {
  cors: {
    origin: `http://localhost:${PORT}`
  }
});

io.on("connection", async (socket) => {
  console.log(socket.id, 'socket id');
  try {
    const tmjMapData = await fs.readFile('./src/map.tmj', 'utf-8');
    const tsjRoomBuilder = await fs.readFile('./src/Room_Builder_free_32x32.tsj', 'utf-8')
    const tsjInterior = await fs.readFile('./src/Interiors_free_32x32.tsj', 'utf-8')

    socket.emit('mapData', {
      tmjMapData: JSON.parse(tmjMapData),
      tsjRoomBuilder: JSON.parse(tsjRoomBuilder),
      tsjInterior: JSON.parse(tsjInterior)
    })
  } catch (err){
    console.error('Error reading files ', err);
  }
});

app.use(express.static('public'));
app.use(cors());

httpServer.listen(PORT, () => {
  console.log(`Server running at ${PORT}`)
})