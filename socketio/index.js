import { Server } from "socket.io";

// create our socket io server , it will listen on port 8900
const io = new Server(8900, {
  cors: {
    origin: "http://localhost:5173",
  },
});

// offers will contain {}
const offers = [
  // offer user name
  // offer
  // offer ice candidates
  // answer user name
  // answer
  // answer ice candidates
];

const connectedSockets = [
  //username , socketId
];

io.on("connection", (socket) => {
  const userName = socket.handshake.auth.userName;
  const password = socket.handshake.auth.password;

  /**
   * it doesn't really matter
   * just i want to know how can i use handshake
   */
  if (password !== "faisal123") {
    socket.disconnect(true);
    return;
  }
  console.log(`connection established with ${userName}`);

  connectedSockets.push({
    socketId: socket.id,
    userName,
  });

  //if any user is connected , and the offer is available send it to him

  if (offers.length) {
    socket.emit("availableOffers" , offers )
  }
  
  socket.on("newOffer", (newOffer) => {
    offers.push({
      offerUserName: userName,
      offer: newOffer,
      offerIceCandidates: [],
      answerUserName: null,
      answer: null,
      answerIceCandidates: [],
    });

    // console.log("new offer => ", newOffer);

    //send out to all the connected sockets except the caller
    socket.broadcast.emit("newOfferWaiting", offers.slice(-1)); // offers.slice(-1) to send the last recent offer
  });

  socket.on("sendIceCandidate", (iceCandidateObj) => {
    const { iceCandidate, iceUserName, didIOffer } = iceCandidateObj;
    // console.log("iceCandidate => ", iceCandidate);

    if (didIOffer) {
      const offerInOffers = offers.find(
        (offer) => offer.offerUserName === iceUserName
      );

      if (offerInOffers) { 
        offerInOffers.offerIceCandidates.push(iceCandidate)
      }
    }

    // console.log("Offers =>" , offers)
  });
});
