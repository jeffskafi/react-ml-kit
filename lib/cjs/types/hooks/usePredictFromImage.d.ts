type PredictionData = Array<Array<{
    className: string;
    probability: number;
} | {
    bbox: number[];
    class: string;
    score: number;
}>>;
interface Image {
    url: string;
}
interface PredictFromImageProps {
    onPredictions: (predictions: PredictionData | null) => void;
    images: Image[];
    model: "mobilenet" | "coco-ssd";
}
interface UsePredictFromImageReturn {
    loading: boolean;
    data: PredictionData | null;
}
export declare const usePredictFromImage: ({ onPredictions, images, model: modelName, }: PredictFromImageProps) => UsePredictFromImageReturn;
export {};
//# sourceMappingURL=usePredictFromImage.d.ts.map