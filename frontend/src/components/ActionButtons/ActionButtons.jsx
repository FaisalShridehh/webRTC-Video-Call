import { useEffect, useRef } from "react";
// import { useDispatch, useSelector } from 'react-redux';
import HangupButton from "../hangUpButton/HangupButton";
// import socket from "../utilities/socketConnection";
import { useSelector } from "react-redux";
import VideoButton from "../VideoButton/VideoButton";
import AudioButton from "../AudioButton/AudioButton";

const ActionButtons = ({ openCloseChat, smallFeedEl }) => {
  const callStatus = useSelector((state) => state.callStatus);
  // const callStatus = useSelector(state=>state.callStatus);
  const menuButtons = useRef(null);
  const timer = useRef(null);

  useEffect(() => {
    const setTimer = () => {
      // console.log(callStatus.current)
      if (callStatus.current !== "idle") {
        timer.current = setTimeout(() => {
          // console.log("triggerd")
          menuButtons.current.classList.add("hidden");
          // console.log("no movement for 4sec. Hiding")
        }, 1000);
      }
    };

    window.addEventListener("mousemove", () => {
      //mouse moved!
      //it's hidden. Remove class to display and start the timer
      if (
        menuButtons.current &&
        menuButtons.current.classList &&
        menuButtons.current.classList.contains("hidden")
      ) {
        // console.log("Not showing. Show now")
        menuButtons.current.classList.remove("hidden");
        setTimer();
      } else {
        // Not hidden, just reset start timer
        clearTimeout(timer.current); //clear out the old timer
        setTimer();
      }
    });
  }, [callStatus]);

  return (
    <div
      id="menu-buttons"
      ref={menuButtons}
      className="flex items-center h-[84px] w-full bg-[#333] absolute -bottom-[6px] left-0 border border-white border-solid rounded-lg "
    >
      {/* <i className="fa text-lg fa-microphone" style="font-size:48px;color:red"></i> */}
      <div className="left flex-[3] left-0 ">
        <AudioButton smallFeedEl={smallFeedEl} />
        <VideoButton smallFeedEl={smallFeedEl} />
      </div>

      <div className="flex-[6] text-center">
        <div className="button-wrapper w-[100px] h-20 relative inline-block">
          <i className="fa text-lg fa-caret-up left-[75px] top-0 choose-video text-[32px] text-[#ccc] absolute z-[1000] p-[5px] hover:bg-[#555]/60 hover:rounded-lg hover:cursor-pointer"></i>
          <div className="button  w-[100px] h-20 relative hover:relative hover:bg-[#555]/60 hover:rounded-lg hover:cursor-pointer participants">
            <i className="fa text-lg fa-users text-[32px] text-[#ccc] absolute left-9 top-5"></i>
            <div className="btn-text absolute bottom-[10px] text-white text-center w-full ">
              Participants
            </div>
          </div>
        </div>
        <div className="button-no-caret w-[100px] h-20 relative hover:relative hover:bg-[#555]/60 hover:rounded-lg hover:cursor-pointer  inline-block">
          <div className="button  w-[100px] h-20 relative hover:relative hover:bg-[#555]/60 hover:rounded-lg hover:cursor-pointer participants">
            <i
              className="fa text-lg fa-comment text-[32px] text-[#ccc] absolute left-10 top-5"
              onClick={openCloseChat}
            ></i>
            <div
              className="btn-text absolute bottom-[10px] text-white text-center w-full "
              onClick={openCloseChat}
            >
              Chat
            </div>
          </div>
        </div>
        <div className="button-no-caret w-[100px] h-20 relative hover:relative hover:bg-[#555]/60 hover:rounded-lg hover:cursor-pointer  participants inline-block">
          <div className="button  w-[100px] h-20 relative hover:relative hover:bg-[#555]/60 hover:rounded-lg hover:cursor-pointer participants">
            <i className="fa text-lg fa-desktop text-[32px] text-[#ccc] absolute left-9 top-5"></i>
            <div className="btn-text absolute bottom-[10px] text-white text-center w-full ">
              Share Screen
            </div>
          </div>
        </div>
      </div>

      <div className="place-self-start   justify-center text-end flex-[3]">
        <HangupButton />
      </div>
    </div>
  );
};

export default ActionButtons;
