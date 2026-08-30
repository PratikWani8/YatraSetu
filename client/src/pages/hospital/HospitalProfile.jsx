import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Landmark,
  FileBadge,
} from "lucide-react";
import { MapPinned, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function HospitalProfile() {
  const [formData, setFormData] = useState({
    hospitalName: "",
    registrationNumber: "",
    hospitalType: "Government",

    email: "",
    mobile: "",
    emergencyContact: "",

    address: "",
    city: "",
    district: "",
    state: "",
    pincode: "",

    latitude: "",
    longitude: "",

    totalDoctors: "",
    totalNurses: "",
    totalBeds: "",
    availableBeds: "",
    icuBeds: "",

    ambulanceAvailable: false,

    departments: [],

    logo: null,
    licenseDocument: null,
  });
  
  const [locationLoading, setLocationLoading] = useState(false);

  const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    toast.error("Geolocation is not supported by your browser.");
    return;
  }

  setLocationLoading(true);

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
        );

        const data = await response.json();

        const address = data.address || {};

        setFormData((prev) => ({
          ...prev,
          latitude,
          longitude,
          address: data.display_name || "",
          city:
            address.city ||
            address.town ||
            address.village ||
            "",
          district:
            address.state_district ||
            address.county ||
            "",
          state: address.state || "",
          pincode: address.postcode || "",
        }));

        toast.success("Location detected successfully.");
      } catch (error) {
        console.error(error);
        toast.error("Unable to fetch address.");
      } finally {
        setLocationLoading(false);
      }
    },
    (error) => {
      setLocationLoading(false);

      switch (error.code) {
        case error.PERMISSION_DENIED:
          toast.error("Location permission denied.");
          break;
        case error.POSITION_UNAVAILABLE:
          toast.error("Location unavailable.");
          break;
        case error.TIMEOUT:
          toast.error("Location request timed out.");
          break;
        default:
          toast.error("Unable to get current location.");
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
};

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files[0]
          : value,
    }));
  };

  return (
    <form className="space-y-8">

      {/* ================= Hospital Information ================= */}

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white p-6 shadow-lg"
      >

        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">

          <Building2 className="text-red-600" />

          Hospital Information

        </h2>

        <div className="grid gap-6 md:grid-cols-2">

          <div>

            <label className="mb-2 block font-semibold">
              Hospital Name
            </label>

            <div className="flex items-center rounded-xl border px-4">

              <Building2 className="text-red-600" />

              <input
                type="text"
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleChange}
                placeholder="Apollo Hospital"
                className="w-full bg-transparent px-3 py-4 outline-none"
              />

            </div>

          </div>

          <div>

            <label className="mb-2 block font-semibold">
              Registration Number
            </label>

            <div className="flex items-center rounded-xl border px-4">

              <FileBadge className="text-red-600" />

              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                placeholder="REG123456"
                className="w-full bg-transparent px-3 py-4 outline-none"
              />

            </div>

          </div>

          <div>

            <label className="mb-2 block font-semibold">
              Hospital Type
            </label>

            <select
              name="hospitalType"
              value={formData.hospitalType}
              onChange={handleChange}
              className="w-full rounded-xl border p-4 outline-none"
            >
              <option>Government</option>
              <option>Private</option>
              <option>Trust</option>
              <option>Clinic</option>
            </select>

          </div>

        </div>

      </motion.div>

      {/* ================= Contact Information ================= */}

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-white p-6 shadow-lg"
      >

        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">

          <Phone className="text-red-600" />

          Contact Information

        </h2>

        <div className="grid gap-6 md:grid-cols-2">

          <div>

            <label className="mb-2 block font-semibold">
              Email
            </label>

            <div className="flex items-center rounded-xl border px-4">

              <Mail className="text-red-600" />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="hospital@gmail.com"
                className="w-full bg-transparent px-3 py-4 outline-none"
              />

            </div>

          </div>

          <div>

            <label className="mb-2 block font-semibold">
              Mobile Number
            </label>

            <div className="flex items-center rounded-xl border px-4">

              <Phone className="text-red-600" />

              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full bg-transparent px-3 py-4 outline-none"
              />

            </div>

          </div>

          <div>

            <label className="mb-2 block font-semibold">
              Emergency Contact
            </label>

            <div className="flex items-center rounded-xl border px-4">

              <Phone className="text-red-600" />

              <input
                type="tel"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                placeholder="Emergency Number"
                className="w-full bg-transparent px-3 py-4 outline-none"
              />

            </div>

          </div>

        </div>

      </motion.div>

      {/* ================= Address ================= */}

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-white p-6 shadow-lg"
      >

        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">

          <MapPin className="text-red-600" />

          Address Details

        </h2>

        <div className="grid gap-6 md:grid-cols-2">

          <div className="md:col-span-2">

            <div className="mb-6 flex justify-end">

  <button
    type="button"
    onClick={getCurrentLocation}
    disabled={locationLoading}
    className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
  >
    {locationLoading ? (
      <>
        <Loader2 className="h-5 w-5 animate-spin" />
        Detecting...
      </>
    ) : (
      <>
        <MapPinned className="h-5 w-5" />
        Detect Current Location
      </>
    )}
  </button>

</div>

            <label className="mb-2 block font-semibold">
              Address
            </label>

            <textarea
              rows={3}
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Complete Hospital Address"
              className="w-full rounded-xl border p-4 outline-none"
            />

          </div>

          <div>

            <label className="mb-2 block font-semibold">
              City
            </label>

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full rounded-xl border p-4 outline-none"
            />

          </div>

          <div>

            <label className="mb-2 block font-semibold">
              District
            </label>

            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="w-full rounded-xl border p-4 outline-none"
            />

          </div>

          <div>

            <label className="mb-2 block font-semibold">
              State
            </label>

            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full rounded-xl border p-4 outline-none"
            />

          </div>

          <div>

            <label className="mb-2 block font-semibold">
              Pincode
            </label>

            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              className="w-full rounded-xl border p-4 outline-none"
            />

          </div>

                    <div>

            <label className="mb-2 block font-semibold">
              Latitude
            </label>

            <input
              type="number"
              step="any"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              placeholder="18.5204"
              className="w-full rounded-xl border p-4 outline-none"
            />

          </div>

          <div>

            <label className="mb-2 block font-semibold">
              Longitude
            </label>

            <input
              type="number"
              step="any"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              placeholder="73.8567"
              className="w-full rounded-xl border p-4 outline-none"
            />

          </div>

        </div>

      </motion.div>

      {/* ================= Hospital Capacity ================= */}

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-white p-6 shadow-lg"
      >

        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">

          <Landmark className="text-red-600" />

          Hospital Capacity

        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          <div>
            <label className="mb-2 block font-semibold">
              Total Doctors
            </label>

            <input
              type="number"
              name="totalDoctors"
              value={formData.totalDoctors}
              onChange={handleChange}
              className="w-full rounded-xl border p-4 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Total Nurses
            </label>

            <input
              type="number"
              name="totalNurses"
              value={formData.totalNurses}
              onChange={handleChange}
              className="w-full rounded-xl border p-4 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Total Beds
            </label>

            <input
              type="number"
              name="totalBeds"
              value={formData.totalBeds}
              onChange={handleChange}
              className="w-full rounded-xl border p-4 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Available Beds
            </label>

            <input
              type="number"
              name="availableBeds"
              value={formData.availableBeds}
              onChange={handleChange}
              className="w-full rounded-xl border p-4 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              ICU Beds
            </label>

            <input
              type="number"
              name="icuBeds"
              value={formData.icuBeds}
              onChange={handleChange}
              className="w-full rounded-xl border p-4 outline-none"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border p-4">

            <div>

              <h3 className="font-semibold">
                Ambulance Available
              </h3>

              <p className="text-sm text-gray-500">
                Enable if ambulance service is available.
              </p>

            </div>

            <input
              type="checkbox"
              name="ambulanceAvailable"
              checked={formData.ambulanceAvailable}
              onChange={handleChange}
              className="h-5 w-5 accent-red-600"
            />

          </div>

        </div>

      </motion.div>

      {/* ================= Departments ================= */}

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl bg-white p-6 shadow-lg"
      >

        <h2 className="mb-6 text-2xl font-bold">
          Departments
        </h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

          {[
            "Emergency",
            "General Medicine",
            "Cardiology",
            "Neurology",
            "Orthopedics",
            "Pediatrics",
            "Radiology",
            "ICU",
            "Pharmacy",
            "Surgery",
          ].map((department) => (

            <label
              key={department}
              className="flex cursor-pointer items-center gap-3 rounded-xl border p-4 hover:bg-red-50"
            >

              <input
                type="checkbox"
                checked={formData.departments.includes(department)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData((prev) => ({
                      ...prev,
                      departments: [
                        ...prev.departments,
                        department,
                      ],
                    }));
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      departments:
                        prev.departments.filter(
                          (d) => d !== department
                        ),
                    }));
                  }
                }}
                className="accent-red-600"
              />

              {department}

            </label>

          ))}

        </div>

      </motion.div>

      {/* ================= Documents ================= */}

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl bg-white p-6 shadow-lg"
      >

        <h2 className="mb-6 text-2xl font-bold">
          Documents
        </h2>

        <div className="grid gap-6 md:grid-cols-2">

          <div>

            <label className="mb-2 block font-semibold">
              Hospital Logo
            </label>

            <input
              type="file"
              name="logo"
              accept="image/*"
              onChange={handleChange}
              className="w-full rounded-xl border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-semibold">
              License Document
            </label>

            <input
              type="file"
              name="licenseDocument"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleChange}
              className="w-full rounded-xl border p-3"
            />

          </div>

        </div>

      </motion.div>

      <div className="flex justify-end">

        <button
          type="submit"
          className="rounded-xl bg-red-600 px-10 py-4 font-semibold text-white transition hover:bg-red-700"
        >
          Save Profile
        </button>

      </div>

    </form>
  );
}