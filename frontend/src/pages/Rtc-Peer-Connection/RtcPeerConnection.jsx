import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

/**
 * the two browsers cant
 * [1] find each other
 * [2] exchange info (SDP/IP)
 * without help and this called signalling
 * first we will make a signalling server using socket
 * then each browser will create their own session descriptions and ice candidates
 * send it to the server and then the server will send it to the other client
 * this happens it two directions both on sender that send offer
 * and the receiver that send Answer
 */
export default function RtcPeerConnection() {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);

  const [didISendOffer, setDidISendOffer] = useState(false);

  const [offerEls, setOfferEls] = useState([]); // New state for offer elements

  const [userName, setUserName] = useState("Faisal Sh");
  const [password, setPassword] = useState("faisal123");

  const localStreamRef = useRef();
  const remoteStreamRef = useRef();

  const socket = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:8900", {
      auth: {
        userName,
        password,
      },
    });
  }, [userName, password]);

  async function getUserMedia() {
    return new Promise(function (resolve, reject) {
      (async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            // audio: true,
          });
          setLocalStream(stream);
          console.log(stream);
          localStreamRef.current.srcObject = stream;
          resolve(stream);
        } catch (error) {
          console.error("[getUserMedia] => ", error);
          reject(error);
        }
      })();
    });
  }

  /**
   * handleCall function
   * when the client initiates a call
   * ||
   * \/
   */
  async function handleCall(e) {
    try {
      await getUserMedia();

      if (localStream) {
        //peerConnection is all set with our STUN servers sent over
        const peerConnectionRes = await createPeerConnection();
        setPeerConnection(peerConnectionRes);

        try {
          // create the offer
          console.log("creating offer...");
          const offer = await peerConnectionRes.createOffer();
          console.log("created offer => ", offer);
          peerConnectionRes.setLocalDescription(offer);
          setDidISendOffer(true);
          //so now we got the sdp,ip info then
          //we need to send them to the signaling server which it will be socket server
          // then it will send them to the other client to answer the offer

          socket.current.emit("newOffer", offer); // send the offer to the signaling server
        } catch (error) {
          console.error("error creating offer =>  ", error);
        }
      }
    } catch (error) {
      console.error("[handleCall] => ", error);
    }
  }

  // Function to handle answering the offer
  async function answerOffer(offer) {
    await getUserMedia();
    const peerConnection = await createPeerConnection(offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    // Handle the answer logic here
    console.log("Answering offer ", offer);
    console.log("Answering offer for user: ", offer.offerUserName);
    console.log("answer ", answer);
    // console.log(
    //   "peerConnection.signalingState  => ",
    //   peerConnection.signalingState
    // ); // should be have—local—pranswer because CLIENT 2 has set its local desc to it's answer
  }

  async function createPeerConnection(offer) {
    return new Promise(function (resolve, reject) {
      let peerConfiguration = {
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:stun1.l.google.com:19302",
            ],
          },
        ],
      };

      (async () => {
        try {
          //RTCPeerConnection is the thing that creates the connection
          //we can pass a config object, and that config object can contain stun servers
          //which will fetch us ICE candidate
          const peerConnection = await new RTCPeerConnection(peerConfiguration);
          console.log("Created peerConnection: ", peerConnection);

          await localStream?.getTracks().map((track) => {
            peerConnection.addTrack(track, localStream); // we associate our local stream with peerConnection, so that when we call create offer it can check the data stream to found out what information the other browser will need
          });

          peerConnection.addEventListener("signalingstatechange", (event) => {
            console.log("signalingstatechange => ", event);
            console.log(" signaling state => ", peerConnection.signalingState); // must be have-local-offer
          });

          // Add event listener for ice candidate
          // will triggered when we setLocalDescription()
          peerConnection.addEventListener("icecandidate", (e) => {
            console.log("ice candidate found => ", e);
            if (e.candidate) {
              socket.current.emit("sendIceCandidate", {
                iceCandidate: e.candidate,
                iceUserName: userName,
                didIOffer: didISendOffer,
              });
            }
          });

          if (offer) {
            //will not be set/Obj from handleCall()
            // will be set/Obj from answerOffer()
            // console.log(
            //   "peerConnection.signalingState before => ",
            //   peerConnection.signalingState
            // ); // should be stable cause no setDesc has been run yet

            await peerConnection.setRemoteDescription(offer.offer);
            // console.log(
            //   "peerConnection.signalingState after => ",
            //   peerConnection.signalingState
            // ); // should be have-remote-offer, because client2 has setRemoteDesc on the offer
          }

          // Resolve with the created peerConnection
          resolve(peerConnection);
        } catch (error) {
          console.error("[createPeerConnection] => ", error);
          reject(error);
        }
      })();
    });
  }

  /**
   * chatgpt answer with the code inside Answer div tag
   * ||
   * \/
   */
  useEffect(() => {
    socket.current.on("availableOffers", (offers) => {
      if (offers) {
        console.log("available Offers => ", offers);
        // Update the offerEls state with the received offers
        setOfferEls(offers);
      } else {
        console.log("no Offers Available");
      }
    });
  }, []);

  return (
    <div className="bg-[#ddd] h-screen ">
      <h1 className="text-3xl font-bold text-center">RtcPeerConnection</h1>
      <div className="container w-full flex flex-col justify-center items-center h-[calc(100vh-40px)] ">
        <div className="wrapper flex flex-col justify-center bg-sky-950 p-7 text-white rounded-lg ">
          <div className="flex flex-col gap-2 md:justify-center items-center">
            <div id="user-name w-full">{userName}</div>
            <div className="flex flex-col justify-center items-center w-full">
              <button
                id="call"
                className="btn rounded-md  p-1 text-white bg-blue-500 block mb-1 transition-all duration-700"
                onClick={(e) => handleCall(e)}
              >
                Call!
              </button>
              <button
                id="hangup"
                className="btn rounded-md  p-1 text-white bg-blue-500 block mb-1 transition-all duration-700"
              >
                Hangup
              </button>
            </div>
            <div id="answer" className="text-center w-full">
              {/* Render answer buttons based on the offerEls state */}
              {offerEls.map((offer, index) => (
                <div key={index}>
                  <button
                    className="btn bg-green-500 p-2"
                    onClick={() => answerOffer(offer)}
                  >
                    Answer {offer.offerUserName}
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div
            id="videos"
            className="flex flex-col gap-3 items-center justify-center mt-4 w-full h-full"
          >
            <div
              id="video-wrapper"
              className="flex flex-col gap-2 relative w-[350px] h-full p-2"
            >
              <div
                id="waiting"
                className="btn rounded-md text-center  p-1 text-white bg-blue-500  mb-1 transition-all duration-700 hidden absolute left-0 right-0 top-0 bottom-0 w-[240px] h-10"
              >
                Waiting for answer...
              </div>
              <video
                className="video-player bg-black w-full p-3"
                id="local-video"
                autoPlay
                playsInline
                // controls
                ref={localStreamRef}
              ></video>
            </div>
            <div className="flex w-[350px] h-full pb-10">
              <video
                className="video-player bg-black w-full p-3"
                id="remote-video"
                autoPlay
                playsInline
                // controls
                ref={remoteStreamRef}
              ></video>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// let peerConnection; // the peer connection that the two clients are used to communicate

// let peerConfiguration = {
//   iceServers: [
//     {
//       urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"],
//     },
//   ],
// };
