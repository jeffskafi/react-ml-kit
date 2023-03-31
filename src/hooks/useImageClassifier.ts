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

type CustomModel = {
  name: string;
  load: () => Promise<any>;
  classify: (
    model: any,
    img: HTMLImageElement
  ) => Promise<MobileNetPrediction[] | CocoSsdPrediction[]>;
};

interface PredictFromImageProps {
  onPredictions: (predictions: PredictionData | null) => void;
  images: Image[];
  model: "mobilenet" | "coco-ssd" | string; // Allow any string for custom models
  customModel?: CustomModel; // Add optional customModel
}

interface UsePredictFromImageReturn {
  loading: boolean;
  data: PredictionData | null;
}

const registerCustomModel = (customModel: CustomModel) => {
  models[customModel.name] = {
    load: customModel.load,
    classify: customModel.classify,
  };
};

const models: {
  [key: string]: {
    load: () => Promise<any>;
    classify: (
      model: any,
      img: HTMLImageElement
    ) => Promise<MobileNetPrediction[] | CocoSsdPrediction[]>;
  };
} = {
  mobilenet: {
    load: () => mobilenet.load(),
    // classify: (model, img) => model.classify(img),
    classify: (
      model: mobilenet.MobileNet,
      img: HTMLImageElement
    ): Promise<MobileNetPrediction[]> => {
      return model.classify(img);
    },
  },
  "coco-ssd": {
    load: () => cocoSsd.load(),
    // classify: (model, img) => model.detect(img),
    classify: (
      model: cocoSsd.ObjectDetection,
      img: HTMLImageElement
    ): Promise<CocoSsdPrediction[]> => {
      return model.detect(img);
    },
  },
};

const loadModel = async (modelName: string): Promise<any> => {
  // const model = models[modelName];
  const model = models[modelName];
  if (!model) {
    console.warn(`Unknown model name: ${modelName}, using default (mobilenet)`);
    return await mobilenet.load();
  }
  return await model.load();
};

const runModel = async (
  modelName: string,
  model: any,
  img: HTMLImageElement
): Promise<Prediction[]> => {
  let modelFuncs: any = models[modelName];
  if (!modelFuncs) {
    console.warn(`Unknown model name: ${modelName}, using default (mobilenet)`);
    modelFuncs = models["mobilenet"];
  }
  return await modelFuncs.classify(model, img);
};

export const useImageClassifier = ({
  onPredictions,
  images,
  model: modelName,
  customModel,
}: PredictFromImageProps): UsePredictFromImageReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<PredictionData | null>(null);

  if (customModel) {
    registerCustomModel(customModel);
  }

  useEffect(() => {
    let isMounted = true; // Add this flag to prevent memory leaks
    const predict = async (): Promise<void> => {
      try {
        setLoading(true);
        const model = await loadModel(modelName);

        // @ts-expect-error predictions is not assignable to type 'PredictionData'
        const predictions: PredictionData = await Promise.allSettled(
          images.map(async (image: Image): Promise<Prediction[] | null> => {
            const img: HTMLImageElement = document.createElement("img");
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
              img.remove();
            }
          })
        ).then((results) => {
          return results.map((result, index) => {
            if (result.status === "fulfilled") {
              return result.value;
            } else {
              return null;
            }
          });
        });

        if (predictions.every((prediction) => prediction === null)) {
          setData(null);
        } else if (predictions.length) {
          setData(predictions);
        } else {
          setData(null);
        }
        onPredictions(predictions.length ? predictions : null);
      } catch (error) {
        console.error("Error predicting from image", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    predict();

    return () => {
      isMounted = false; // Set flag to false to prevent memory leaks
    };
  }, []);

  return { loading, data };
};
