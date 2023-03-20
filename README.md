# React ML Kit

React ML Kit is a collection of React hooks that allow you to easily integrate AI functionalities using machine learning models directly in the browser. These hooks are designed to be user-friendly and efficient, providing developers with an easy way to add AI capabilities to their applications without extensive knowledge in machine learning.

## Installation

bashCopy code

`npm install react-ml-kit`

## Hooks

### useImageClassifier

This hook is used for classifying images using pre-trained models. It currently supports TensorFlow.js models MobileNet and COCO-SSD.

javascriptCopy code

`import  { useImageClassifier }  from  "react-ml-kit";`

#### Usage

javascriptCopy code

`const  { loading, data } =  useImageClassifier({ onPredictions, images,  model:  "mobilenet"|  "coco-ssd", });`

### useFaceDetection

This hook is used for detecting faces in a video stream. It utilizes the MediaPipe Face Detection model from TensorFlow.js.

javascriptCopy code

`import  { useFaceDetection }  from  "react-ml-kit";`

#### Usage

javascriptCopy code

`const  faces =  useFaceDetection(videoRef, options);`

## Use Cases

1.  Object recognition in images: Easily identify objects within images and provide relevant information or actions based on the detected objects.
2.  Face detection and tracking in video streams: Implement real-time face tracking for video chat applications, AR filters, or facial expression analysis.
3.  Image classification for content moderation: Automatically filter out inappropriate images in user-generated content.
4.  Accessibility: Describe images for visually impaired users by identifying objects and their positions within the images.
5.  AI-based search: Enhance search functionality within an application by allowing users to search for specific objects or features within images.
