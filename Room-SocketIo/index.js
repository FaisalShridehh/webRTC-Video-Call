import { Server } from "socket.io";

// create our socket io server , it will listen on port 8901
const io = new Server(8901, {
  cors: {
    origin: "http://localhost:5173",
  },
});


io.on("connection", (socket) => {
  console.log(socket.id,"has connected");
})
