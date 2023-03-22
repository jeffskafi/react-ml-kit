# React ML Kit Example

This example demonstrates how to use the `useFaceDetection` hook from the `react-ml-kit` library. The demo app initializes the user's camera, displays the video feed, and uses the `useFaceDetection` hook to detect faces in real-time. It then draws a rectangle around each detected face using a canvas.

## Prerequisites

Before running the example, make sure you have [Node.js](https://nodejs.org/) and either [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/) installed on your system.

## Installation

1. Navigate to the `example` directory:

`cd example`

2. Install the dependencies:

`npm install`

or

`yarn install`

## Running the Example

1. Start the development server:

`npm start`

or

`yarn start`

2. Open your browser and visit [http://localhost:3000](http://localhost:3000).

3. Allow access to your camera when prompted.

4. Observe the face detection working in real-time, with rectangles being drawn around detected faces.

## How to Use

To use this example in your own project, first install the `react-ml-kit`library:

`npm install react-ml-kit`

Then, import the `useFaceDetection` hook and other relevant components as needed. Make sure you also have the necessary dependencies installed. Refer to the `App.tsx` file inthe `example/src` directory to see how the `useFaceDetection` hook is used within the `App` component. Feel free to modify the code and experiment with other hooks from the `react-ml-kit` library.
