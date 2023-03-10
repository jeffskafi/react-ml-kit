"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePredictFromImage = void 0;
const react_1 = require("react");
const mobilenet = __importStar(require("@tensorflow-models/mobilenet"));
const cocoSsd = __importStar(require("@tensorflow-models/coco-ssd"));
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
const loadModel = (modelName) => __awaiter(void 0, void 0, void 0, function* () {
    // const model = models[modelName];
    const model = models[modelName];
    if (!model) {
        console.warn(`Unknown model name: ${modelName}, using default (mobilenet)`);
        return yield mobilenet.load();
    }
    return yield model.load();
});
const runModel = (modelName, model, img) => __awaiter(void 0, void 0, void 0, function* () {
    let modelFuncs = models[modelName];
    if (!modelFuncs) {
        console.warn(`Unknown model name: ${modelName}, using default (mobilenet)`);
        modelFuncs = models["mobilenet"];
    }
    return yield modelFuncs.classify(model, img);
});
const usePredictFromImage = ({ onPredictions, images, model: modelName, }) => {
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [data, setData] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const predict = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                setLoading(true);
                // Load the model.
                const model = yield loadModel(modelName);
                const predictions = yield Promise.allSettled(images.map((image) => __awaiter(void 0, void 0, void 0, function* () {
                    const img = document.createElement("img");
                    img.src = image.url;
                    try {
                        const prediction = yield runModel(modelName, model, img);
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
                }))).then((results) => {
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
        });
        predict();
    }, []);
    return { loading, data };
};
exports.usePredictFromImage = usePredictFromImage;
