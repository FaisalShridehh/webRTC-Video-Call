import updateCallStatus from "../src/redux/actions/updateCallStatus";

export default function clientSocketListeners(
  socket,
  dispatch,
  addIceCandidateToPc
) {
  socket.on("answerToClient", (answer) => {
    console.log(answer);
    // dispatch the answer to redux so that it is available for later
    dispatch(updateCallStatus("answer", answer));
    dispatch(updateCallStatus("myRole", "offerer"));
  });
  socket.on("iceToClient", (iceC) => {
    addIceCandidateToPc(iceC);
  });
}
