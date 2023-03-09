import { useEffect, useState } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
require("@tensorflow/tfjs-backend-cpu");
require("@tensorflow/tfjs-backend-webgl");

interface MobileNetPrediction {
  className: string;
  probability: number;
}

interface CocoSsdPrediction {
  bbox: number[];
  class: string;
  score: number;
}

type Prediction = MobileNetPrediction | CocoSsdPrediction;

type PredictionData = Array<
  Array<
    | {
        className: string;
        probability: number;
      }
    | { bbox: number[]; class: string; score: number }
  >
>;

interface Image {
  url: string;
}

interface PredictFromImageProps {
  onPredictions: (predictions: PredictionData | undefined) => void;
  images: Image[];
  model: "mobilenet" | "coco-ssd";
}

interface UsePredictFromImageReturn {
  loading: boolean;
  data: PredictionData | null;
}

const models = {
  mobilenet: {
    load: () => mobilenet.load(),
    classify: (model, img) => model.classify(img),
  },
  "coco-ssd": {
    load: () => cocoSsd.load(),
    classify: (model, img) => model.detect(img),
  },
};

const loadModel = async (modelName: string): Promise<any> => {
  const model = models[modelName];
  if (!model) {
    console.warn(`Unknown model name: ${modelName}, using default (mobilenet)`);
    return await mobilenet.load();
  }
  return await model.load();
};

const runModel = async (
  modelName: string,
  model,
  img
): Promise<Prediction[]> => {
  let modelFuncs = models[modelName];
  if (!modelFuncs) {
    console.warn(`Unknown model name: ${modelName}, using default (mobilenet)`);
    modelFuncs = models["mobilenet"];
  }
  return await modelFuncs.classify(model, img);
};

export const usePredictFromImage = ({
  onPredictions,
  images,
  model: modelName,
}: PredictFromImageProps): UsePredictFromImageReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<PredictionData | null>(null);

  useEffect(() => {
    const predict = async (): Promise<void> => {
      try {
        setLoading(true);
        // Load the model.
        const model = await loadModel(modelName);

        const predictions: PredictionData = await Promise.allSettled(
          images.map(async (image: Image): Promise<Prediction[]> => {
            const img = document.createElement("img");
            img.src = image.url;
            try {
              const prediction: Prediction[] = await runModel(
                modelName,
                model,
                img
              );
              return prediction;
            } catch (error) {
              console.error("Error predicting from image", error);
              return null;
            } finally {
              // delete img element
              img.remove();
            }
          })
        ).then((results) => {
          return results
            .filter(
              (result): result is PromiseFulfilledResult<Prediction[]> =>
                result.status === "fulfilled"
            )
            .map((result) => result.value);
        });

        if (predictions.every((prediction) => prediction === null)) {
          setData(null);
          // else if array is only nulls (i.e. no predictions)
        } else if (predictions.length) {
          setData(predictions);
        } else {
          setData(null);
        }
        onPredictions(predictions.length ? predictions : null);
      } catch (error) {
        console.error("Error predicting from image", error);
      } finally {
        setLoading(false);
      }
    };

    predict();
  }, []);

  return { loading, data };
};
