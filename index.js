const express = require("express");

const app = express();
const { createServer } = require("http");
const { Server } = require("socket.io");

let socketids = new Set();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    // origin: "http://localhost:3000",
    origin: "*",
  },
});

const namespace = io.of("/chatspace");

// io.on("connection", (socket) => {
namespace.on("connection", (socket) => {
  socketids.add(socket.id);
  console.log("server socket ID=", socket.id);
  socket.emit("welcome", "welcone to chat");

  socket.on("hello", (message) => {
    console.log("users=", socketids.size);
    console.log(" from client:", message);
    console.log("  client ID:", message.clientId);
    socket.join(message.room);
    let obj = {
      message: message.message,
      users: socketids.length,
      id: socket.id,
    };
    socket.to(message.room).emit("hello", obj);
  });

  socket.on("disconnect", () => {
    console.log("client disconnected:", socket.id);
  });
});
/*
app.get("/page", (req, res) => {
  res.sendFile("serverpage.html", {
    root: "./public",
  });
});
*/
app.get("/details", (req, res) => {
  res.send({ users: socketids.size });
});

httpServer.listen(9000, () => {
  console.log("socket server listening at port 9000");
});
