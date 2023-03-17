import { useState, useEffect, RefObject } from "react";
import * as tf from "@tensorflow/tfjs";
import {
  createDetector,
  SupportedModels,
  MediaPipeFaceDetectorTfjs,
  Face,
} from "@tensorflow-models/face-detection";
import * as mpFaceDetection from "@mediapipe/face_detection";

export const useFaceDetection = (
  videoRef: RefObject<HTMLVideoElement>,
  options
): Face[] => {
  const [detector, setDetector] = useState<MediaPipeFaceDetectorTfjs | null>(
    null
  );
  const [faces, setFaces] = useState<Face[]>([]);

  useEffect(() => {
    const loadModel = async () => {
      await tf.setBackend("webgl");
      const model = SupportedModels.MediaPipeFaceDetector;
      const detectorInstance = await createDetector(model, {
        runtime: "mediapipe",
        modelType: "short",
        maxFaces: 1,
        solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@${mpFaceDetection.VERSION}`,
      });
      setDetector(detectorInstance as MediaPipeFaceDetectorTfjs);
    };
    loadModel();
  }, []);

  useEffect(() => {
    let animationId: number;
    const detectFaces = async () => {
      if (videoRef.current && detector && videoRef.current.readyState === 4) {
        const detectedFaces = await detector.estimateFaces(
          videoRef.current,
          options
        );
        setFaces(detectedFaces as Face[]);
      }
      animationId = requestAnimationFrame(detectFaces);
    };

    const startDetection = async () => {
      await detectFaces();
    };

    startDetection();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [videoRef, detector, options]);

  return faces;
};
