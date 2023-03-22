// example/src/components/VideoWithOverlay.tsx
import React, { useRef, useEffect } from "react";
import { Face } from "@tensorflow-models/face-detection";

interface VideoWithOverlayProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  faces: Face[];
}

export const VideoWithOverlay: React.FC<VideoWithOverlayProps> = ({
  videoRef,
  faces,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const drawFaces = () => {
      if (canvasRef.current && videoRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
          ctx.strokeStyle = "lime";
          ctx.lineWidth = 2;

          faces.forEach((face) => {
            const [x, y, width, height] = face.boundingBox;
            ctx.strokeRect(x, y, width, height);
          });
        }
      }
    };

    drawFaces();
  }, [faces, canvasRef, videoRef]);

  useEffect(() => {
    if (videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((error) => {
          console.error("Error accessing camera:", error);
        });
    }
  }, [videoRef]);

  return (
    <div style={{ position: "relative" }}>
      <video
        ref={videoRef}
        width="640"
        height="480"
        autoPlay
        playsInline
        muted
        style={{ display: "block" }}
      />
      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
