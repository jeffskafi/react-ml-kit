import React, { useRef } from "react";
import { useFaceDetection } from "react-ml-kit";
import { VideoWithOverlay } from "./components/VideoWithOverlay";

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const faces = useFaceDetection(videoRef);

  return (
    <div className="App">
      <VideoWithOverlay videoRef={videoRef} faces={faces} />
    </div>
  );
}

export default App;
