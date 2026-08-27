import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../api/api";

import {
  Search,
  Upload,
  MapPin,
  Calendar,
  Clock,
  AlertTriangle,
  FileText,
  Camera,
  User,
} from "lucide-react";

import toast from "react-hot-toast";

import VolunteerSidebar from "../../components/volunteer/VolunteerSidebar";

export default function ReportMissingPerson() {

  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  const [loading, setLoading] =
    useState(false);

  const [searching, setSearching] =
    useState(false);

  const [pilgrimId, setPilgrimId] =
    useState("");

  const [pilgrim, setPilgrim] =
    useState(null);

  const [photo, setPhoto] =
    useState(null);

  const [preview, setPreview] =
    useState("");

  const [formData, setFormData] =
    useState({

      lastSeenLocation: "",

      latitude: "",

      longitude: "",

      lastSeenTime: "",

      priority: "Medium",

      description: "",

    });

  /* ======================================
      Get Current GPS
  ====================================== */

  useEffect(() => {

    navigator.geolocation.getCurrentPosition(

      (position) => {

        setFormData((prev) => ({

          ...prev,

          latitude:
            position.coords.latitude,

          longitude:
            position.coords.longitude,

        }));

      },

      () => {}

    );

  }, []);

  /* ======================================
      Search Pilgrim
  ====================================== */

  const searchPilgrim = async () => {

    if (!pilgrimId) return;

    try {

      setSearching(true);

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

      toast.error("Pilgrim not found");

      setPilgrim(null);

    } finally {

      setSearching(false);

    }

  };

  /* ======================================
      Input Change
  ====================================== */

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  /* ======================================
      Photo
  ====================================== */

  const handlePhoto = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setPhoto(file);

    setPreview(
      URL.createObjectURL(file)
    );

  };

  /* ======================================
    Submit Report
====================================== */

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!pilgrim) {
    return toast.error("Search and select a pilgrim first.");
  }

  if (
    !formData.lastSeenLocation ||
    !formData.lastSeenTime ||
    !formData.description
  ) {
    return toast.error("Please fill all required fields.");
  }

  try {
    setLoading(true);

    const data = new FormData();

    data.append("pilgrimId", pilgrim.pilgrimId);
    data.append(
      "lastSeenLocation",
      formData.lastSeenLocation
    );
    data.append("latitude", formData.latitude);
    data.append("longitude", formData.longitude);
    data.append(
      "lastSeenTime",
      formData.lastSeenTime
    );
    data.append("priority", formData.priority);
    data.append(
      "description",
      formData.description
    );

    if (photo) {
      data.append("photo", photo);
    }

    await axios.post(
      "http://localhost:5000/api/missing-persons/report",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    toast.success(
      "Missing person reported successfully."
    );

    setPilgrim(null);
    setPilgrimId("");
    setPhoto(null);
    setPreview("");

    setFormData((prev) => ({
      ...prev,
      lastSeenLocation: "",
      lastSeenTime: "",
      priority: "Medium",
      description: "",
    }));
  } catch (err) {
    toast.error(
      err.response?.data?.message ||
        "Unable to submit report."
    );
  } finally {
    setLoading(false);
  }
};

return (
  <div className="flex min-h-screen bg-slate-100">

    <VolunteerSidebar />

    <main className="flex-1 p-8">

      <h1 className="text-3xl font-bold mb-8">

        🚨 Report Missing Person

      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid gap-8 lg:grid-cols-2"
      >

        {/* LEFT */}

        <div className="space-y-6">

          <div className="bg-white rounded-3xl shadow p-6">

            <h2 className="font-bold text-xl mb-4">

              Search Pilgrim

            </h2>

            <div className="flex gap-3">

              <input
                type="text"
                value={pilgrimId}
                onChange={(e) =>
                  setPilgrimId(e.target.value)
                }
                placeholder="PIL-2026-000001"
                className="flex-1 rounded-xl border p-3"
              />

              <button
                type="button"
                onClick={searchPilgrim}
                className="bg-blue-600 text-white px-6 rounded-xl"
              >
                <Search size={18} />
              </button>

            </div>

          </div>

          {pilgrim && (

            <div className="bg-white rounded-3xl shadow p-6">

              <h2 className="font-bold text-xl mb-5">

                Pilgrim Details

              </h2>

              <div className="flex gap-5">

                <img
                  src={`http://localhost:5000${pilgrim.photo}`}
                  alt=""
                  className="w-32 h-32 rounded-2xl object-cover"
                />

                <div className="space-y-2">

                  <h3 className="text-2xl font-bold">

                    {pilgrim.name}

                  </h3>

                  <p>
                    <strong>ID:</strong>{" "}
                    {pilgrim.pilgrimId}
                  </p>

                  <p>
                    <strong>Age:</strong>{" "}
                    {pilgrim.age}
                  </p>

                  <p>
                    <strong>Gender:</strong>{" "}
                    {pilgrim.gender}
                  </p>

                  <p>
                    <strong>Blood:</strong>{" "}
                    {pilgrim.bloodGroup}
                  </p>

                </div>

              </div>

            </div>

          )}

        </div>

        {/* RIGHT */}

        <div className="bg-white rounded-3xl shadow p-6 space-y-5">

          <h2 className="font-bold text-xl">

            Missing Information

          </h2>

          <input
            type="text"
            name="lastSeenLocation"
            placeholder="Last Seen Location"
            value={formData.lastSeenLocation}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          />

          <input
            type="datetime-local"
            name="lastSeenTime"
            value={formData.lastSeenTime}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          />

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </select>

          <textarea
            rows={5}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe when and where the pilgrim was last seen..."
            className="w-full rounded-xl border p-3"
          />

          <div>

            <label className="font-medium">

              Upload Latest Photo (Optional)

            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handlePhoto}
              className="mt-2"
            />

            {preview && (

              <img
                src={preview}
                alt=""
                className="mt-4 w-40 rounded-xl"
              />

            )}

          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-red-600 py-4 text-white font-bold hover:bg-red-700 disabled:opacity-50"
          >

            {loading
              ? "Submitting..."
              : "Report Missing Person"}

          </button>

        </div>

      </form>

    </main>

  </div>
);
}