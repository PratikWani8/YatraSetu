import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";
import { motion } from "framer-motion";
import { getToken } from "../../utils/auth";
import VolunteerSidebar from "../../components/volunteer/VolunteerSidebar";
import { BASE_URL } from "../../api/api";

import {
  QrCode,
  User,
  Phone,
 HeartPulse,
  MapPin,
  AlertCircle,
  Loader2,
  Shield,
  Droplets,
  Calendar,
  ScanLine,
  RefreshCcw,
} from "lucide-react";

const ScanQR = () => {
  const scannerRef = useRef(null);

  const [pilgrim, setPilgrim] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [scannerStarted, setScannerStarted] =
    useState(false);

  /* ======================================================
      Start Scanner
  ====================================================== */

  useEffect(() => {
    startScanner();

    return () => {
      stopScanner();
    };
  }, []);

  /* ======================================================
      Start Scanner
  ====================================================== */

  const startScanner = () => {
    if (scannerStarted) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,

        qrbox: {
          width: 260,
          height: 260,
        },

        rememberLastUsedCamera: true,
      },
      false
    );

    scanner.render(onScanSuccess, onScanFailure);

    scannerRef.current = scanner;

    setScannerStarted(true);
  };

  /* ======================================================
      Stop Scanner
  ====================================================== */

  const stopScanner = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.clear();

        scannerRef.current = null;

        setScannerStarted(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  /* ======================================================
      Scan Failed
  ====================================================== */

  const onScanFailure = () => {};

  /* ======================================================
      Scan Success
  ====================================================== */

  const onScanSuccess = async (decodedText) => {
    try {
      setLoading(true);

      setError("");

      await stopScanner();
      
      const token = getToken();

      let pilgrimId = decodedText;

      // JSON QR Support

      try {
         pilgrimId = JSON.parse(decodedText).pilgrimId;
        } catch (err) {
          pilgrimId = decodedText;
        }

      // With GPS

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const latitude =
              position.coords.latitude;

            const longitude =
              position.coords.longitude;

            const res = await axios.get(

              `${BASE_URL}/api/qr/scan/${pilgrimId}`,

              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },

                params: {
                  latitude,
                  longitude,
                },
              }
            );

            setPilgrim(res.data.pilgrim);
          } catch (err) {
            setError(
              err.response?.data?.message ||
                "Pilgrim not found."
            );
          } finally {
            setLoading(false);
          }
        },

        // GPS Permission Denied

        async () => {
          try {
            const res = await axios.get(

              `${BASE_URL}/api/qr/scan/${pilgrimId}`,

              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            setPilgrim(res.data.pilgrim);
          } catch (err) {
            setError(
              err.response?.data?.message ||
                "Pilgrim not found."
            );
          } finally {
            setLoading(false);
          }
        }
      );
    } catch (err) {
      console.log(err);

      setLoading(false);

      setError("Unable to scan QR.");
    }
  };

  /* ======================================================
      Scan Again
  ====================================================== */

  const handleScanAgain = async () => {
    setPilgrim(null);

    setError("");

    await stopScanner();

    startScanner();
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <VolunteerSidebar />

      <main className="flex-1 p-8">

        {/* Header */}

        <motion.div

          initial={{ opacity: 0, y: -20 }}

          animate={{ opacity: 1, y: 0 }}

          className="mb-8 flex items-center justify-between"
        >
          <div>

            <h1 className="text-3xl font-bold text-slate-800">

              Scan Pilgrim QR

            </h1>

            <p className="mt-2 text-slate-500">

              Scan pilgrim identity cards to retrieve
              registration details instantly.

            </p>

          </div>

          <button

            onClick={handleScanAgain}

            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
          >
            <RefreshCcw size={18} />

            Scan Again

          </button>
        </motion.div>

        <div className="grid gap-8 xl:grid-cols-2">

          {/* Scanner */}

          <motion.div

            initial={{ opacity: 0, x: -20 }}

            animate={{ opacity: 1, x: 0 }}

            className="rounded-3xl bg-white p-6 shadow-lg"
          >
            <div className="mb-6 flex items-center gap-3">

              <div className="rounded-xl bg-blue-100 p-3">

                <ScanLine className="text-blue-600" />

              </div>

              <div>

                <h2 className="text-xl font-bold">

                  QR Scanner

                </h2>

                <p className="text-sm text-gray-500">

                  Align QR code inside the frame

                </p>

              </div>

            </div>

            {loading ? (

              <div className="flex h-[420px] flex-col items-center justify-center">

                <Loader2
                  className="animate-spin text-blue-600"
                  size={60}
                />

                <p className="mt-5 font-medium">

                  Fetching pilgrim details...

                </p>

              </div>

            ) : (

              <div id="reader"></div>

            )}

            {error && (

              <div className="mt-5 rounded-xl bg-red-50 p-4 text-red-600">

                <div className="flex items-center gap-3">

                  <AlertCircle />

                  {error}

                </div>

              </div>

            )}

          </motion.div>

          {/* RESULT CARD STARTS HERE */}

          <motion.div

            initial={{ opacity: 0, x: 20 }}

            animate={{ opacity: 1, x: 0 }}

            className="rounded-3xl bg-white p-6 shadow-lg"
          >
            {!pilgrim ? (

              <div className="flex h-full flex-col items-center justify-center text-center">

                <QrCode
                  size={90}
                  className="text-slate-300"
                />

                <h2 className="mt-6 text-2xl font-bold">

                  Waiting for QR...

                </h2>

                <p className="mt-3 max-w-sm text-slate-500">

                  Scan a pilgrim QR code to view
                  registration details, medical
                  information and emergency contacts.

                </p>

              </div>

            ) : (

              <>
                              {/* Profile Header */}
                <div className="flex flex-col items-center gap-5 sm:flex-row">
                  <img
                    src={
                      pilgrim.photo
                        ? `http://localhost:5000${pilgrim.photo}`
                        : "https://ui-avatars.com/api/?name=" +
                          encodeURIComponent(pilgrim.name)
                    }
                    alt={pilgrim.name}
                    className="h-32 w-32 rounded-2xl border-4 border-blue-100 object-cover"
                  />

                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-slate-800">
                      {pilgrim.name}
                    </h2>

                    <p className="mt-1 text-slate-500">
                      Pilgrim ID : {pilgrim.pilgrimId}
                    </p>

                    <span
                      className={`mt-4 inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
                        pilgrim.status === "Registered"
                          ? "bg-green-100 text-green-700"
                          : pilgrim.status === "Medical"
                          ? "bg-red-100 text-red-700"
                          : pilgrim.status === "Checked-In"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {pilgrim.status}
                    </span>
                  </div>
                </div>

                {/* Information Cards */}
                <div className="mt-8 grid gap-4 sm:grid-cols-2">

                  <div className="rounded-2xl bg-blue-50 p-5">
                    <User className="mb-3 text-blue-600" />
                    <p className="text-sm text-slate-500">
                      Gender
                    </p>
                    <h3 className="mt-1 text-lg font-semibold">
                      {pilgrim.gender}
                    </h3>
                  </div>

                  <div className="rounded-2xl bg-green-50 p-5">
                    <Phone className="mb-3 text-green-600" />
                    <p className="text-sm text-slate-500">
                      Mobile
                    </p>
                    <h3 className="mt-1 text-lg font-semibold">
                      {pilgrim.mobile}
                    </h3>
                  </div>

                  <div className="rounded-2xl bg-red-50 p-5">
                    <HeartPulse className="mb-3 text-red-600" />
                    <p className="text-sm text-slate-500">
                      Blood Group
                    </p>
                    <h3 className="mt-1 text-lg font-semibold">
                      {pilgrim.bloodGroup}
                    </h3>
                  </div>

                  <div className="rounded-2xl bg-yellow-50 p-5">
                    <MapPin className="mb-3 text-yellow-600" />
                    <p className="text-sm text-slate-500">
                      Address
                    </p>
                    <h3 className="mt-1 text-lg font-semibold">
                      {pilgrim.address || "Not Available"}
                    </h3>
                  </div>

                  <div className="rounded-2xl bg-purple-50 p-5">
                    <Shield className="mb-3 text-purple-600" />
                    <p className="text-sm text-slate-500">
                      Emergency Contact
                    </p>

                    <h3 className="mt-1 text-lg font-semibold">
                      {pilgrim.emergencyName}
                    </h3>

                    <p className="text-blue-600">
                      {pilgrim.emergencyNumber}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-pink-50 p-5">
                    <HeartPulse className="mb-3 text-pink-600" />
                    <p className="text-sm text-slate-500">
                      Medical History
                    </p>

                    <h3 className="mt-1 text-lg font-semibold">
                      {pilgrim.medicalHistory || "None"}
                    </h3>
                  </div>

                  <div className="rounded-2xl bg-cyan-50 p-5">
                    <Droplets className="mb-3 text-cyan-600" />
                    <p className="text-sm text-slate-500">
                      Allergies
                    </p>

                    <h3 className="mt-1 text-lg font-semibold">
                      {pilgrim.allergies || "None"}
                    </h3>
                  </div>

                  <div className="rounded-2xl bg-indigo-50 p-5">
                    <Calendar className="mb-3 text-indigo-600" />
                    <p className="text-sm text-slate-500">
                      Registration Date
                    </p>

                    <h3 className="mt-1 text-lg font-semibold">
                      {new Date(
                        pilgrim.registrationDate
                      ).toLocaleDateString()}
                    </h3>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">

                  <button
                    className="flex-1 rounded-xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700"
                  >
                    View Complete Profile
                  </button>

                  <button
                    onClick={handleScanAgain}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-200 py-4 font-semibold text-slate-700 transition hover:bg-slate-300"
                  >
                    <RefreshCcw size={18} />
                    Scan Another QR
                  </button>

                </div>

              </>
            )}

          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ScanQR;
