//this functions job is to update all peerConnections (addTracks) and update redux callStatus
import updateCallStatus from "../../redux/actions/updateCallStatus";

// we need streams cause we will interact with the peerConnections
// we need dispatch  to update redux callStatus
const startLocalVideoStream = (streams, dispatch) => {
  const localStream = streams.localStream;
  // console.log("streams => ", streams);
  for (const s in streams) {
    // console.log("s => ", s);
    //s is the key
    if (s !== "localStream") {
      // console.log("triggered");

      //we don't addTracks to the localStream
      const curStream = streams[s];
      // console.log("curStream: ", curStream);
      //addTracks to all peerConnecions
      localStream.stream.getVideoTracks().forEach((t) => {
        // console.log("t => ", t);
        curStream.peerConnection.addTrack(t, streams.localStream.stream);
      });

      //update redux callStatus
      dispatch(updateCallStatus("video", "enabled"));
      // console.log("curStream after: ", curStream);
    }
  }
};

export default startLocalVideoStream;
