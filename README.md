# react-ml-kit

A lightweight React library for using machine learning models in the browser.

## Purpose

The purpose of this library is to provide developers with an easy-to-use way of integrating machine learning models into their React applications without relying on third-party API services.

## Installation

To install the `react-ml-kit` package, run the following command:

bashCopy code

`npm install react-ml-kit`

## Usage

To use `react-ml-kit` in your React app, first import the custom React hook:

javascriptCopy code

`import { useImageClassifier } from 'react-ml-kit';`

Next, use the `useImageClassifier` hook in your component:

javascriptCopy code

`const { loading, data } = useImageClassifier(onPredictions, images, model);`

The `useImageClassifier` hook takes three parameters:

- `onPredictions`: A callback function that takes an array of predictions as an argument.
- `images`: An array of image URLs to predict on.
- `model`: A string specifying the machine learning model to use, either "mobilenet" or "coco-ssd".

The `useImageClassifier` hook returns an object with two properties:

- `loading`: A boolean indicating whether the predictions are being calculated.
- `data`: An array of prediction data in the format `Array<Array<Prediction>>`. Each inner array corresponds to one image, and each prediction object contains the predicted class, probability or score, and optionally, the bounding box coordinates.

## Pros and Cons (Use Cases)

### Pros

- Easy to use and integrates with React applications.
- No reliance on third-party API services.
- Supports two popular machine learning models.

### Cons

- Limited to predicting on images only.
- Limited to two machine learning models only.

## Motivation

The motivation behind `react-ml-kit` is to provide developers with a lightweight, easy-to-use solution for integrating machine learning models into their React applications without relying on third-party API services
