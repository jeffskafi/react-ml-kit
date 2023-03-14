import { useEffect, useState } from "react";
import Upscaler from "upscaler";

interface Image {
  url: string;
}

interface UpscaleProps {
  onUpscaled: (result: string) => void;
  images: Image[];
  upscaleFactor?: number;
}

interface UseUpscalerReturn {
  loading: boolean;
  data: string | null;
}

export const useUpscaleImage = ({
  onUpscaled,
  images,
}: UpscaleProps): UseUpscalerReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    const upscale = async (): Promise<void> => {
      try {
        setLoading(true);

        const upscaler = new Upscaler();
        const results = await Promise.allSettled(
          images.map(async (image: Image) => {
            console.log("image: ", image);
            console.log("image.url: ", image.url);
            const result = await upscaler.upscale(image.url);
            return result;
          })
        );
        const outputData = results
          .filter(
            (result): result is PromiseFulfilledResult<any> =>
              result.status === "fulfilled"
          )
          .map((result) => {
            return result.value;
          });
        setData(outputData.length ? outputData[0] : null);
        onUpscaled(outputData.length ? outputData[0] : null);
      } catch (error) {
        console.error("Error upscaling image", error);
      } finally {
        setLoading(false);
      }
    };

    upscale();
  }, []);

  return { loading, data };
};
