import { io } from "socket.io-client";

let socket;

const createSocketConnection = (jwt) => {
  //check to see if the socket is already connected

  if (socket && socket.connected) {
    // if so, then return it so whoever needs it can use it
    return socket;
  } else {
    // if not connected then connect
    socket = io.connect("http://localhost:3000", {
      auth: { jwt },
    });
    return socket;
  }
};

export default createSocketConnection;
