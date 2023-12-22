import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import TimeAgo from "timeago-react";

import CallInfo from "../../components/Call-info/CallInfo";
import ActionButtons from "../../components/ActionButtons/ActionButtons";
import ChatWindow from "../../components/ChatWindow/ChatWindow";
import { useDispatch } from "react-redux";
import addStream from "../../redux/actions/addStream";
import createPeerConnection from "../../../webRTCUtilitis/createPeerConnection";
import updateCallStatus from "../../redux/actions/updateCallStatus";

const BaseBackendURL = "http://localhost:3000/";

export default function VideoRoom() {
  const dispatch = useDispatch();

  //get query string using react-router-dom hook
  const [searchParams, setSearchParams] = useSearchParams();
  const [tokenLinkInfo, setTokenLinkInfo] = useState({});

  const smallFeedEl = useRef(null); //this is a React ref to a dom element, so we can interact with it the React way
  const largeFeedEl = useRef(null);
  const uuidRef = useRef(null);
  const streamsRef = useRef(null);
  const [showCallInfo, setShowCallInfo] = useState(true);

  const socket = useRef();
  useEffect(() => {
    socket.current = io(
      "ws://localhost:8901"
      // ,
      // {
      // auth: {
      //   userName,
      //   password,
      // },
      // }
    );
  }, []);

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
        const { peerConnection, remoteStream } = await createPeerConnection();
        //we don't know who we're connected/talking to yet
        dispatch(addStream("remote1", remoteStream, peerConnection));
        //we have a peerconnection... let's make an offer!
        //EXCEPT, it's not time yet.
        //SDP = information about the feed, and we have NO tracks
        //socket.emit...
      } catch (error) {
        console.error(error);
      }
    };
    fetchMedia();
  }, [dispatch]);

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
        setTokenLinkInfo(response.data.decodeData);
        uuidRef.current = response.data.uuid;
      } catch (error) {
        console.error(error);
      }
    }
    fetchDecodedToken();
  }, [searchParams]);

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
        {tokenLinkInfo.fullName ? (
          <CallInfo tokenLinkInfo={tokenLinkInfo} />
        ) : (
          <></>
        )}
        <ChatWindow />
      </div>
      <ActionButtons smallFeedEl={smallFeedEl} />
    </div>
  );
}

/*
 <h1>
        {tokenLinkInfo.fullName} at{" "}
        <TimeAgo
          datetime={tokenLinkInfo.date} // className="text-xs font-semibold"
        />{" "}
      </h1>
 */
