import { renderHook } from "@testing-library/react-hooks";
import { useImageClassifier } from "../hooks/useImageClassifier";
import * as mobilenet from "@tensorflow-models/mobilenet";

describe("useImageClassifier", () => {
  it("should load and classify the images", async () => {
    const images = [{ url: "mock-url" }];

    mobilenet.load = jest.fn(() =>
      Promise.resolve({
        classify: jest.fn(() =>
          Promise.resolve([{ className: "mock-class", probability: 0.5 }])
        ),
      })
    );

    const onPredictions = jest.fn();

    window.Image = jest.fn(() => ({ remove: jest.fn() }));

    const { result, waitForNextUpdate } = renderHook(() =>
      useImageClassifier({ onPredictions, images })
    );

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate({ timeout: 5000 });

    expect(result.current.loading).toBe(false);
    expect(result.current.data[0][0].className).toBe("mock-class");
    expect(onPredictions).toHaveBeenCalledTimes(1);
    expect(onPredictions).toHaveBeenCalledWith([
      [{ className: "mock-class", probability: 0.5 }],
    ]);
  });

  it("should handle errors", async () => {
    const images = [{ url: "mock-url" }];

    const error = new Error("Error predicting from image");

    mobilenet.load = jest.fn(() =>
      Promise.resolve({
        classify: jest.fn(() => Promise.reject(error)),
      })
    );

    const onPredictions = jest.fn();

    window.Image = jest.fn(() => ({ remove: jest.fn() }));

    const { result, waitForNextUpdate } = renderHook(() =>
      useImageClassifier({ onPredictions, images })
    );

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate({ timeout: 5000 });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(null);
    expect(onPredictions).toHaveBeenCalledTimes(1);
  });
});
