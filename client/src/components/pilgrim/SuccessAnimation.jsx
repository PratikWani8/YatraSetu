import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  X,
} from "lucide-react";

const SuccessAnimation = ({
  open,
  onClose,
}) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const resize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  if (!open) return null;

  return (
    <>
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={350}
        gravity={0.15}
      />

      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
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
              scale: 0.9,
              opacity: 0,
            }}
            transition={{
              type: "spring",
              stiffness: 120,
            }}
            className="relative max-h-[95vh] w-full max-w-5xl overflow-auto rounded-3xl bg-white shadow-2xl"
          >
            {/* Close */}

            <button
              onClick={onClose}
              className="absolute right-5 top-5 rounded-full p-2 hover:bg-gray-100"
            >
              <X />
            </button>

            {/* Header */}

            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center text-white">
              <motion.div
                initial={{
                  scale: 0,
                  rotate: -180,
                }}
                animate={{
                  scale: 1,
                  rotate: 0,
                }}
                transition={{
                  duration: 0.6,
                }}
              >
                <CheckCircle2
                  size={90}
                  className="mx-auto"
                />
              </motion.div>

              <h1 className="mt-5 text-4xl font-bold">
                Registration Successful
              </h1>

              <p className="mt-2 text-lg opacity-90">
                Pilgrim registered successfully.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default SuccessAnimation;