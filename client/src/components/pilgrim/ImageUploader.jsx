import { useRef } from "react";
import { motion } from "framer-motion";
import {
  UploadCloud,
  Camera,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";

const MAX_SIZE = 5 * 1024 * 1024;

const ImageUploader = ({
  image,
  setImage,
  label = "Pilgrim Photo",
  accept = "image/*",
  error,
}) => {
  const inputRef = useRef();

  const handleFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image.");
      return;
    }

    if (file.size > MAX_SIZE) {
      alert("Image must be less than 5 MB.");
      return;
    }

    const preview = URL.createObjectURL(file);

    setImage({
      file,
      preview,
    });
  };

  const onInputChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const onDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const removeImage = () => {
    if (image?.preview) {
      URL.revokeObjectURL(image.preview);
    }

    setImage(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="w-full"
    >
      <label className="mb-2 block font-semibold text-gray-700">
        {label}
      </label>

      {!image ? (
        <motion.div
          whileHover={{
            scale: 1.02,
          }}
          whileTap={{
            scale: 0.98,
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          onClick={() => inputRef.current.click()}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-blue-400 bg-gradient-to-br from-blue-50 to-cyan-50 p-8 transition-all hover:border-blue-600"
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <UploadCloud
              className="text-blue-600"
              size={60}
            />

            <h3 className="text-lg font-semibold">
              Upload Pilgrim Photo
            </h3>

            <p className="text-center text-sm text-gray-500">
              Drag & Drop or Click to Upload
            </p>

            <div className="rounded-full bg-blue-600 px-5 py-2 text-white">
              Choose Image
            </div>

            <p className="text-xs text-gray-400">
              JPG • PNG • JPEG
            </p>
          </div>

          <input
            ref={inputRef}
            hidden
            accept={accept}
            type="file"
            onChange={onInputChange}
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{
            scale: 0.9,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          className="overflow-hidden rounded-2xl bg-white shadow-xl"
        >
          <div className="relative">
            <img
              src={image.preview}
              alt="Preview"
              className="h-72 w-full object-cover"
            />

            <div className="absolute right-4 top-4 flex gap-2">
              <button
                onClick={() => inputRef.current.click()}
                className="rounded-full bg-white p-3 shadow-lg transition hover:bg-blue-50"
              >
                <Camera size={20} />
              </button>

              <button
                onClick={removeImage}
                className="rounded-full bg-red-500 p-3 text-white shadow-lg transition hover:bg-red-600"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4">
            <ImageIcon className="text-blue-600" />

            <div>
              <p className="font-medium">
                {image.file.name}
              </p>

              <p className="text-sm text-gray-500">
                {(image.file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>

          <input
            ref={inputRef}
            hidden
            type="file"
            accept={accept}
            onChange={onInputChange}
          />
        </motion.div>
      )}

      {error && (
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          className="mt-2 text-sm font-medium text-red-500"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

export default ImageUploader;