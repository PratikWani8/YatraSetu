import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

const InputField = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  icon: Icon,
  textarea = false,
  rows = 4,
  maxLength,
  disabled = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full"
    >
      {/* Label */}

      <label className="mb-2 flex items-center gap-2 font-medium text-gray-700">
        {Icon && <Icon size={18} className="text-blue-600" />}

        {label}

        {required && (
          <span className="text-red-500">*</span>
        )}
      </label>

      {/* Input */}

      <div
        className={`rounded-xl border transition-all duration-300 bg-white shadow-sm

        ${
          error
            ? "border-red-500 ring-2 ring-red-200"
            : "border-gray-300 hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100"
        }

        `}
      >
        {textarea ? (
          <textarea
            name={name}
            rows={rows}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            maxLength={maxLength}
            disabled={disabled}
            className="w-full resize-none rounded-xl bg-transparent px-4 py-3 outline-none"
          />
        ) : (
          <input
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            maxLength={maxLength}
            disabled={disabled}
            className="w-full rounded-xl bg-transparent px-4 py-3 outline-none"
          />
        )}
      </div>

      {/* Error */}

      <motion.div
        animate={{
          height: error ? "auto" : 0,
          opacity: error ? 1 : 0,
        }}
        className="overflow-hidden"
      >
        {error && (
          <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
            <AlertCircle size={16} />
            {error}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default InputField;