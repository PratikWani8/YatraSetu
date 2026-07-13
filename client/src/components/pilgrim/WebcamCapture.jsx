import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  RefreshCw,
  Check,
  X,
  CameraOff,
} from "lucide-react";

const videoConstraints = {
  width: 720,
  height: 720,
  facingMode: "user",
};

const WebcamCapture = ({ onCapture, onClose }) => {
  const webcamRef = useRef(null);

  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();

    if (imageSrc) {
      setCapturedImage(imageSrc);
    }
  }, []);

  const retake = () => {
    setCapturedImage(null);
  };

  const usePhoto = () => {
    if (!capturedImage) return;

    onCapture({
      file: null,
      preview: capturedImage,
      webcam: true,
    });

    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{
            scale: 0.8,
            opacity: 0,
            y: 30,
          }}
          animate={{
            scale: 1,
            opacity: 1,
            y: 0,
          }}
          exit={{
            scale: 0.8,
            opacity: 0,
          }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl overflow-hidden"
        >
          {/* Header */}

          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Camera className="text-blue-600" />
              Capture Pilgrim Photo
            </h2>

            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100"
            >
              <X />
            </button>
          </div>

          {/* Camera */}

          <div className="p-6">
            {!cameraError ? (
              <>
                {!capturedImage ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="overflow-hidden rounded-2xl border"
                  >
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      mirrored
                      screenshotFormat="image/jpeg"
                      videoConstraints={videoConstraints}
                      onUserMediaError={() =>
                        setCameraError(true)
                      }
                      className="w-full"
                    />
                  </motion.div>
                ) : (
                  <motion.img
                    initial={{
                      scale: 0.9,
                      opacity: 0,
                    }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                    }}
                    src={capturedImage}
                    alt="Captured"
                    className="rounded-2xl w-full"
                  />
                )}
              </>
            ) : (
              <div className="flex h-96 flex-col items-center justify-center rounded-xl border">
                <CameraOff
                  size={60}
                  className="text-red-500"
                />

                <p className="mt-4 text-lg font-semibold">
                  Unable to access camera
                </p>

                <p className="text-gray-500">
                  Please allow camera permission.
                </p>
              </div>
            )}

            {/* Buttons */}

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {!capturedImage ? (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={capture}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg hover:bg-blue-700"
                >
                  <Camera size={20} />
                  Capture
                </motion.button>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={retake}
                    className="flex items-center gap-2 rounded-xl bg-gray-200 px-6 py-3 font-semibold hover:bg-gray-300"
                  >
                    <RefreshCw size={18} />
                    Retake
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={usePhoto}
                    className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
                  >
                    <Check size={18} />
                    Use Photo
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WebcamCapture;