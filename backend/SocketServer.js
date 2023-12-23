//all our socketServer stuff happens here
import jwt from "jsonwebtoken";
const linkSecret = "secret";

export function socketHandler(io, app) {
  const connectedProfessionals = [];
  const connectedClients = [];

  const allKnownOffers = {
    // uniqueId "UUID"
    //  offer
    // professionalFullName
    // ClientName
    // Appointments Date
    // offererIceCandidates
    // Answer
    // answererIceCandidates
  };

  io.on("connection", (socket) => {
    console.log(socket.id, "has connected");

    const userJwt = socket.handshake.auth.jwt;
    let decodeData;
    try {
      decodeData = jwt.verify(userJwt, linkSecret);
    } catch (error) {
      console.log(error);

      // we did this to prevent wrong tokens from being verified

      socket.disconnect();
      return;
    }

    // console.log("decodeData => ", decodeData);

    const { fullName, proId } = decodeData;

    if (proId) {
      // this is a professional. update/add to connectedProfessionals
      // check if the user is already is connectedProfessionals
      // this would happen because they have reconnected
      const connectedPro = connectedProfessionals.find(
        (cp) => cp.proId === proId
      );
      if (connectedPro) {
        // if they are connected then just update the new socket id
        connectedPro.socketId = socket.id;
      } else {
        // otherwise push them to the connectedProfessionals
        connectedProfessionals.push({
          socketId: socket.id,
          fullName,
          proId,
        });
      }

      // send the appt data out to the professional

      const professionalAppointments = app.get("professionalAppointments");
      // console.log(
      //   "professionalAppointments => from socket ",
      //   professionalAppointments
      // );

      socket.emit(
        "apptData",
        professionalAppointments.filter(
          (pa) => pa.professionalsFullName === fullName
        )
      );

      // loop through all known offers and send out to the professional that just joined
      // the ones that belong to him/her

      for (const key in allKnownOffers) {
        if (allKnownOffers[key].professionalsFullName === fullName) {
          // this offer is fot this pro

          io.to(socket.id).emit("newOfferWaiting", allKnownOffers[key]);
        }
      }
    } else {
      // this is a client
      const { professionalsFullName, uuid, clientName } = decodeData;

      // check to see if the client is already in the array
      // why? could have reconnected
      const clientExist = connectedClients.find((c) => c.uuid == uuid);
      if (clientExist) {
        // already connected , just update the id

        clientExist.socketId = socket.id;
      } else {
        // add them
        connectedClients.push({
          professionalMeetingWith: professionalsFullName,
          uuid,
          clientName,
          socketId: socket.id,
        });
      }

      const offerForThisClient = allKnownOffers.uuid;
      if (offerForThisClient) {
        io.to(socket.id).emit("answerToClient", offerForThisClient.answer);
      }
    }

    socket.on("newAnswer", ({ answer, uuid }) => {
      // console.log("answer =>", answer);
      // console.log("uuid =>", uuid);

      // emit this to the client

      const socketToSendTo = connectedClients.find(
        (client) => client.uuid == uuid
      );
      if (socketToSendTo) {
        socket.to(socketToSendTo.socketId).emit("answerToClient", answer);
      }

      // update the offer
      const knownOffer = allKnownOffers[uuid];
      if (knownOffer) {
        knownOffer.answer = answer;
      }
    });

    // console.log("connectedProfessionals =>", connectedProfessionals);
    socket.on("newOffer", ({ offer, apptInfo }) => {
      // offer = sdp/type, apptInfo has the uuid that we can add to allKnownOffers
      // so that , the professional can exactly the right allKnownOffers

      // console.log("offer => ", offer);
      // console.log("apptInfo => ", apptInfo);
      // console.log(
      //   "allKnownOffers[apptInfo.uuid] => ",
      //   allKnownOffers[apptInfo.uuid]
      // );

      allKnownOffers[apptInfo.uuid] = {
        ...apptInfo,
        offer,
        offererIceCandidates: [],
        answer: null,
        answerIceCandidates: [],
      };

      // we don't emit this to everyone
      // we only want this to go to our professional

      // we got professionalAppointments from express
      const professionalAppointments = app.get("professionalAppointments");
      // find this particular appt so we can update that the user is waiting (has sent an offer)
      const pa = professionalAppointments.find(
        (pa) => pa.uuid === apptInfo.uuid
      );

      if (pa) {
        pa.waiting = true;
      }

      // find this particular professional so we can emit
      const professional = connectedProfessionals.find(
        (cp) => cp.fullName === apptInfo.professionalFullName
      );

      if (professional) {
        // only emit if the user is connected
        const socketId = professional.socketId;

        // send the new offer over if they are connected
        socket
          .to(socketId)
          .emit("newOfferWaiting", allKnownOffers[apptInfo.uuid]);

        // send the updated appt info with the new waiting
        socket.to(socketId).emit(
          "apptData",
          professionalAppointments.filter(
            (pa) => pa.professionalsFullName === apptInfo.professionalsFullName
          )
        );
      }
    });

    socket.on("getIce", (uuid, who, ackFunc) => {
      const offer = allKnownOffers[uuid];
      let iceCandidates = [];
      if (who === "client") {
        iceCandidates = offer.answerIceCandidates;
      } else if (who === "professional") {
        iceCandidates = offer.offererIceCandidates;
      }
      ackFunc(iceCandidates);
    });

    socket.on("iceToServer", ({ who, iceC, uuid }) => {
      console.log("who => ", who);
      const offerToUpdate = allKnownOffers[uuid];
      if (offerToUpdate) {
        if (who === "client") {
          // this means that the client has sent the ice candidate
          // update the offer
          offerToUpdate.offererIceCandidates.push(iceC);

          const socketToSendTo = connectedProfessionals.find(
            (cp) => cp.fullName === decodeData.fullName
          );
          // console.log("socketToSendTo => ", socketToSendTo);

          if (socketToSendTo) {
            socket.to(socketToSendTo.socketId).emit("iceToClient", iceC);
          }
        } else if (who === "professional") {
          // this means that the professional has sent the ice candidate
          offerToUpdate.offererIceCandidates.push(iceC);

          const socketToSendTo = connectedClients.find((cp) => cp.uuid == uuid);
          // console.log("socketToSendTo => ", socketToSendTo);

          if (socketToSendTo) {
            socket.to(socketToSendTo.socketId).emit("iceToClient", iceC);
          }
        }
      }
    });
  });
}
