import PropTypes from "prop-types";

export default function Buttons({
  //functions
  getMicAndCamera,
  showMyFeed,
  stopMyFeed,
  changeVideoSize,
  startVideoRecording,
  stopVideoRecording,
  playVideoRecording,
  shareScreen,
  startVideoScreenRecording,
  stopVideoScreenRecording,
  playVideoScreenRecording,
  changeAudioInput,
  changeAudioOutput,
  changeVideoInput,
  // --------------------
  // bool
  isThereStream,
  isThereFeed,
  // --------------------
  // setter states
  setVideoWidth,
  videoWidth,
  setVideoHeight,
  videoHeight,
  // --------------------
  // calculated variables based on state
  audioInput,
  audioOutput,
  videoInput,
  // --------------------
  // state for selected tracks
  selectedAudioInput,
  selectedAudioOutput,
  selectedVideoInput,
  // --------------------
}) {
  // console.log(!isThereStream);
  return (
    <>
      <button
        id="share"
        className={`btn rounded-md p-1 text-white ${
          !isThereStream ? "bg-blue-500" : "bg-green-500"
        } block mb-1 transition-all duration-700`}
        onClick={(e) => getMicAndCamera(e)}
      >
        Share my mic and camera
      </button>
      <button
        id="show-video"
        className={`btn rounded-md  p-1 text-white ${
          !isThereStream
            ? "bg-gray-400 cursor-not-allowed"
            : !isThereFeed
            ? " bg-blue-500"
            : "bg-green-500"
        } block mb-1 transition-all duration-700`}
        onClick={(e) => showMyFeed(e)}
        disabled={!isThereStream}
      >
        Show My Video
      </button>
      <button
        id="stop-video"
        className={`btn rounded-md p-1 text-white ${
          !isThereStream ? "bg-gray-400 cursor-not-allowed" : " bg-blue-500"
        } block mb-1 transition-all duration-700`}
        onClick={(e) => stopMyFeed(e)}
        disabled={!isThereStream}
      >
        Stop My Video
      </button>
      <div className="mb-1 flex flex-wrap gap-1 text-black">
        <button
          id="change-size"
          className={`btn rounded-md p-2 text-white ${
            !isThereFeed ? "bg-gray-400 cursor-not-allowed" : " bg-blue-500"
          } mb-1 transition-all duration-700`}
          disabled={!isThereFeed}
          onClick={(e) => changeVideoSize(e)}
        >
          Change screen size
        </button>
        <input
          type="text"
          id="vid-width"
          className={`border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/3 p-2.5 ${
            !isThereFeed
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gray-50 dark:bg-gray-700 "
          } dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-700`}
          placeholder="Video Width"
          value={videoWidth}
          onChange={(e) => setVideoWidth(parseInt(e.target.value))}
          disabled={!isThereFeed}
        />
        <input
          type="text"
          className={` border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/3 p-2.5 ${
            !isThereFeed
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gray-50 dark:bg-gray-700 "
          } dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-700`}
          placeholder="Video Height"
          id="vid-height"
          value={videoHeight}
          onChange={(e) => setVideoHeight(parseInt(e.target.value))}
          disabled={!isThereFeed}
        />
      </div>
      <div className="mb-1 flex flex-wrap gap-2">
        <button
          id="start-record"
          className={`p-1 text-white ${
            !isThereFeed ? "bg-gray-400 cursor-not-allowed" : " bg-blue-500"
          } mb-1 rounded-md flex-[6] transition-all duration-700`}
          disabled={!isThereFeed}
          onClick={(e) => startVideoRecording(e)}
        >
          Start recording
        </button>
        <button
          id="stop-record"
          className={`p-1 text-white ${
            !isThereFeed ? "bg-gray-400 cursor-not-allowed" : " bg-blue-500"
          } mb-1 rounded-md flex-[6] transition-all duration-700`}
          disabled={!isThereFeed}
          onClick={(e) => stopVideoRecording(e)}
        >
          Stop Recording
        </button>
        <button
          id="play-record"
          className={`p-1 text-white ${
            !isThereFeed ? "bg-gray-400 cursor-not-allowed" : " bg-blue-500"
          } mb-1 rounded-md flex-1 transition-all duration-700`}
          disabled={!isThereFeed}
          onClick={(e) => playVideoRecording(e)}
        >
          Play Recording
        </button>
      </div>
      <div className="mb-1 flex flex-wrap gap-2">
        <button
          id="share-screen"
          className={`p-1  text-white ${
            // !isThereFeed ? "bg-gray-400 cursor-not-allowed" : " bg-blue-500"
            !isThereFeed ? "bg-gray-400 " : " bg-blue-500"
          } block mb-1 rounded-md transition-all duration-700`}
          // disabled={!isThereFeed}
          onClick={(e) => shareScreen(e)}
        >
          Share Screen
        </button>
        <button
          id="start-screen-record"
          className={`p-1 text-white ${
            !isThereFeed ? "bg-gray-400 cursor-not-allowed" : " bg-blue-500"
          } mb-1 rounded-md flex-[6] transition-all duration-700`}
          disabled={!isThereFeed}
          onClick={(e) => startVideoScreenRecording(e)}
        >
          Start screen recording
        </button>
        <button
          id="stop-screen-record"
          className={`p-1 text-white ${
            !isThereFeed ? "bg-gray-400 cursor-not-allowed" : " bg-blue-500"
          } mb-1 rounded-md flex-[6] transition-all duration-700`}
          disabled={!isThereFeed}
          onClick={(e) => stopVideoScreenRecording(e)}
        >
          Stop screen Recording
        </button>
        <button
          id="play-screen-record"
          className={`p-1 text-white ${
            !isThereFeed ? "bg-gray-400 cursor-not-allowed" : " bg-blue-500"
          } mb-1 rounded-md flex-1 transition-all duration-700`}
          disabled={!isThereFeed}
          onClick={(e) => playVideoScreenRecording(e)}
        >
          Play screen Recording
        </button>
      </div>
      <div>
        <label
          htmlFor="audio-input"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Select audio input:
        </label>
        <select
          id="audio-input"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={selectedAudioInput}
          onChange={(e) => changeAudioInput(e)}
        >
          {audioInput.map((input) => (
            <option key={input.deviceId} value={input.deviceId}>
              {input.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="audio-output"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Select audio output:
        </label>
        <select
          id="audio-output"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={selectedAudioOutput}
          onChange={(e) => changeAudioOutput(e)}
        >
          {audioOutput.map((input) => (
            <option key={input.deviceId} value={input.deviceId}>
              {input.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="video-input"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Select video input:
        </label>
        <select
          id="video-input"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={selectedVideoInput}
          onChange={(e) => changeVideoInput(e)}
        >
          {videoInput.map((input) => (
            <option key={input.deviceId} value={input.deviceId}>
              {input.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

Buttons.propTypes = {
  getMicAndCamera: PropTypes.func,
  showMyFeed: PropTypes.func,
  stopMyFeed: PropTypes.func,
  changeVideoSize: PropTypes.func,
  startVideoRecording: PropTypes.func,
  stopVideoRecording: PropTypes.func,
  playVideoRecording: PropTypes.func,
  startVideoScreenRecording: PropTypes.func,
  stopVideoScreenRecording: PropTypes.func,
  playVideoScreenRecording: PropTypes.func,
  shareScreen: PropTypes.func,
  isThereStream: PropTypes.bool,
  isThereFeed: PropTypes.bool,
  setVideoWidth: PropTypes.func,
  videoWidth: PropTypes.number,
  setVideoHeight: PropTypes.func,
  videoHeight: PropTypes.number,
  audioInput: PropTypes.array,
  audioOutput: PropTypes.array,
  videoInput: PropTypes.array,
  changeAudioInput: PropTypes.any,
  changeAudioOutput: PropTypes.any,
  changeVideoInput: PropTypes.any,
  selectedAudioInput: PropTypes.any,
  selectedAudioOutput: PropTypes.any,
  selectedVideoInput: PropTypes.any,
};
