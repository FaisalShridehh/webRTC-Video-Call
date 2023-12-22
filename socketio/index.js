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
    socket.emit("availableOffers", offers);
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

  socket.on("newAnswer", (offerObj, ackFunction) => {
    console.log(offerObj);
    //emit this answer (offer0bj) back to CLIENT1
    // in order to do that, we need CLIENT1's socket id

    const socketToAnswer = connectedSockets.find(
      (socket) => socket.userName === offerObj.offerUserName
    );

    if (!socketToAnswer) {
      console.log("Couldn't find socket to answer");
      return;
    }
    // socketToAnswer is exist so we can send it to the client1
    const socketIdToAnswer = socketToAnswer.socketId;

    // we find the offer to update so we can send it the client1
    const offerToUpdate = offers.find(
      (offer) => offer.offerUserName === offerObj.offerUserName
    );
    if (!offerToUpdate) {
      console.log("Could not find offer to update");
      return;
    }

    // send back to who answer the call all the iceCandidates that we have already collected
    ackFunction(offerToUpdate.offerIceCandidates);

    offerToUpdate.answer = offerObj.answer;
    offerToUpdate.offerUserName = userName;

    //socket has a .to() which allows emiting to a "room"
    //every socket has it's own room

    socket.to(socketIdToAnswer).emit("answerResponse", offerToUpdate);
  });

  socket.on("sendIceCandidate", (iceCandidateObj) => {
    const { iceCandidate, iceUserName, didIOffer } = iceCandidateObj;
    // console.log("iceCandidate => ", iceCandidate);

    if (didIOffer) {
      // this ice is coming from the sender to the receiver
      const offerInOffers = offers.find(
        (offer) => offer.offerUserName === iceUserName
      );

      if (offerInOffers) {
        offerInOffers.offerIceCandidates.push(iceCandidate);
        // 1. When the receiver answers, all existing ice candidates are sent
        // 2. Any candidates that come in after the offer has been answered , will we passed through

        if (offerInOffers.answerUserName) {
          // pass it through the other socket
          const socketToSend = connectedSockets.find(
            (socket) => socket.userName === offerInOffers.answerUserName
          );
          if (socketToSend) {
            socket
              .to(socketToSend.socketId)
              .emit("receivedIceCandidate", iceCandidate);
          } else {
            console.log("ice candidate received but could not find receiver");
          }
        }
      }
    } else {
      // this ice is coming from the receiver to the sender
      // pass it through the other socket
      const offerInOffers = offers.find(
        (offer) => offer.answerUserNameUserName === iceUserName
      );
      const socketToSend = connectedSockets.find(
        (socket) => socket?.userName === offerInOffers?.offerUserName
      );
      if (socketToSend) {
        socket
          .to(socketToSend.socketId)
          .emit("receivedIceCandidate", iceCandidate);
      } else {
        console.log("ice candidate received but could not find sender");
      }
    }

    // console.log("Offers =>" , offers)
  });
});
