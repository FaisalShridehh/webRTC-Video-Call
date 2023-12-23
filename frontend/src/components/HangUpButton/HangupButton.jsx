import { useDispatch, useSelector } from "react-redux";
import updateCallStatus from "../../redux/actions/updateCallStatus";

const HangupButton = ({ smallFeedEl, largeFeedEl }) => {
  const dispatch = useDispatch();
  const callStatus = useSelector((state) => state.callStatus);
  const streams = useSelector((state) => state.streams);

  const hangupCall = () => {
    dispatch(updateCallStatus("current", "complete"));
    //user has clicked hang up
    for (const key in streams) {
      //loop through all streams, and if there is a pc, close it
      //remove listeners
      //set it to null
      if (streams[key].peerConnection) {
        streams[key].peerConnection.close();
        streams[key].peerConnection.onIcecandidate = null;
        streams[key].peerConnection.onaddstream = null;
        streams[key].peerConnection = null;
      }
    }
    //set both video tags to empty

    smallFeedEl.current.srcObject = null;
    largeFeedEl.current.srcObject = null;
  };

  if (callStatus.current === "complete") {
    return <></>;
  }

  return (
    <button
      onClick={hangupCall}
      className="btn bg-red-500 text-white rounded p-1 hang-up relative right-[10px] top-5"
    >
      Hang Up
    </button>
  );
};

export default HangupButton;
