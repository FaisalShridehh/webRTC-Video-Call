import updateCallStatus from "../src/redux/actions/updateCallStatus";
function proDashboardSocketListeners(socket, setApptData, dispatch) {
  socket.on("apptData", (apptData) => {
    console.log(apptData);

    setApptData(apptData);
  });

  socket.on("newOfferWaiting", (offerData) => {
    // dispatch the offer to redux so that it is available for later
    dispatch(updateCallStatus("offer", offerData.offer));
    dispatch(updateCallStatus("myRole", "answerer"));
  });
}

function proVideoSocketListeners(socket, addIceCandidateToPc) {
  socket.on("iceToClient", (iceC) => {
    addIceCandidateToPc(iceC);
  });
}

export default { proDashboardSocketListeners, proVideoSocketListeners };
