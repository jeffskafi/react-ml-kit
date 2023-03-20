import { renderHook } from "@testing-library/react-hooks";
import { useFaceDetection } from "../hooks/useFaceDetection";
import * as faceDetection from "@tensorflow-models/face-detection";
import * as tf from "@tensorflow/tfjs";

jest.mock("@tensorflow/tfjs");
jest.mock("@tensorflow-models/face-detection");

const mockDetector = {
  estimateFaces: jest.fn(),
};

describe("useFaceDetection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    tf.setBackend.mockImplementation(() => Promise.resolve());
    faceDetection.createDetector.mockResolvedValue(mockDetector);
  });

  it("should detect faces in the video", async () => {
    const videoRef = { current: { readyState: 4 } };
    const options = {};
    mockDetector.estimateFaces.mockResolvedValue([
      { topLeft: [10, 20], bottomRight: [30, 40] },
    ]);

    const { result, waitForNextUpdate } = renderHook(() =>
      useFaceDetection(videoRef, options)
    );

    await waitForNextUpdate();

    expect(result.current.length).toBe(1);
    expect(result.current[0].topLeft).toEqual([10, 20]);
    expect(result.current[0].bottomRight).toEqual([30, 40]);
  });

  it("should handle errors", async () => {
    const videoRef = { current: { readyState: 4 } };
    const options = {};

    mockDetector.estimateFaces.mockRejectedValue(
      new Error("Error detecting faces")
    );

    const { result, waitForNextUpdate } = renderHook(() =>
      useFaceDetection(videoRef, options)
    );

    await waitForNextUpdate();

    expect(result.current).toEqual([]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
