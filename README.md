# react-ml-kit

A lightweight React library for using machine learning models in the browser.

## Purpose

The purpose of this library is to provide developers with an easy-to-use way of integrating machine learning models into their React applications without relying on third-party API services.

## Description

`react-ml-kit` provides a custom React hook, `usePredictFromImage`, that loads a machine learning model and uses it to predict on one or more images. The hook supports two machine learning models: Mobilenet and COCO-SSD.

The `usePredictFromImage` hook takes three parameters:

- `onPredictions`: A callback function that takes an array of predictions as an argument.
- `images`: An array of image URLs to predict on.
- `model`: A string specifying the machine learning model to use, either "mobilenet" or "coco-ssd".

The `usePredictFromImage` hook returns an object with two properties:

- `loading`: A boolean indicating whether the predictions are being calculated.
- `data`: An array of prediction data in the format `Array<Array<Prediction>>`. Each inner array corresponds to one image, and each prediction object contains the predicted class, probability or score and optionally, the bounding box coordinates.

## Pros and Cons (Use Cases)

### Pros

- Easy to use and integrates with React applications.
- No reliance on third-party API services.
- Supports two popular machine learning models.

### Cons

- Limited to predicting on images only.
- Limited to two machine learning models only.

## Motivation

The motivation behind `react-ml-kit` is to provide developers with a lightweight, easy-to-use solution for integrating machine learning models into their React applications without relying on third-party API services. By using machine learning models on-device, developers can ensure faster, more reliable predictions with reduced privacy concerns. Additionally, developers can easily customize the models or integrate other models as needed.
