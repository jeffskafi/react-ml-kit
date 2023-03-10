import { useEffect, useState } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
require("@tensorflow/tfjs-backend-cpu");
require("@tensorflow/tfjs-backend-webgl");
console.log("MobileNetPrediction");
const models = {
    mobilenet: {
        load: () => mobilenet.load(),
        // classify: (model, img) => model.classify(img),
        classify: (model, img) => {
            return model.classify(img);
        },
    },
    "coco-ssd": {
        load: () => cocoSsd.load(),
        // classify: (model, img) => model.detect(img),
        classify: (model, img) => {
            return model.detect(img);
        },
    },
};
const loadModel = async (modelName) => {
    // const model = models[modelName];
    const model = models[modelName];
    if (!model) {
        console.warn(`Unknown model name: ${modelName}, using default (mobilenet)`);
        return await mobilenet.load();
    }
    return await model.load();
};
const runModel = async (modelName, model, img) => {
    let modelFuncs = models[modelName];
    if (!modelFuncs) {
        console.warn(`Unknown model name: ${modelName}, using default (mobilenet)`);
        modelFuncs = models["mobilenet"];
    }
    return await modelFuncs.classify(model, img);
};
export const usePredictFromImage = ({ onPredictions, images, model: modelName, }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    useEffect(() => {
        const predict = async () => {
            try {
                setLoading(true);
                // Load the model.
                const model = await loadModel(modelName);
                const predictions = await Promise.allSettled(images.map(async (image) => {
                    const img = document.createElement("img");
                    img.src = image.url;
                    try {
                        const prediction = await runModel(modelName, model, img);
                        return prediction;
                    }
                    catch (error) {
                        console.error("Error predicting from image", error);
                        return null;
                    }
                    finally {
                        // delete img element
                        img.remove();
                    }
                })).then((results) => {
                    return results
                        .filter((result) => result.status === "fulfilled")
                        .map((result) => result.value);
                });
                if (predictions.every((prediction) => prediction === null)) {
                    setData(null);
                    // else if array is only nulls (i.e. no predictions)
                }
                else if (predictions.length) {
                    setData(predictions);
                }
                else {
                    setData(null);
                }
                onPredictions(predictions.length ? predictions : null);
            }
            catch (error) {
                console.error("Error predicting from image", error);
            }
            finally {
                setLoading(false);
            }
        };
        predict();
    }, []);
    return { loading, data };
};
