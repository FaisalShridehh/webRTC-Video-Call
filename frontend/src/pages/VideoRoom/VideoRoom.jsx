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
import clientSocketListeners from "../../../webRTCUtilitis/clientSocketListeners";

const BaseBackendURL = "http://localhost:3000/";

export default function VideoRoom() {
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
    // we cannot update streamRef until we know redux is finished
    if (streams.remote1) {
      streamsRef.current = streams;
    }
  }, [streams]);

  useEffect(() => {
    async function createOfferAsync() {
      // we have a video and audio and still need an offer!
      try {
        for (const s in streams) {
          if (s !== "localStream") {
            try {
              // pc refer to peerConnection
              const pc = await streams[s].peerConnection;
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);
              // get the token form the url for the socket connection
              const token = searchParams.get("token");

              // get the socket for socket connection
              const socket = createSocketConnection(token);
              // console.log(apptData);
              socket.emit("newOffer", { offer, apptInfo: apptData });
            } catch (error) {
              console.error(error);
            }
          }
        }
        dispatch(updateCallStatus("haveCreatedOffer", true));
      } catch (error) {
        console.error(error);
      }
    }
    if (
      callStatus.video === "enabled" &&
      callStatus.audio === "enabled" &&
      !callStatus.haveCreatedOffer
    ) {
      createOfferAsync();
    }
  }, [
    apptData,
    callStatus.audio,
    callStatus.haveCreatedOffer,
    callStatus.video,
    dispatch,
    searchParams,
    streams,
  ]);

  useEffect(() => {
    // listen for changes to callStatus.answer
    // if its exist , we have an answer
    async function asyncAddAnswer() {
      for (const key in streams) {
        if (key !== "localStream") {
          const pc = streams[key].peerConnection;
          await pc.setRemoteDescription(callStatus.answer);
          console.log("pc.signalingState => ", pc.signalingState);
          console.log("Answer Added");
        }
      }
    }
    if (callStatus.answer) {
      asyncAddAnswer();
    }
  }, [callStatus.answer, streams]);

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

    clientSocketListeners(socket, dispatch, addIceCandidateToPc);
  }, [dispatch, searchParams]);

  function addIceCandidateToPc(iceC) {
    // add iceCandidate from the remote to the pc

    for (const key in streamsRef.current) {
      if (key !== "localStream") {
        const pc = streamsRef.current[key].peerConnection;
        pc.addIceCandidate(iceC);
        console.log("added an iceCandidate to existing page");
        setShowCallInfo(false);
      }
    }
  }

  function addIce(iceC) {
    // emit a new ice candidate to the signaling server
    const token = searchParams.get("token");

    const socket = createSocketConnection(token);

    socket.emit("iceToServer", {
      iceC,
      who: "client",
      uuid: uuidRef.current, // we used a useRef to keep value fresh
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
        {showCallInfo ? <CallInfo apptData={apptData} /> : <></>}
        <ChatWindow />
      </div>
      <ActionButtons
        smallFeedEl={smallFeedEl}
        largeFeedEl={largeFeedEl}
      />
    </div>
  );
}

/*
 <h1>
        {apptData.fullName} at{" "}
        <TimeAgo
          datetime={apptData.date} // className="text-xs font-semibold"
        />{" "}
      </h1>
 */
