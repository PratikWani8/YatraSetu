import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import VolunteerSidebar from "../../components/volunteer/VolunteerSidebar";

import {
  User,
  Phone,
  MapPin,
  HeartPulse,
  Shield,
  Upload,
  FileText,
  Loader2,
  Droplets,
  Users,
  BadgeCheck,
} from "lucide-react";

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

export default function PilgrimInfoReg() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
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
  });

  const [photo, setPhoto] = useState(null);
  const [aadhaarImage, setAadhaarImage] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setForm({
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
    });

    setPhoto(null);
    setAadhaarImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      Object.keys(form).forEach((key) => {
        data.append(key, form[key]);
      });

      if (photo) data.append("photo", photo);

      if (aadhaarImage)
        data.append("aadhaarImage", aadhaarImage);

      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      const res = await axios.post(
       `${BASE_URL}/api/pilgrims/register`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(
        `Pilgrim Registered Successfully!\n\nPilgrim ID : ${res.data.pilgrimId}`
      );

      resetForm();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const Input = ({
    icon: Icon,
    label,
    ...props
  }) => (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
        <Icon
          size={17}
          className="text-blue-600"
        />
        {label}
      </label>

      <input
        {...props}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <VolunteerSidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-0">
        <div className="p-6 lg:p-8">
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
              duration: 0.4,
            }}
            className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 px-8 py-8 text-white">
              <h1 className="text-3xl font-bold">
                Register New Pilgrim
              </h1>

              <p className="mt-2 text-blue-100">
                Enter pilgrim information to generate
                their digital identity and QR code for
                safe pilgrimage.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid gap-6 p-8 md:grid-cols-2"
            >

                              <Input
                icon={User}
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter pilgrim name"
                required
              />

              <Input
                icon={BadgeCheck}
                label="Age"
                type="number"
                name="age"
                min="1"
                max="120"
                value={form.age}
                onChange={handleChange}
                placeholder="Age"
                required
              />

              {/* Gender */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Users
                    size={17}
                    className="text-blue-600"
                  />
                  Gender
                </label>

                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    Select Gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              {/* Blood Group */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Droplets
                    size={17}
                    className="text-red-500"
                  />
                  Blood Group
                </label>

                <select
                  name="bloodGroup"
                  value={form.bloodGroup}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    Select Blood Group
                  </option>

                  {bloodGroups.map((bg) => (
                    <option
                      key={bg}
                      value={bg}
                    >
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                icon={Phone}
                label="Mobile Number"
                name="mobile"
                maxLength={10}
                value={form.mobile}
                onChange={handleChange}
                placeholder="9876543210"
                required
              />

              <Input
                icon={Shield}
                label="Emergency Contact Name"
                name="emergencyName"
                value={form.emergencyName}
                onChange={handleChange}
                placeholder="Emergency Contact"
                required
              />

              <Input
                icon={Phone}
                label="Emergency Contact Number"
                name="emergencyNumber"
                maxLength={10}
                value={form.emergencyNumber}
                onChange={handleChange}
                placeholder="9876543210"
                required
              />

              <Input
                icon={FileText}
                label="Aadhaar Number"
                name="aadhaarNumber"
                maxLength={12}
                value={form.aadhaarNumber}
                onChange={handleChange}
                placeholder="Optional"
              />

              {/* Address */}
              <div className="md:col-span-2">
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <MapPin
                    size={17}
                    className="text-blue-600"
                  />
                  Address
                </label>

                <textarea
                  rows={3}
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  className="w-full rounded-xl border border-gray-300 p-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Medical History */}
              <div className="md:col-span-2">
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <HeartPulse
                    size={17}
                    className="text-red-500"
                  />
                  Medical History
                </label>

                <textarea
                  rows={3}
                  name="medicalHistory"
                  value={form.medicalHistory}
                  onChange={handleChange}
                  placeholder="Diabetes, BP, Asthma..."
                  className="w-full rounded-xl border border-gray-300 p-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Allergies */}
              <div className="md:col-span-2">
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <HeartPulse
                    size={17}
                    className="text-orange-500"
                  />
                  Allergies
                </label>

                <textarea
                  rows={3}
                  name="allergies"
                  value={form.allergies}
                  onChange={handleChange}
                  placeholder="Medicine or food allergies"
                  className="w-full rounded-xl border border-gray-300 p-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Upload
                    size={17}
                    className="text-blue-600"
                  />
                  Pilgrim Photo
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setPhoto(e.target.files[0])
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white p-3"
                />
              </div>

              {/* Aadhaar Upload */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Upload
                    size={17}
                    className="text-blue-600"
                  />
                  Aadhaar Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setAadhaarImage(
                      e.target.files[0]
                    )
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white p-3"
                />
              </div>

              {/* Button */}
              <div className="mt-6 md:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-blue-700 py-4 text-lg font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
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
                      <BadgeCheck size={22} />
                      Register Pilgrim
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
}