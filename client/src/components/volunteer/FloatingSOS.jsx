// src/components/volunteer/FloatingSOS.jsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Siren,
  PhoneCall,
  X,
  AlertTriangle,
  Send,
} from "lucide-react";
import axios from "axios";

const FloatingSOS = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendSOS = async () => {
    try {
      setLoading(true);

      alert("SOS Alert Sent Successfully!");

      setOpen(false);
    } catch (error) {
      console.log(error);

      alert("Failed to send SOS.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        animate={{
          scale: [1, 1.08, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.2,
        }}
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-8 z-40 flex h-20 w-20 items-center justify-center rounded-full bg-red-600 text-white shadow-2xl hover:bg-red-700"
      >
        {/* Ping Effect */}
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-40"></span>

        <Siren
          size={34}
          className="relative z-10"
        />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />

            {/* Popup */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.8,
                y: 40,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
              }}
              className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-8 shadow-2xl"
            >
              {/* Close */}
              <button
                onClick={() => setOpen(false)}
                className="absolute right-5 top-5 rounded-full bg-slate-100 p-2 hover:bg-slate-200"
              >
                <X size={20} />
              </button>

              {/* Icon */}
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle
                  size={50}
                  className="text-red-600"
                />
              </div>

              <h2 className="mt-6 text-center text-3xl font-bold text-slate-800">
                Emergency SOS
              </h2>

              <p className="mt-3 text-center text-slate-500">
                Send an emergency alert to the Control Room with your
                current location.
              </p>

              {/* Buttons */}
              <div className="mt-8 space-y-3">
                <button
                  disabled={loading}
                  onClick={sendSOS}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-4 font-semibold text-white transition hover:bg-red-700 disabled:opacity-70"
                >
                  <Send size={20} />

                  {loading ? "Sending..." : "Send SOS"}
                </button>

                <button
                  className="flex w-full items-center justify-center gap-2 rounded-xl border py-4 font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  <PhoneCall size={20} />
                  Call Control Room
                </button>

                <button
                  onClick={() => setOpen(false)}
                  className="w-full rounded-xl bg-slate-100 py-4 font-semibold text-slate-700 transition hover:bg-slate-200"
                >
                  Cancel
                </button>
              </div>

              <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                ⚠ This feature should only be used during genuine
                emergencies. Your live location will be shared with the
                Control Room.
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingSOS;