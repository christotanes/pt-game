import { Server } from "socket.io";
import express from "express";
import { createServer } from "http";
import cors from "cors";
import fs from "fs"
// import fs from "fs/promises";
import "dotenv/config"

const app = express();
const httpServer = createServer(app);
const PORT = `${process.env.PORT}`;

const io = new Server(httpServer, {
  cors: {
    origin: `http://localhost:${PORT}`
  }
});

const playerSockets = {}
const MAX_SLOTS = 5;
let currentGroup = 0;
playerSockets[currentGroup] = [];

io.on("connection", (socket) => {
  console.log(socket.id, 'socket id');
  
  if (playerSockets[currentGroup].length >= MAX_SLOTS) {
    currentGroup++;
    playerSockets[currentGroup] = [];
  }

  let player = {
    playerId: socket.id,
    playerPosX: 0,
    playerPosY: 0,
  }

  playerSockets[currentGroup].push(player);

  console.log(playerSockets)
  
  fs.readFile('./src/map.tmj', 'utf-8', (err, tmjMapData) => {
    if (err) {
      console.error('Error reading file: ', err);
    }
    playerSockets[currentGroup].forEach(player => {
      io.to(player.playerId).emit('mapData', JSON.parse(tmjMapData))
    })
  })

  socket.on('playerPos', (data) => {
    playerSockets[currentGroup].map(player => {
      if (player.playerId === data.playerId) {
        player.playerPosX = data.playerPosX;
        player.playerPosY = data.playerPosY
      }
    })
    
    playerSockets[currentGroup].forEach(player => {
      io.to(player.playerId).emit('otherPlayers', data)
    })
    console.log(playerSockets[currentGroup])
  })

  socket.on('disconnect', () => {
    const index = playerSockets[currentGroup].findIndex(player => player.playerId === socket.id);
    if (index > -1) {
      const disconnectedPlayerId = playerSockets[currentGroup][index].playerId;
      playerSockets[currentGroup].splice(index, 1);
      // Emit to all other clients that this player has disconnected
      socket.broadcast.emit('playerDisconnected', { playerId: disconnectedPlayerId });
    }
    console.log('Updated playerSockets after disconnect: ',playerSockets)
  })
});

// io.on("connection", async (socket) => {
//   console.log(socket.id, 'socket id');
//   try {
//     const tmjMapData = await fs.readFile('./src/map.tmj', 'utf-8');
//     const tsjRoomBuilder = await fs.readFile('./src/Room_Builder_free_32x32.tsj', 'utf-8')
//     const tsjInterior = await fs.readFile('./src/Interiors_free_32x32.tsj', 'utf-8')

//     socket.emit('mapData', {
//       tmjMapData: JSON.parse(tmjMapData),
//       tsjRoomBuilder: JSON.parse(tsjRoomBuilder),
//       tsjInterior: JSON.parse(tsjInterior)
//     })
//   } catch (err){
//     console.error('Error reading files ', err);
//   }

app.use(express.static('public'));
app.use(cors());

httpServer.listen(PORT, () => {
  console.log(`Server running at ${PORT}`)
})