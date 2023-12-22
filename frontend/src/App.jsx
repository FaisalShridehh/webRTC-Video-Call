import {Route, Routes } from "react-router-dom";
import VideoPlayGround from "./pages/Video-Play-Ground/VideoPlayGround";
import Home from "./pages/Home/Home";
import RtcPeerConnection from "./pages/Rtc-Peer-Connection/RtcPeerConnection";
import VideoRoom from "./pages/VideoRoom/VideoRoom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/video-playground" element={<VideoPlayGround />} />
        <Route path="/peer-connection" element={<RtcPeerConnection />} />
        <Route path="/video-room" element={<VideoRoom />} />
        {/* <Route path="*" element={<Error />} /> */}
      </Routes>
    </>
  );
}

export default App;
