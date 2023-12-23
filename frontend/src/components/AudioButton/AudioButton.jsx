import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import getDevices from "../VideoButton/getDevices";
import updateCallStatus from "../../redux/actions/updateCallStatus";
import addStream from "../../redux/actions/addStream";
import CaretDropDown from "../CaretDropDown/CaretDropDown";
import startAudioStream from "./startAudioStream";

export default function AudioButton({ smallFeedEl }) {
  const dispatch = useDispatch();
  const callStatus = useSelector((state) => state.callStatus);
  const streams = useSelector((state) => state.streams);
  const [caretOpen, setCaretOpen] = useState(false);
  const [audioDeviceList, setAudioDeviceList] = useState([]);

  let micText;
  if (callStatus.audio === "off") {
    micText = "Join Audio";
  } else if (callStatus.audio === "enabled") {
    micText = "Mute";
  } else {
    micText = "Unmute";
  }

  useEffect(() => {
    const getDevicesAsync = async () => {
      if (caretOpen) {
        //then we need to check for audio devices
        const devices = await getDevices();
        console.log(devices.videoDevices);
        setAudioDeviceList(
          devices.audioOutputDevices.concat(devices.audioInputDevices)
        );
      }
    };
    getDevicesAsync();
  }, [caretOpen]);

  const startStopAudio = () => {
    //first, check if the audio is enabled, if so disabled
    if (callStatus.audio === "enabled") {
      //update redux callStatus
      dispatch(updateCallStatus("audio", "disabled"));
      //set the stream to disabled
      const tracks = streams.localStream.stream.getAudioTracks();
      tracks.forEach((t) => (t.enabled = false));
    } else if (callStatus.audio === "disabled") {
      //second, check if the audio is disabled, if so enable
      //update redux callStatus
      dispatch(updateCallStatus("audio", "enabled"));
      const tracks = streams.localStream.stream.getAudioTracks();
      tracks.forEach((t) => (t.enabled = true));
    } else {
      //audio is "off" What do we do?
      changeAudioDevice({ target: { value: "inputdefault" } });
      // console.log(
      //   'changeAudioDevice({ target: { value: "inputdefault" } })',
      //   changeAudioDevice({ target: { value: "inputdefault" } })
      // );
      //add the tracks
      startAudioStream(streams);
    }
  };

  const changeAudioDevice = async (e) => {
    //the user changed the desired output audio device OR input audio device
    //1. we need to get that deviceId AND the type
    const deviceId = e.target.value.slice(5);
    const audioType = e.target.value.slice(0, 5);
    // console.log("e.target.value => ", e.target.value);
    // console.log("deviceId => ", deviceId);
    // console.log("audioType => ", audioType);

    if (audioType === "output") {
      //4. (sort of out of order). update the smallFeedEl
      //we are now DONE! We don't care about the output for any other reason
      smallFeedEl.current.setSinkId(deviceId);
    } else if (audioType === "input") {
      //2. we need to getUserMedia (permission)
      const newConstraints = {
        audio: { deviceId: { exact: deviceId } },
        video:
          callStatus.videoDevice === "default"
            ? true
            : { deviceId: { exact: callStatus.videoDevice } },
      };
      const stream = await navigator.mediaDevices.getUserMedia(newConstraints);
      //3. update Redux with that videoDevice, and that video is enabled
      dispatch(updateCallStatus("audioDevice", deviceId));
      dispatch(updateCallStatus("audio", "enabled"));
      //5. we need to update the localStream in streams
      dispatch(addStream("localStream", stream));
      //6. add tracks - actually replaceTracks
      const [audioTrack] = stream.getAudioTracks();
      //come back to this later

      for (const s in streams) {
        console.log(s);
        console.log(streams[s]);
        if (s !== "localStream") {
          //getSenders will grab all the RTCRtpSenders that the PC has
          //RTCRtpSender manages how tracks are sent via the PC
          const senders = streams[s].peerConnection.getSenders();
          console.log('"Senders" from Audio Button => ', senders);
          //find the sender that is in charge of the Audio track
          const sender = senders.find((s) => {
            if (s.track) {
              //if this track matches the audioTrack kind, return it
              return s.track.kind === audioTrack.kind;
            } else {
              return false;
            }
          });
          console.log("Sender from Audio Button => ", sender);

          //sender is RTCRtpSender, so it can replace the track
          sender.replaceTrack(audioTrack);
        }
      }
    }
  }; 

  return (
    <div className="button-wrapper w-[100px] h-20 relative inline-block">
      <i
        className="fa text-lg  fa-caret-up absolute left-[75px] top-0 choose-audio text-[32px] text-[#ccc]  z-[1000000] p-[5px] hover:bg-[#555]/60 hover:rounded-lg rounded hover:cursor-pointer"
        onClick={() => setCaretOpen(!caretOpen)}
      ></i>
      <div
        className="button  w-[100px] h-20 relative hover:relative hover:bg-[#555]/60 hover:rounded-lg hover:cursor-pointer mic"
        onClick={startStopAudio}
      >
        <i className="fa text-lg fa-microphone text-[32px] text-[#ccc] absolute left-9 top-5"></i>
        <div className="btn-text absolute bottom-[10px] text-white text-center w-full ">
          {micText}
        </div>
      </div>
      {caretOpen ? (
        <CaretDropDown
          defaultValue={callStatus.audioDevice}
          changeHandler={changeAudioDevice}
          deviceList={audioDeviceList}
          type="audio"
        />
      ) : (
        <></>
      )}
    </div>
  );
}
