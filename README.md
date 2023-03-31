
  

# React ML Kit

React ML Kit is a collection of React hooks that allow you to easily integrate AI functionalities using machine learning models directly in the browser. These hooks are designed to be user-friendly and efficient, providing developers with an easy way to add AI capabilities to their applications without extensive knowledge in machine learning.

## Installation
```
npm install react-ml-kit
```
or
```
yarn add react-ml-kit
```

## Hooks
### useImageClassifier
This hook is used for classifying images using pre-trained models. It currently supports TensorFlow.js models `MobileNet`, `COCO-SSD`, and custom models.

#### Usage
```
import { useImageClassifier } from "react-ml-kit";
const { loading, data } = useImageClassifier({ onPredictions, images, model: "mobilenet" | "coco-ssd" | "custom", customModel });
```

`onPredictions` is a callback function that receives the prediction data when it becomes available. `images` is an array of image objects with a `url` property. `model` is a string indicating which model to use: `"mobilenet"`, `"coco-ssd"`, or a custom model name.

For custom models, you need to provide a `customModel` object with the following properties:
-  `name`: A unique string identifier for your custom model.
-  `load`: An async function that loads your custom model.
-  `classify`: An async function that runs your custom model classification on an `HTMLImageElement`.


Example of a custom model object:
```
const customModel = {
  name: "my-custom-model",
  load: async () => {
    // Load your custom model here
  },
  classify: async (model, img) => {
    // Run your custom model classification here
  },
};
```

The hook returns an object with two properties: `loading` (a boolean indicating whether the model is currently processing the image) and `data` (an array containing the prediction results).
Prediction results include the class name, probability (for MobileNet), and bounding box coordinates, class, and score (for COCO-SSD).
### `useFaceDetection`
This hook is used for detecting faces in a video stream. It utilizes the MediaPipe Face Detection model from TensorFlow.js.
#### Usage
```
import { useFaceDetection } from "react-ml-kit";
const faces = useFaceDetection(videoRef, options);
```
`videoRef` is a React ref pointing to an HTMLVideoElement, and `options` is an optional object to customize the face detection behavior.
The hook returns an array of `Face` objects, where each face contains information about its position and landmarks.
A `Face` object includes properties such as `boundingBox`, `landmarks`, and `scaledMesh`. The `boundingBox` property contains the coordinates of the rectangular area surrounding the face. The `landmarks` property is an array of facial landmarks, such as the eyes, nose, and mouth. The `scaledMesh` property is an array of 3D facial landmarks, which can be used to create a 3D mesh of the face.

## Use Cases
1. Object recognition in images: Easily identify objects within images and provide relevant information or actions based on the detected objects.
2. Face detection and tracking in video streams: Implement real-time face tracking for video chat applications, AR filters, or facial expression analysis.
3. Image classification for content moderation: Automatically filter out inappropriate images in user-generated content.
4. Accessibility: Describe images for visually impaired users by identifying objects and their positions within the images.
5. AI-based search: Enhance search functionality within an application by allowing users to search for specific objects or features within images.

# License
React ML Kit is an open-source project, and the code is available under the MIT License. Feel free to contribute or use the library in your projects.