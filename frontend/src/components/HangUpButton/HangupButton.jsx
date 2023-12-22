import { useDispatch, useSelector } from "react-redux";
import updateCallStatus from "../../redux/actions/updateCallStatus";

const HangupButton = () => {
  const dispatch = useDispatch();
  const callStatus = useSelector((state) => state.callStatus);

  const hangupCall = () => {
    dispatch(updateCallStatus("current", "complete"));
  };

  if (callStatus.current === "complete") {
    return <></>;
  }

  return (
    <button onClick={hangupCall} className="btn bg-red-500 text-white rounded p-1 hang-up relative right-[10px] top-5">
      Hang Up
    </button>
  );
};

export default HangupButton;
