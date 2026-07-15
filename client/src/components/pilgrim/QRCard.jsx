import { useRef } from "react";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Download,
  Printer,
  ShieldCheck,
  Phone,
  HeartPulse,
  User,
  IdCard,
} from "lucide-react";

const QRCard = ({ pilgrim }) => {
  const cardRef = useRef(null);

  const downloadPDF = async () => {
    const canvas = await html2canvas(cardRef.current, {
      scale: 3,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const width = 180;
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 15, 15, width, height);

    pdf.save(`${pilgrim.pilgrimId}.pdf`);
  };

  const printCard = () => {
    window.print();
  };

  const qrValue = JSON.stringify({
  pilgrimId: pilgrim.pilgrimId,
  name: pilgrim.name,
  bloodGroup: pilgrim.bloodGroup,
  emergency: pilgrim.emergencyNumber,

  dashboard: `${window.location.origin}/pilgrim/${pilgrim.pilgrimId}`,
});

  return (
    <div className="flex flex-col items-center gap-6">

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        ref={cardRef}
        className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl border"
      >

        {/* Header */}

        <div className="bg-gradient-to-r from-blue-700 to-cyan-500 p-6 text-center text-white">

          <ShieldCheck
            className="mx-auto mb-2"
            size={40}
          />

          <h2 className="text-2xl font-bold">
            Pilgrim Health Card
          </h2>

          <p className="opacity-90">
            Health & Emergency Identification
          </p>

        </div>
        
        {/* Details */}

        <div className="space-y-4 p-6">

          <div className="flex items-center gap-3">

            <User className="text-blue-600" />

            <div>

              <p className="text-sm text-gray-500">
                Name
              </p>

              <h3 className="font-semibold text-lg">
                {pilgrim.name}
              </h3>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <IdCard className="text-blue-600" />

            <div>

              <p className="text-sm text-gray-500">
                Pilgrim ID
              </p>

              <h3 className="font-semibold">
                {pilgrim.pilgrimId}
              </h3>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <HeartPulse className="text-red-500" />

            <div>

              <p className="text-sm text-gray-500">
                Blood Group
              </p>

              <h3 className="font-bold text-red-600">
                {pilgrim.bloodGroup}
              </h3>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <Phone className="text-green-600" />

            <div>

              <p className="text-sm text-gray-500">
                Emergency Contact
              </p>

              <h3 className="font-semibold">
                {pilgrim.emergencyNumber}
              </h3>

            </div>

          </div>

        </div>

        {/* QR */}

        <div className="flex flex-col items-center border-t p-6 bg-gray-50">

          <QRCode
            value={qrValue}
            size={170}
          />

          <p className="mt-4 text-center text-sm text-gray-500">
            Scan this QR Code to retrieve
            pilgrim medical information.
          </p>

        </div>

      </motion.div>

      {/* Buttons */}

      <div className="flex flex-wrap justify-center gap-4">

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={downloadPDF}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg hover:bg-blue-700"
        >

          <Download size={18} />

          Download PDF

        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={printCard}
          className="flex items-center gap-2 rounded-xl bg-gray-800 px-6 py-3 font-semibold text-white shadow-lg hover:bg-black"
        >

          <Printer size={18} />

          Print Card

        </motion.button>

      </div>

    </div>
  );
};

export default QRCard;