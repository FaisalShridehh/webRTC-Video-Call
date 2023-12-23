import { Route, Routes } from "react-router-dom";
import VideoPlayGround from "./pages/Video-Play-Ground/VideoPlayGround";
import Home from "./pages/Home/Home";
import RtcPeerConnection from "./pages/Rtc-Peer-Connection/RtcPeerConnection";
import VideoRoom from "./pages/VideoRoom/VideoRoom";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProVideoRoom from "./pages/ProVideoRoom/ProVideoRoom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/video-playground" element={<VideoPlayGround />} />
        <Route path="/peer-connection" element={<RtcPeerConnection />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/video-room" element={<VideoRoom />} />
        <Route path="/pro-video-room" element={<ProVideoRoom />} />
        {/* <Route path="*" element={<Error />} /> */}
      </Routes>
    </>
  );
}

export default App;
