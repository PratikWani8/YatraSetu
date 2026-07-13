import { motion } from "framer-motion";

export default function ProfileCard({ user }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 25,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
      }}
      
    >

    </motion.div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">

      <div className="flex items-center gap-3">

        <div className="text-blue-600">

          {icon}

        </div>

        <span className="font-medium">

          {label}

        </span>

      </div>

      <span className="font-semibold text-gray-700">

        {value}

      </span>

    </div>
  );
}