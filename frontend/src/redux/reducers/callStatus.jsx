const initState = {
  current: "idle", // negotiation , progress , complete
  video: "off", //  // video feed status: "off" "enabled" "disabled" "complete"
  audio: "off", // audio is not on
  audioDevice: "default", // chosen audio device
  videoDevice: "default", // chosen video device
  shareScreen: false, // is user sharing screen or not
  haveMedia: false, //has getUserMedia is run or not and if there is localStream
};

export default function callStatus(state = initState, action) {
  if (action.type === "UPDATE_CALL_STATUS") {
    const copyState = { ...state };
    copyState[action.payload.prop] = action.payload.value;
    console.log("copyState: ", copyState);
    return copyState;
  } else if (action.type === "LOGOUT_ACTION" || action.type === "NEW_VERSION") {
    return initState;
  } else {
    return state;
  }
}
