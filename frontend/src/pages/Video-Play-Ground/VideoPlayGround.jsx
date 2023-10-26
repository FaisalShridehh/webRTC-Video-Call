import { useEffect, useRef, useState } from "react";
import Buttons from "../../components/video-playground-components/Buttons";
import VideoSection from "../../components/video-playground-components/VideoSection";

export default function VideoPlayGround() {
  const [stream, setStream] = useState(null);
  const [mediaStream, setMediaStream] = useState(null); // media stream for share screen
  const [devices, setDevices] = useState([]); // list of devices
  const [isThereStream, setIsThereStream] = useState(false);
  const [isThereFeed, setIsThereFeed] = useState(false);
  // const [isRecordStarted, setIsRecordStarted] = useState(false);
  const [isThereRecord, setIsThereRecord] = useState(false);
  const [isThereScreenRecord, setIsThereScreenRecord] = useState(false);
  const [videoWidth, setVideoWidth] = useState(1280);
  const [videoHeight, setVideoHeight] = useState(720);
  const localStreamRef = useRef();
  const recordedStreamRef = useRef();
  const screenRecordedStreamRef = useRef();

  const [selectedAudioInput, setSelectedAudioInput] = useState();
  const [selectedAudioOutput, setSelectedAudioOutput] = useState();
  const [selectedVideoInput, setSelectedVideoInput] = useState();

  let mediaRecorder;
  let recordedBlob;
  let shareMediaRecorder;
  let ShareRecordedBlob;

  // filtering devices functions

  const audioInput = devices.filter((device) => device.kind === "audioinput");
  const audioOutput = devices.filter((device) => device.kind === "audiooutput");
  const videoInput = devices.filter((device) => device.kind === "videoinput");

  // ----------------------------------------------------------------

  // const [mediaRecorder, setMediaRecorder] = useState(null);
  // const [recordedBlob, setRecordedBlob] = useState([]);

  /**
   *
   * share camera and audio button
   * ||
   * \/
   */
  async function getMicAndCamera(e) {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      console.log(localStream);
      setStream(localStream);
      setIsThereStream(true);
    } catch (error) {
      // user denied access to constraints/devices
      console.log("user denied access to constraints/devices");
      console.error("[getMicAndCamera] => ", error);
    }
  }

  /**
   *
   * show the video in the feed button
   * ||
   * \/
   */
  async function showMyFeed(e) {
    try {
      if (!stream) {
        alert("Stream still Loading...");
        return;
      }
      // console.log("stream => ", stream);
      // console.log("localStreamRef => ", localStreamRef);
      // console.log("localStreamRef.current => ", localStreamRef.current);
      localStreamRef.current.srcObject = stream; // this will set our media stream to our video tag

      const tracks = stream.getTracks();
      console.log("tracks => ", tracks);
      setIsThereFeed(true);
      setIsThereRecord(true);
      setIsThereScreenRecord(true);
    } catch (error) {
      console.error("[showMyFeed] => ", error);
    }
  }

  /**
   *
   * show the video in the feed button
   * ||
   * \/
   */
  async function stopMyFeed(e) {
    try {
      if (!stream) {
        alert("Stream still Loading...");
        return;
      }
      const tracks = stream.getTracks();
      console.log("tracks => ", tracks);
      tracks.map((track) => {
        console.log(track);
        track.stop();
      });
      localStreamRef.current.srcObject = null; // this will set our media stream back to null to our video tag
      setIsThereStream(false);
      setIsThereFeed(false);
      setIsThereRecord(false);
      setIsThereScreenRecord(false);
      // setIsRecordStarted(false);
    } catch (error) {
      console.error("[showMyFeed] => ", error);
    }
  }

  /**
   *
   * change video size
   * ||
   * \/
   */
  async function changeVideoSize(e) {
    try {
      stream.getVideoTracks().map((track) => {
        /**
         *  track is a video track
         * we can get its capabilities from getCapabilities()
         * or we can apply  new constraints with applyConstraints()
         */
        const capabilities = track.getCapabilities();

        const videoConstraints = {
          height: {
            exact:
              videoHeight < capabilities.height.max
                ? videoHeight
                : capabilities.height.max,
          },
          width: {
            exact:
              videoWidth < capabilities.width.max
                ? videoWidth
                : capabilities.width.max,
          },
          // frameRate: 5,
          // aspectRatio: 10
        };

        track.applyConstraints(videoConstraints);
        console.log("capabilities =>", capabilities);
      });
      // const supportedConstraints =
      //   navigator.mediaDevices.getSupportedConstraints();
      // console.log("supportedConstraints => ", supportedConstraints);
      // stream.getTracks().map((track) => {
      //   const capabilities = track.getCapabilities();
      //   console.log("capabilities =>", capabilities);
      // });
    } catch (error) {
      console.error("[changeVideoSize] => ", error);
    }
  }

  /**
   *
   * start video recording
   * ||
   * \/
   */
  async function startVideoRecording(e) {
    try {
      if (!stream) {
        alert("no stream/feed available");
        return;
      }
      console.log("start video recording");
      recordedBlob = []; // array to store blobs for playback
      mediaRecorder = new MediaRecorder(stream); //make a media recorder from a constructor
      console.log("mediaRecorder =>", mediaRecorder);
      mediaRecorder.ondataavailable = (e) => {
        // ondataavailable will be run when the media recorder/stream ends, or stopped, or if we ask for it
        console.log("Data is available for recording => ", e);
        recordedBlob.push(e.data);
        console.log("recordedBlob => ", recordedBlob);
      };
      mediaRecorder.start(); // start recording
      console.log("recordedBlob => ", recordedBlob);
      // setIsRecordStarted(true);
    } catch (error) {
      console.error("[startVideoRecording] => ", error);
    }
  }
  /**
   *
   * stop video recording
   * ||
   * \/
   */
  async function stopVideoRecording(e) {
    try {
      if (!mediaRecorder) {
        alert("There is no media recorder , please record before stopping");
        return;
      }
      mediaRecorder.stop();
    } catch (error) {
      console.error("[stopVideoRecording] => ", error);
    }
  }
  /**
   *
   * play video recording
   * ||
   * \/
   */
  async function playVideoRecording(e) {
    try {
      if (!recordedBlob) {
        alert("There is no records saved ");
        return;
      }
      if (!recordedStreamRef.current) {
        alert("Recorded stream is not available.");
        return;
      }
      const superBuffer = new Blob(recordedBlob);
      console.log("superBuffer => ", superBuffer);
      setIsThereRecord(true);
      console.log(recordedStreamRef);
      recordedStreamRef.current.src = window.URL.createObjectURL(superBuffer);
      recordedStreamRef.current.controls = true;
      recordedStreamRef.current.play();
    } catch (error) {
      console.error("[playVideoRecording] => ", error);
    }
  }

  async function shareScreen(e) {
    try {
      const options = {
        video: true,
        audio: false,
        surfaceSwitching: "include", //include or exclude not boolean
      };

      const mediaStreamVar = await navigator.mediaDevices.getDisplayMedia(
        options
      );

      setMediaStream(mediaStreamVar);
    } catch (error) {
      console.error("[shareScreen] => ", error);
    }
  }

  /**
   *
   * start video recording
   * ||
   * \/
   */
  async function startVideoScreenRecording(e) {
    try {
      if (!mediaStream) {
        alert("no stream/feed available");
        return;
      }
      console.log("start video screen recording");
      ShareRecordedBlob = []; // array to store blobs for playback
      shareMediaRecorder = new MediaRecorder(mediaStream); //make a media recorder from a constructor
      console.log("mediaRecorder =>", shareMediaRecorder);
      shareMediaRecorder.ondataavailable = (e) => {
        // ondataavailable will be run when the media recorder/stream ends, or stopped, or if we ask for it
        console.log("Data is available for recording => ", e);
        ShareRecordedBlob.push(e.data);
        console.log("recordedBlob => ", ShareRecordedBlob);
      };
      shareMediaRecorder.start(); // start recording
      console.log("recordedBlob => ", ShareRecordedBlob);
      // setIsRecordStarted(true);
    } catch (error) {
      console.error("[startVideoScreenRecording] => ", error);
    }
  }
  /**
   *
   * stop video recording
   * ||
   * \/
   */
  async function stopVideoScreenRecording(e) {
    try {
      if (!shareMediaRecorder) {
        alert("There is no media recorder , please record before stopping");
        return;
      }
      shareMediaRecorder.stop();
    } catch (error) {
      console.error("[stopVideoScreenRecording] => ", error);
    }
  }
  /**
   *
   * play video recording
   * ||
   * \/
   */
  async function playVideoScreenRecording(e) {
    try {
      if (!ShareRecordedBlob) {
        alert("There is no records saved ");
        return;
      }
      if (!screenRecordedStreamRef.current) {
        alert("Recorded stream is not available.");
        return;
      }
      const superBuffer = new Blob(ShareRecordedBlob);
      console.log("superBuffer => ", superBuffer);
      setIsThereScreenRecord(true);
      console.log(screenRecordedStreamRef);
      screenRecordedStreamRef.current.src =
        window.URL.createObjectURL(superBuffer);
      screenRecordedStreamRef.current.controls = true;
      screenRecordedStreamRef.current.play();
    } catch (error) {
      console.error("[stopVideoScreenRecording] => ", error);
    }
  }

  /**
   *
   * get a  list of inputs/outputs devices of audio and video
   * ||
   * \/
   */
  async function getDevices(e) {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      console.log(devices);
      setDevices(devices);
    } catch (error) {
      console.error("[getDevices] => ", error);
    }
  }

  /**
   *
   * change audio input
   * ||
   * \/
   */
  async function changeAudioInput(e) {
    // after change , click on show feed again
    try {
      const deviceId = e.target.value;
      setSelectedAudioInput(deviceId);
      const newConstraints = {
        audio: { deviceId: { exact: deviceId } },
        video: true,
      };

      const newStream = await navigator.mediaDevices.getUserMedia(
        newConstraints
      );

      setStream(newStream);
      const tracks = stream.getAudioTracks();
      console.log("stream => ", stream);
      console.log("audio streamTracks => ", tracks);

      // setIsThereStream(true);
    } catch (error) {
      console.error("[changeAudioInput] => ", error);
    }
  }
  /**
   *
   * change audio output
   * ||
   * \/
   */
  async function changeAudioOutput(e) {
    try {
      await localStreamRef.current.setSinkId(e.target.value); // loool, its a promise that will return undefined.

      setSelectedAudioOutput(localStreamRef.current.sinkId);
      console.log(
        "[localStreamRef.current.sinkId] => ",
        localStreamRef.current.sinkId
      );
    } catch (error) {
      console.error("[changeAudioOutput] => ", error);
    }
  }
  /**
   *
   * change video input
   * ||
   * \/
   */
  async function changeVideoInput(e) {
    // after change , click on show feed again
    try {
      const deviceId = e.target.value;
      setSelectedVideoInput(deviceId);
      const newConstraints = {
        audio: true,
        video: { deviceId: { exact: deviceId } },
      };

      const newStream = await navigator.mediaDevices.getUserMedia(
        newConstraints
      );

      setStream(newStream);
      const tracks = stream.getVideoTracks();
      console.log("stream => ", stream);
      console.log("video streamTracks => ", tracks);

      // setIsThereStream(true);
    } catch (error) {
      console.error("[changeVideoInput] => ", error);
    }
  }

  useEffect(() => {
    getDevices();
    // console.log(localStreamRef);
    // console.log("audioInput =>", audioInput);
    // console.log("audioOutput =>", audioOutput);
    // console.log("videoInput =>", videoInput);
  }, []);

  return (
    <div className="bg-[#ddd] h-fit ">
      <h1 className="text-3xl font-bold">VideoCallRoom</h1>
      <div className="container flex justify-center mt-5 gap-3 ">
        <div className="buttons flex flex-col w-full h-full flex-[4] ml-6 p-2">
          <Buttons
            //functions
            getMicAndCamera={getMicAndCamera}
            showMyFeed={showMyFeed}
            stopMyFeed={stopMyFeed}
            changeVideoSize={changeVideoSize}
            startVideoRecording={startVideoRecording}
            stopVideoRecording={stopVideoRecording}
            playVideoRecording={playVideoRecording}
            shareScreen={shareScreen}
            startVideoScreenRecording={startVideoScreenRecording}
            stopVideoScreenRecording={stopVideoScreenRecording}
            playVideoScreenRecording={playVideoScreenRecording}
            changeAudioInput={changeAudioInput}
            changeAudioOutput={changeAudioOutput}
            changeVideoInput={changeVideoInput}
            // --------------------
            // bool
            isThereStream={isThereStream}
            isThereFeed={isThereFeed}
            // --------------------
            // setter states
            setVideoWidth={setVideoWidth}
            videoWidth={videoWidth}
            setVideoHeight={setVideoHeight}
            videoHeight={videoHeight}
            // --------------------

            // calculated variables based on state
            audioInput={audioInput}
            audioOutput={audioOutput}
            videoInput={videoInput}
            // --------------------
            // state for selected tracks
            selectedAudioInput={selectedAudioInput}
            selectedAudioOutput={selectedAudioOutput}
            selectedVideoInput={selectedVideoInput}
            // --------------------
          />
        </div>

        <div className="videos flex-[8] h-full flex flex-col flex-wrap ">
          <VideoSection
            localStreamRef={localStreamRef}
            isThereRecord={isThereRecord}
            isThereScreenRecord={isThereScreenRecord}
            recordedStreamRef={recordedStreamRef}
            screenRecordedStreamRef={screenRecordedStreamRef}
          />
        </div>
      </div>
    </div>
  );
}
