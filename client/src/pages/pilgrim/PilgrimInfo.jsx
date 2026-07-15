import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Phone,
  HeartPulse,
  Shield,
  Camera,
  Upload,
  BadgeCheck,
  AlertCircle,
  MapPin,
  Users,
  FileText,
  Droplets,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import Sidebar from "@/components/pilgrim/Sidebar";
import InputField from "../../components/pilgrim/InputField";
import ImageUploader from "../../components/pilgrim/ImageUploader";
import WebcamCapture from "../../components/pilgrim/WebcamCapture";
import QRCard from "../../components/pilgrim/QRCard";
import SuccessAnimation from "../../components/pilgrim/SuccessAnimation";

const STORAGE_KEY = "pilgrim-registration-draft";

const initialForm = {
  name: "",
  age: "",
  gender: "",
  bloodGroup: "",

  mobile: "",

  address: "",

  medicalHistory: "",

  allergies: "",

  emergencyName: "",

  emergencyNumber: "",

  aadhaarNumber: "",
};

const bloodGroups = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

const genders = [
  "Male",
  "Female",
  "Other",
];

export default function PilgrimInfo() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialForm);

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const [photo, setPhoto] = useState(null);

  const [aadhaarImage, setAadhaarImage] =
    useState(null);

  const [showCamera, setShowCamera] =
    useState(false);

  const [pilgrim, setPilgrim] = useState(null);

  const [showSuccess, setShowSuccess] =
    useState(false);

  const [checkingAadhaar, setCheckingAadhaar] =
    useState(false);

  const [draftSaved, setDraftSaved] =
    useState(false);

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      const res = await axios.get("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = res.data.pilgrim;

      setFormData((prev) => ({
        ...prev,
        name: user.name,
        mobile: user.mobile,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  fetchUser();
}, []);

  useEffect(() => {
    const draft =
      localStorage.getItem(STORAGE_KEY);

    if (draft) {
      setFormData(JSON.parse(draft));

      toast.success("Draft Restored");
    }
  }, []);

  // Auto Save
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(formData)
    );

    setDraftSaved(true);

    const timer = setTimeout(() => {
      setDraftSaved(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [formData]);

  // Validation
  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim())
          return "Name is required";

        if (value.length < 3)
          return "Minimum 3 characters";

        return "";

      case "age":
        if (!value)
          return "Age required";

        if (
          Number(value) < 1 ||
          Number(value) > 120
        )
          return "Invalid age";

        return "";

      case "mobile":
        if (
          !/^[6-9]\d{9}$/.test(value)
        )
          return "Invalid mobile number";

        return "";

      case "emergencyNumber":
        if (
          !/^[6-9]\d{9}$/.test(value)
        )
          return "Invalid emergency contact";

        return "";

      case "aadhaarNumber":
        if (
          value &&
          !/^\d{12}$/.test(value)
        )
          return "Aadhaar must contain 12 digits";

        return "";

      default:
        return "";
    }
  };

  // Change Handler
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(
        name,
        value
      ),
    }));
  };

  // Duplicate Aadhaar Check
  const checkAadhaar =
    async () => {
      if (
        !formData.aadhaarNumber
      )
        return;

      if (
        validateField(
          "aadhaarNumber",
          formData.aadhaarNumber
        )
      )
        return;

      try {
        setCheckingAadhaar(true);

        const res =
          await axios.post(
            "/api/pilgrims/check-aadhaar",
            {
              aadhaarNumber:
                formData.aadhaarNumber,
            }
          );

        if (res.data.exists) {
          setErrors((prev) => ({
            ...prev,
            aadhaarNumber:
              "Aadhaar already exists",
          }));
        }
      } catch (err) {
        console.log(err);
      } finally {
        setCheckingAadhaar(false);
      }
    };

  const requiredFields = [
    "name",
    "age",
    "gender",
    "bloodGroup",
    "mobile",
    "emergencyName",
    "emergencyNumber",
  ];

// Reset Form
const resetForm = () => {
  setFormData(initialForm);
  setPhoto(null);
  setAadhaarImage(null);
  setErrors({});
  setPilgrim(null);

  localStorage.removeItem(STORAGE_KEY);
};

// Submit Form
const handleSubmit = async (e) => {
  e.preventDefault();

  const validationErrors = {};

  requiredFields.forEach((field) => {
    const error = validateField(field, formData[field]);

    if (error) validationErrors[field] = error;
  });

  if (!formData.bloodGroup)
    validationErrors.bloodGroup = "Blood Group is required";

  if (!formData.gender)
    validationErrors.gender = "Gender is required";

  if (!photo)
    validationErrors.photo = "Pilgrim photo is required";

  setErrors(validationErrors);

  if (Object.keys(validationErrors).length > 0) {
    toast.error("Please fill all required fields.");
    return;
  }

  try {
    setLoading(true);

    const payload = new FormData();

    Object.keys(formData).forEach((key) => {
      payload.append(key, formData[key]);
    });


    if (photo?.file) {
      payload.append("photo", photo.file);
    }

    if (aadhaarImage?.file) {
      payload.append(
        "aadhaarImage",
        aadhaarImage.file
      );
    }

    // Backend Upload
    const token =
  localStorage.getItem("token") ||
  sessionStorage.getItem("token");

const res = await axios.post(
  "/api/pilgrims/register",
  payload,
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  }
);

    const registeredPilgrim = {
  ...res.data.pilgrim,
  photo: photo?.preview || res.data.pilgrim.photo,
};
    setPilgrim(registeredPilgrim);

    setShowSuccess(true);

      navigate(`/pilgrim/dashboard`);

    localStorage.removeItem(STORAGE_KEY);

    toast.success(
      "Pilgrim Registered Successfully"
    );
  } catch (err) {
    console.error(err);

    toast.error(
      err?.response?.data?.message ||
        "Registration Failed"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-white">

      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">

        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -80, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 12,
          }}
          className="absolute left-10 top-20 h-72 w-72 rounded-full bg-blue-200 blur-3xl opacity-30"
        />

        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 10,
          }}
          className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-cyan-200 blur-3xl opacity-30"
        />

      </div>

      {/* Main */}
        <div className="flex min-h-screen bg-slate-100">

          {/* Left */}
          <Sidebar />
          
          {/* Right */}
          <motion.div
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            className="lg:col-span-2">

            <div className="rounded-3xl bg-white p-8 shadow-2xl">

              <div className="mb-8 flex items-center gap-3">

                <User
                  size={34}
                  className="text-blue-600"
                />

                <div>

                  <h2 className="text-3xl font-bold">
                    Pilgrim Registration
                  </h2>

                  <p className="text-gray-500">
                    Fill all required information
                  </p>

                </div>

              </div>

{/* ======== FORM ======== */}
              <form
  onSubmit={handleSubmit}
  className="space-y-8"
>
{/* ================= PERSONAL INFORMATION ================= */}
<div className="rounded-2xl border border-gray-200 p-6">

  <h3 className="mb-6 flex items-center gap-2 text-2xl font-bold">

    <User className="text-blue-600" />
    Personal Information
  </h3>

  <div className="grid gap-6 md:grid-cols-2">

    <InputField
  label="Full Name"
  name="name"
  value={formData.name}
  icon={User}
  readOnly
/>

    <InputField
      label="Age"
      name="age"
      type="number"
      placeholder="Age"
      value={formData.age}
      onChange={handleChange}
      error={errors.age}
      required
    />

    {/* Gender */}
    <div>

      <label className="mb-2 block font-semibold">
        Gender
        <span className="text-red-500">*</span>

      </label>

      <select
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        className="w-full rounded-xl border border-gray-300 p-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
      >

        <option value="">

          Select Gender

        </option>

        {genders.map((gender) => (

          <option key={gender} value={gender}>

            {gender}

          </option>

        ))}

      </select>

    </div>

    {/* Blood Group */}
    <div>

      <label className="mb-2 block font-semibold">

        Blood Group

        <span className="text-red-500">*</span>

      </label>

      <select
        name="bloodGroup"
        value={formData.bloodGroup}
        onChange={handleChange}
        className="w-full rounded-xl border border-gray-300 p-3 focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none"
      >

        <option value="">

          Select Blood Group

        </option>

        {bloodGroups.map((group) => (

          <option
            key={group}
            value={group}
          >

            {group}

          </option>

        ))}

      </select>

    </div>

  </div>

</div>

{/* ================= CONTACT DETAILS ================= */}
<div className="rounded-2xl border border-gray-200 p-6">

  <h3 className="mb-6 flex items-center gap-2 text-2xl font-bold">

    <Phone className="text-green-600" />

    Contact Details

  </h3>

  <div className="grid gap-6 md:grid-cols-2">

    <div>

      <InputField
  label="Mobile Number"
  name="mobile"
  value={formData.mobile}
  icon={Phone}
  readOnly
/>

    </div>

    <InputField
      label="Address"
      name="address"
      icon={MapPin}
      placeholder="Village / City / District"
      value={formData.address}
      onChange={handleChange}
    />

  </div>

</div>

{/* ================= MEDICAL ================= */}
<div className="rounded-2xl border border-gray-200 p-6">

  <h3 className="mb-6 flex items-center gap-2 text-2xl font-bold">

    <HeartPulse className="text-red-600" />

    Medical Information

  </h3>

  <div className="space-y-6">

    <InputField
      textarea
      rows={4}
      label="Medical History"
      name="medicalHistory"
      icon={FileText}
      placeholder="Diabetes, BP, Heart Disease..."
      value={formData.medicalHistory}
      onChange={handleChange}
    />

    <InputField
      textarea
      rows={3}
      label="Known Allergies"
      name="allergies"
      icon={AlertCircle}
      placeholder="Food, Medicine, Dust..."
      value={formData.allergies}
      onChange={handleChange}
    />

  </div>

</div>

{/* ================= EMERGENCY CONTACT ================= */}
<div className="rounded-2xl border border-gray-200 p-6">

  <h3 className="mb-6 flex items-center gap-2 text-2xl font-bold">

    <Users className="text-orange-600" />

    Emergency Contact

  </h3>

  <div className="grid gap-6 md:grid-cols-2">

    <InputField
      label="Contact Person"
      name="emergencyName"
      icon={User}
      placeholder="Emergency Contact Name"
      value={formData.emergencyName}
      onChange={handleChange}
      required
    />

    <InputField
      label="Emergency Mobile"
      name="emergencyNumber"
      icon={Phone}
      placeholder="9876543210"
      value={formData.emergencyNumber}
      onChange={handleChange}
      error={errors.emergencyNumber}
      required
    />

  </div>

</div>

{/* ================= AADHAAR VERIFICATION ================= */}
<div className="rounded-2xl border border-gray-200 p-6">

  <h3 className="mb-6 flex items-center gap-2 text-2xl font-bold">

    <BadgeCheck className="text-indigo-600" />

    Aadhaar Verification (Optional)

  </h3>

  <div className="grid gap-6 lg:grid-cols-2">

    <div>

      <InputField
        label="Aadhaar Number"
        name="aadhaarNumber"
        placeholder="123412341234"
        icon={BadgeCheck}
        value={formData.aadhaarNumber}
        onChange={handleChange}
        onBlur={checkAadhaar}
        error={errors.aadhaarNumber}
        maxLength={12}
      />

      {checkingAadhaar && (

        <div className="mt-3 flex items-center gap-2 text-indigo-600">

          <Loader2
            size={18}
            className="animate-spin"
          />

          Checking Aadhaar...

        </div>

      )}

    </div>

    <div>

      <ImageUploader
        image={aadhaarImage}
        setImage={setAadhaarImage}
        label="Upload Aadhaar Card"
      />

    </div>

  </div>

</div>

{/* ================= PHOTO SECTION ================= */}
<div className="rounded-2xl border border-gray-200 p-6">

  <h3 className="mb-6 flex items-center gap-2 text-2xl font-bold">

    <Camera className="text-blue-600" />

    Pilgrim Photograph

  </h3>

  <div className="grid gap-8 lg:grid-cols-2">

    {/* Upload */}
    <div>

      <ImageUploader
        image={photo}
        setImage={setPhoto}
        label="Upload Photo"
      />

    </div>

    {/* Webcam */}
    <div className="flex flex-col">

      <div className="flex-1 rounded-2xl border-2 border-dashed border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50 p-8">

        <div className="flex h-full flex-col items-center justify-center">

          {photo ? (

            <motion.img
              initial={{
                opacity:0,
                scale:0.9
              }}
              animate={{
                opacity:1,
                scale:1
              }}
              src={photo.preview}
              alt="Pilgrim"
              className="h-72 w-72 rounded-2xl object-cover shadow-xl"
            />

          ) : (

            <>
              <Camera
                size={70}
                className="text-blue-500"
              />

              <h4 className="mt-5 text-xl font-bold">

                Live Camera Capture

              </h4>

              <p className="mt-2 text-center text-gray-500">

                Capture pilgrim photo using webcam

              </p>
            </>

          )}

          <motion.button
            whileHover={{
              scale:1.05
            }}
            whileTap={{
              scale:0.95
            }}
            type="button"
            onClick={() => setShowCamera(true)}
            className="mt-8 flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg hover:bg-blue-700"
          >

            <Camera size={20} />

            {photo ? "Retake Photo" : "Open Camera"}

          </motion.button>

        </div>

      </div>

    </div>

  </div>

</div>

{/* Webcam Modal */}
{showCamera && (

  <WebcamCapture
    onCapture={(capturedPhoto) => {

      setPhoto(capturedPhoto);

      toast.success("Photo Captured Successfully");

    }}
    onClose={() => setShowCamera(false)}
  />

)}

{/* ================= PREVIEW ================= */}
{photo && (

<motion.div
initial={{
opacity:0,
y:20
}}
animate={{
opacity:1,
y:0
}}
className="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white shadow-xl"
>

<div className="flex flex-col items-center gap-5 lg:flex-row">

<img
src={photo.preview}
alt="Preview"
className="h-36 w-36 rounded-full border-4 border-white object-cover shadow-xl"
/>

<div className="flex-1">

<h3 className="text-2xl font-bold">

Photo Preview Ready

</h3>

<p className="mt-2 opacity-90">

The captured/uploaded image will appear on the
Pilgrim QR Identity Card.

</p>

</div>

<div className="rounded-xl bg-white/20 px-5 py-4 backdrop-blur">

<p className="text-sm">

Status

</p>

<p className="text-lg font-bold">

✓ Verified

</p>

</div>

</div>

</motion.div>

)}

{/* ================= REGISTER BUTTON ================= */}
<div className="flex justify-center pt-6">

<motion.button
type="submit"
disabled={loading}
whileHover={{
scale:1.03
}}
whileTap={{
scale:0.97
}}
className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-14 py-4 text-lg font-bold text-white shadow-2xl disabled:cursor-not-allowed disabled:opacity-70"
>

{loading ? (

<>

<Loader2
size={22}
className="animate-spin"
/>

Registering...

</>

) : (

<>

<Shield size={22}/>

Update Details

</>

)}

</motion.button>

{/* Success Modal */}

<SuccessAnimation
  open={showSuccess}
  pilgrim={pilgrim || {}}
  onClose={() => setShowSuccess(false)}
  onDownload={() => {
    toast.success("Downloading...");
  }}
  onRegisterAnother={() => {
    resetForm();
    setShowSuccess(false);
  }}
>
  {pilgrim && (
    <QRCard pilgrim={pilgrim} />
  )}
</SuccessAnimation>

</div>
                </form>

          </div>

        </motion.div>

      </div>

  </div>

);
}           