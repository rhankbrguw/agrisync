import { useRef, useCallback, useState } from 'react';
import type Webcam from 'react-webcam';
import imageCompression from 'browser-image-compression';
import { toast } from 'sonner';
import { APP_STRINGS } from '../constants/strings';
import { APP_CONFIG } from '../constants/config';

export function useCamera(onCapture: (blob: Blob) => void) {
  const webcamRef = useRef<Webcam>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;

    setPreviewUrl(imageSrc);

    try {
      const res = await fetch(imageSrc);
      const rawBlob = await res.blob();

      const compressedFile = await imageCompression(rawBlob as File, {
        maxSizeMB: APP_CONFIG.CAMERA.MAX_SIZE_MB,
        maxWidthOrHeight: APP_CONFIG.CAMERA.MAX_DIMENSION,
        useWebWorker: true,
      });

      onCapture(compressedFile);
    } catch (error) {
      console.error('Camera capture/compression failed:', error);
      toast.error(APP_STRINGS.ERRORS.CAMERA_PROCESS_FAILED);
    }
  }, [onCapture]);

  const retake = useCallback(() => {
    setPreviewUrl(null);
  }, []);

  return { webcamRef, previewUrl, capture, retake };
}
