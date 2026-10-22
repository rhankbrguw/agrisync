import { useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { RefreshCw, SwitchCamera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCamera } from '../hooks/useCamera';
import { APP_STRINGS } from '../constants/strings';
import { APP_CONFIG } from '../constants/config';
import { TOKENS } from '../constants/tokens';

interface CameraCaptureProps {
  onCapture: (blob: Blob) => void;
}

const CaptureButton = ({ onCapture }: { onCapture: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.85 }}
    onClick={onCapture}
    className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 sm:w-20 sm:h-20 bg-background/50 backdrop-blur-md rounded-full border border-border flex items-center justify-center shadow-2xl z-20"
    aria-label={APP_STRINGS.UI.CAMERA_CAPTURE}
  >
    <motion.div whileTap={{ scale: 0.8, backgroundColor: 'var(--color-primary)' }} className="w-11 h-11 sm:w-14 sm:h-14 bg-surface rounded-full shadow-inner transition-colors" />
  </motion.button>
);

const FlipButton = ({ onFlip }: { onFlip: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9, rotate: 180 }}
    onClick={onFlip}
    className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-background/80 text-text-main p-2.5 sm:p-3 rounded-full backdrop-blur-md transition-colors flex items-center shadow-lg border border-border z-20"
    aria-label={APP_STRINGS.UI.FLIP_CAMERA}
  >
    <SwitchCamera size={TOKENS.ICON_SIZES.MD} strokeWidth={2.5} className="sm:hidden" />
    <SwitchCamera size={TOKENS.ICON_SIZES.LG} strokeWidth={2.5} className="hidden sm:block" />
  </motion.button>
);

const RetakeButton = ({ onRetake }: { onRetake: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.9 }}
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    onClick={onRetake}
    className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-background/80 text-text-main px-3 py-2 sm:px-4 sm:py-2.5 rounded-full backdrop-blur-md transition-colors flex items-center gap-1.5 sm:gap-2 shadow-lg border border-border z-20"
  >
    <RefreshCw size={TOKENS.ICON_SIZES.MD} strokeWidth={2.5} className="sm:hidden" />
    <RefreshCw size={TOKENS.ICON_SIZES.LG} strokeWidth={2.5} className="hidden sm:block" />
    <span className="text-2xs sm:text-xs font-bold tracking-wide uppercase">{APP_STRINGS.UI.RETAKE_PHOTO}</span>
  </motion.button>
);

export function CameraCapture({ onCapture }: CameraCaptureProps) {
  const { webcamRef, previewUrl, capture, retake } = useCamera(onCapture);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>(APP_CONFIG.CAMERA.FACING_MODE || 'environment');

  const flipCamera = useCallback(() => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  }, []);

  const videoConstraints = {
    width: { ideal: APP_CONFIG.CAMERA.MAX_DIMENSION },
    height: { ideal: APP_CONFIG.CAMERA.IDEAL_HEIGHT },
    facingMode: facingMode,
  };

  if (previewUrl) {
    return (
      <div className="relative mx-auto w-full max-w-md aspect-[3/4] bg-surface rounded-3xl overflow-hidden shadow-2xl border border-border">
        <AnimatePresence>
          {!previewUrl && (
            <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-text-main pointer-events-none z-10" transition={{ duration: TOKENS.DURATION.INSTANT / 1000 }} />
          )}
        </AnimatePresence>
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: TOKENS.ANIMATION.SPRING, damping: 20 }}
          src={previewUrl} alt={APP_STRINGS.UI.PREVIEW_ALT} className="w-full h-full object-cover" 
        />
        <RetakeButton onRetake={retake} />
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-md aspect-[3/4] bg-surface rounded-3xl overflow-hidden shadow-2xl border border-border">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat={APP_CONFIG.CAMERA.FORMAT}
        screenshotQuality={APP_CONFIG.CAMERA.QUALITY}
        videoConstraints={videoConstraints}
        className="w-full h-full object-cover"
      />
      <FlipButton onFlip={flipCamera} />
      <CaptureButton onCapture={capture} />
    </div>
  );
}
