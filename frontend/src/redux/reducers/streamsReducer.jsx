//this holds all streams as objects
//{
// who
// stream = thing with tracks that plays in <video />
// peerConnection = actual webRTC connection
// }

//local, remote1, remote2+

export default function streamsReducer(state = {}, action) {
  // console.log("streamsReducer called with state: " , state)
  // console.log("streamsReducer called with action: " , action)
  if (action.type === "ADD_STREAM") {
    const copyState = { ...state };
    // console.log("copyState from Add Stream => ", copyState);
    copyState[action.payload.who] = action.payload;
    // console.log("copyState from Add Stream => ", copyState);
    return copyState;
  } else if (action.type === "LOGOUT_ACTION") {
    return {};
  } else {
    return state;
  }
}
