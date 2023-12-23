import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import TimeAgo from "timeago-react";

import CallInfo from "../../components/Call-info/CallInfo";
import ActionButtons from "../../components/ActionButtons/ActionButtons";
import ChatWindow from "../../components/ChatWindow/ChatWindow";
import { useDispatch, useSelector } from "react-redux";
import addStream from "../../redux/actions/addStream";
import createPeerConnection from "../../../webRTCUtilitis/createPeerConnection";
import updateCallStatus from "../../redux/actions/updateCallStatus";
import createSocketConnection from "../../../webRTCUtilitis/socketConnection";
import proSocketListeners from "../../../webRTCUtilitis/proSocketListeners";

const BaseBackendURL = "http://localhost:3000/";

export default function ProVideoRoom() {
  const dispatch = useDispatch();

  //get query string using react-router-dom hook
  const [searchParams, setSearchParams] = useSearchParams();
  const [apptData, setApptData] = useState({});

  const callStatus = useSelector((state) => state.callStatus);
  const streams = useSelector((state) => state.streams);

  const smallFeedEl = useRef(null); //this is a React ref to a dom element, so we can interact with it the React way
  const largeFeedEl = useRef(null);
  const uuidRef = useRef(null);
  const streamsRef = useRef(null);
  const [showCallInfo, setShowCallInfo] = useState(true);
  const [haveGottenIce, setHaveGottenIce] = useState(false);

  useEffect(() => {
    //fetch user media
    const fetchMedia = async () => {
      const constraints = {
        video: true, // must have one constraint
        audio: false,
      };
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        dispatch(updateCallStatus("haveMedia", true)); //update our callStatus reducer to know that we have the media

        //dispatch will send this function to the redux dispatcher so all reducers are notified
        // we send two args , the who and the stream
        dispatch(addStream("localStream", stream));
        const { peerConnection, remoteStream } = await createPeerConnection(
          addIce
        );
        //we don't know who we're connected/talking to yet
        dispatch(addStream("remote1", remoteStream, peerConnection));
        //we have a peerconnection... let's make an offer!
        //EXCEPT, it's not time yet.
        //SDP = information about the feed, and we have NO tracks
        //socket.emit...

        largeFeedEl.current.srcObject = remoteStream; // we have the remote stream from our peer connection set the video to be the remote stream that just created feed
      } catch (error) {
        console.error(error);
      }
    };
    fetchMedia();
  }, [dispatch]);

  useEffect(() => {
    async function getIceAsync() {
      const token = searchParams.get("token");
      const uuid = searchParams.get("uuid");

      const socket = createSocketConnection(token);

      const iceCandidates = await socket.emitWithAck(
        "getIce",
        uuid,
        "professional"
      );

      console.log("iceCandidates received => ", iceCandidates);
      iceCandidates.forEach((iceC) => {
        for (const key in streams) {
          if (key !== "localStream") {
            const pc = streams[key].peerConnection;
            pc.addIceCandidate(iceC);
            console.log("========== Added Ice Candidate!!!!!!");
          }
        }
      });
    }
    if (streams.remote1 && !haveGottenIce) {
      setHaveGottenIce(true);
      getIceAsync();
      // we cannot update streamRef until we know redux is finished
      streamsRef.current = streams;
    }
  }, [haveGottenIce, searchParams, streams]);

  useEffect(() => {
    async function setAsyncOffer() {
      for (const key in streams) {
        if (key !== "localStream") {
          const pc = streams[key].peerConnection;
          await pc.setRemoteDescription(callStatus.offer);
          console.log(pc.signalingState); // should be have remote offer
        }
      }
    }

    if (callStatus.offer && streams.remote1 && streams.remote1.peerConnection) {
      setAsyncOffer();
    }
  }, [callStatus.offer, streams, streams.remote1]);
  useEffect(() => {
    async function createAnswerAsync() {
      // we have audio and video, we can make an answer and setLocalDescription
      for (const key in streams) {
        if (key !== "localStream") {
          const pc = streams[key].peerConnection;

          // make an answer
          const answer = await pc.createAnswer();
          // because this is the answering client , the answer is the localDescription
          await pc.setLocalDescription(answer);

          console.log(pc.signalingState); // should be have local answer
          dispatch(updateCallStatus("haveCreatedAnswer", true));
          dispatch(updateCallStatus("answer", answer));
          // emit the answer to the server
          const token = searchParams.get("token");
          const uuid = searchParams.get("uuid");

          const socket = createSocketConnection(token);

          socket.emit("newAnswer", { answer, uuid });
        }
      }
    }

    // we only create an answer if audio and video are enabled and haveCreatedAnswer is false
    // this may run many times , but these 3 conditions will happen once
    if (
      callStatus.video === "enabled" &&
      callStatus.audio === "enabled" &&
      !callStatus.haveCreatedAnswer
    ) {
      createAnswerAsync();
    }
  }, [
    callStatus.audio,
    callStatus.haveCreatedAnswer,
    callStatus.video,
    dispatch,
    searchParams,
    streams,
  ]);

  // grab the token query string
  useEffect(() => {
    const token = searchParams.get("token");
    // console.log("searchParams => ", searchParams);
    // console.log("token => ", token);

    // fetch decoded token to validate it
    async function fetchDecodedToken() {
      try {
        const response = await axios.post(`${BaseBackendURL}validate-link`, {
          token,
        });
        // console.log(response.data);
        setApptData(response.data.decodeData);
        uuidRef.current = response.data.uuid;
      } catch (error) {
        console.error(error);
      }
    }
    fetchDecodedToken();
  }, [searchParams]);

  useEffect(() => {
    const token = searchParams.get("token");
    // console.log("searchParams => ", searchParams);
    // console.log("token => ", token);
    const socket = createSocketConnection(token);

    proSocketListeners.proVideoSocketListeners(socket, addIceCandidateToPc);
  }, [dispatch, searchParams]);

  function addIceCandidateToPc(iceC) {
    // add iceCandidate from the remote to the pc

    for (const key in streamsRef.current) {
      if (key !== "localStream") {
        const pc = streamsRef.current[key].peerConnection;
        pc.addIceCandidate(iceC);
        console.log("added an iceCandidate to existing page");
      }
    }
  }

  function addIce(iceC) {
    // emit a new ice candidate to the signaling server
    const token = searchParams.get("token");

    const uuid = searchParams.get("uuid");
    const socket = createSocketConnection(token);

    socket.emit("iceToServer", {
      iceC,
      who: "professional",
      uuid, // we used a useRef to keep value fresh
    });
  }

  return (
    <div className="video-page-main">
      <div className="video-chat-wrapper relative overflow-hidden w-fit">
        {/* dib to hold local video and remote video */}

        <video
          className="video-large-feed bg-black w-screen h-screen transform -scale-x-[1]"
          autoPlay
          controls
          playsInline
          ref={largeFeedEl}
        ></video>
        <video
          className="small-video-feed absolute border-white border-2 right-12 top-12 rounded-[10px] w-[320px]"
          autoPlay
          controls
          playsInline
          ref={smallFeedEl}
        ></video>
        {callStatus.audio === "off" || callStatus.video === "off" ? (
          <>
            <div className="call-info absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-[#cacaca] bg-[#222] p-2.5 text-white text-center ">
              <h1>
                {searchParams.get("client")} is in the waiting room
                <br />
                Call will start when video and audio is enabled
              </h1>
            </div>
          </>
        ) : (
          <></>
        )}
        <ChatWindow />
      </div>
      <ActionButtons smallFeedEl={smallFeedEl} />
    </div>
  );
}
