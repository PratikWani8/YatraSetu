import React, { useEffect, useRef, useState } from "react";
import VolunteerSidebar from "../../components/volunteer/VolunteerSidebar";
import {
  Camera,
  User,
  Calendar,
  Droplets,
  Users,
  CreditCard,
  Save,
} from "lucide-react";
import API from "../../api/volunteerApi";
import { BASE_URL } from "../../api/api";

const VolunteerProfile = () => {
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const [profileImage, setProfileImage] = useState(
    "https://i.pravatar.cc/200"
  );

  // Files
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [aadhaarDocument, setAadhaarDocument] = useState(null);
  const [volunteerIdDocument, setVolunteerIdDocument] = useState(null);

  const [formData, setFormData] = useState({
    // Personal
    fullName: "",
    volunteerId: "",
    gender: "Male",
    dob: "",
    age: "",
    bloodGroup: "",
    aadhaarNumber: "",

    // Contact
    mobile: "",
    alternateMobile: "",
    email: "",
    address: "",
    district: "",
    state: "",
    pincode: "",

    // Volunteer
    volunteerRole: "",
    assignedZone: "",
    organization: "",
    volunteerSince: "",
    availability: "",
    languages: "",
    bio: "",

    // Emergency
    emergencyName: "",
    relationship: "",
    emergencyMobile: "",
    emergencyAlternateMobile: "",

    // Medical
    allergies: "",
    conditions: "",
    medications: "",
    organDonor: false,

    // Skills
    firstAid: false,
    cpr: false,
    disasterManagement: false,
    crowdManagement: false,
    searchRescue: false,
    fireSafety: false,
  });

  // -----------------------
  // Input Change
  // -----------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // -----------------------
  // Profile Image Preview
  // -----------------------
  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setProfilePhoto(file);
    setProfileImage(URL.createObjectURL(file));
  };

  // -----------------------
  // Fetch Profile
  // -----------------------
  const fetchProfile = async () => {
  try {
    setLoading(true);

    const { data } = await API.get("/volunteer/profile");

    if (!data.success) return;

    const volunteer = data.volunteer || {};

    setFormData({
      // ============================
      // User Collection
      // ============================

      fullName: volunteer.fullName || "",
      volunteerId: volunteer.volunteerId || "",
      mobile: volunteer.mobile || "",
      email: volunteer.email || "",
      username: data.volunteer.username,
      registrationDate: data.volunteer.registrationDate,
      emailVerified: data.volunteer.emailVerified,
      accountStatus: data.volunteer.accountStatus,

      // ============================
      // Volunteer Collection
      // ============================

      gender: volunteer.gender || "",

      dob: volunteer.dob
        ? volunteer.dob.substring(0, 10)
        : "",

      age: volunteer.age || "",

      bloodGroup: volunteer.bloodGroup || "",

      aadhaarNumber:
        volunteer.aadhaarNumber || "",

      alternateMobile:
        volunteer.alternateMobile || "",

      address:
        volunteer.address || "",

      district:
        volunteer.district || "",

      state:
        volunteer.state || "",

      pincode:
        volunteer.pincode || "",

      volunteerRole:
        volunteer.volunteerRole || "",

      assignedZone:
        volunteer.assignedZone || "",

      organization:
        volunteer.organization || "",

      volunteerSince:
        volunteer.volunteerSince
          ? volunteer.volunteerSince.substring(0, 10)
          : "",

      availability:
        volunteer.availability || "",

      languages:
        volunteer.languages?.join(", ") || "",

      bio:
        volunteer.bio || "",

      emergencyName:
        volunteer.emergencyContact?.name || "",

      relationship:
        volunteer.emergencyContact?.relationship || "",

      emergencyMobile:
        volunteer.emergencyContact?.mobile || "",

      emergencyAlternateMobile:
        volunteer.emergencyContact?.alternateMobile || "",

      allergies:
        volunteer.medical?.allergies || "",

      conditions:
        volunteer.medical?.conditions || "",

      medications:
        volunteer.medical?.medications || "",

      organDonor:
        volunteer.medical?.organDonor || false,

      firstAid:
        volunteer.skills?.firstAid || false,

      cpr:
        volunteer.skills?.cpr || false,

      disasterManagement:
        volunteer.skills?.disasterManagement || false,

      crowdManagement:
        volunteer.skills?.crowdManagement || false,

      searchRescue:
        volunteer.skills?.searchRescue || false,

      fireSafety:
        volunteer.skills?.fireSafety || false,
    });

    if (volunteer.profilePhoto) {
  setProfileImage(
    `${BASE_URL}/uploads/volunteers/${volunteer.profilePhoto}`
  );
} else {
  setProfileImage("https://i.pravatar.cc/200");
}
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchProfile();
  }, []);

  const formattedDate = formData.registrationDate
  ? new Date(formData.registrationDate).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  : "";

  // -----------------------
  // Save Profile
  // -----------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const form = new FormData();

      const profileData = { ...formData };

// These belong to User collection
delete profileData.fullName;
delete profileData.email;
delete profileData.mobile;
delete profileData.volunteerId;

Object.keys(profileData).forEach((key) => {
  form.append(key, profileData[key]);
  });

      if (profilePhoto) {
        form.append(
          "profilePhoto",
          profilePhoto
        );
      }

      if (aadhaarDocument) {
        form.append(
          "aadhaarDocument",
          aadhaarDocument
        );
      }

      if (volunteerIdDocument) {
        form.append(
          "volunteerIdDocument",
          volunteerIdDocument
        );
      }
      
      const { data } = await API.put(
        "/volunteer/profile",
        form,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      alert(data.message);

     await fetchProfile();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Unable to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <VolunteerSidebar />

      {/* Main Content */}
      <form
  onSubmit={handleSubmit}
  className="flex-1 p-6 lg:p-10"
>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Volunteer Profile
          </h1>

          <p className="mt-2 text-gray-500">
            Manage your personal information and volunteer details.
          </p>
        </div>

        {/* Personal Information Card */}
        <div className="rounded-3xl bg-white shadow-lg">

          {/* Card Header */}
          <div className="border-b px-8 py-6">
            <h2 className="flex items-center gap-2 text-2xl font-bold text-blue-700">
              <User size={26} />
              Personal Information
            </h2>
          </div>

          <div className="grid gap-10 p-8 lg:grid-cols-3">

            {/* Left - Profile Image */}
            <div className="flex flex-col items-center">

              <div className="relative">

                <img
                  src={profileImage}
                  alt="Volunteer"
                  className="h-44 w-44 rounded-full border-4 border-blue-100 object-cover shadow-lg"
                />

                <button
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-2 right-2 rounded-full bg-blue-600 p-3 text-white shadow-lg transition hover:bg-blue-700"
                >
                  <Camera size={20} />
                </button>

                <input
                     type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => {
                    handleImage(e);

                    if (e.target.files[0]) {
                    setProfilePhoto(e.target.files[0]);
                    }
                    }}
                />
              </div>

              <h3 className="mt-5 text-xl font-bold">
                {formData.fullName}
              </h3>

              <p className="text-gray-500">
                Volunteer
              </p>

              <span className="mt-3 rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">
                Active Volunteer
              </span>
            </div>

            {/* Right Form */}
            <div className="lg:col-span-2">

              <div className="grid gap-6 md:grid-cols-2">

                {/* Full Name */}
                <div>
                  <label className="mb-2 block font-semibold">
                    Full Name
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-3 top-3.5 text-gray-400"
                    />

                    <input
                    name="fullName"
                    value={formData.fullName}
                    readOnly
                    className="w-full rounded-xl border bg-gray-100 px-4 py-3"
                    />
                  </div>
                </div>

                {/* Volunteer ID */}
                <div>
                  <label className="mb-2 block font-semibold">
                    Volunteer ID
                  </label>

                  <div className="relative">
                    <CreditCard
                      size={18}
                      className="absolute left-3 top-3.5 text-gray-400"
                    />

                    <input
                    name="volunteerId"
                    value={formData.volunteerId}
                    readOnly
                    className="w-full rounded-xl border bg-gray-100 px-4 py-3"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="mb-2 block font-semibold">
                    Gender
                  </label>

                  <div className="relative">
                    <Users
                      size={18}
                      className="absolute left-3 top-3.5 text-gray-400"
                    />

                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full rounded-xl border pl-10 pr-4 py-3 outline-none focus:border-blue-500"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                {/* DOB */}
                <div>
                  <label className="mb-2 block font-semibold">
                    Date of Birth
                  </label>

                  <div className="relative">
                    <Calendar
                      size={18}
                      className="absolute left-3 top-3.5 text-gray-400"
                    />

                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="w-full rounded-xl border pl-10 pr-4 py-3 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Age */}
                <div>
                  <label className="mb-2 block font-semibold">
                    Age
                  </label>

                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                {/* Blood Group */}
                <div>
                  <label className="mb-2 block font-semibold">
                    Blood Group
                  </label>

                  <div className="relative">
                    <Droplets
                      size={18}
                      className="absolute left-3 top-3.5 text-red-500"
                    />

                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className="w-full rounded-xl border pl-10 pr-4 py-3 outline-none focus:border-blue-500"
                    >
                      <option>A+</option>
                      <option>A-</option>
                      <option>B+</option>
                      <option>B-</option>
                      <option>AB+</option>
                      <option>AB-</option>
                      <option>O+</option>
                      <option>O-</option>
                    </select>
                  </div>
                </div>

                {/* Aadhaar */}
                <div className="md:col-span-2">
                  <label className="mb-2 block font-semibold">
                    Aadhaar Number
                  </label>

                  <input
                    type="text"
                    name="aadhaarNumber"
                    placeholder="XXXX XXXX XXXX"
                    value={formData.aadhaarNumber}
                    onChange={handleChange}
                    className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

              </div>
            </div>
          </div>
        </div>
               {/* Contact Information */}
<div className="mt-8 rounded-3xl bg-white shadow-lg">

  <div className="border-b px-8 py-6">
    <h2 className="flex items-center gap-2 text-2xl font-bold text-blue-700">
      📞 Contact Information
    </h2>
  </div>

  <div className="grid gap-6 p-8 md:grid-cols-2">

    {/* Mobile */}
    <div>
      <label className="mb-2 block font-semibold">
        Mobile Number
      </label>

      <input
       name="mobile"
       value={formData.mobile}
       readOnly
       className="w-full rounded-xl border bg-gray-100 px-4 py-3"
      />
    </div>

    {/* Alternate Mobile */}
    <div>
      <label className="mb-2 block font-semibold">
        Alternate Mobile
      </label>

      <input
        type="tel"
        name="alternateMobile"
        value={formData.alternateMobile}
        onChange={handleChange}
        placeholder="Enter Alternate Number"
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>

    {/* Email */}
    <div>
      <label className="mb-2 block font-semibold">
        Email Address
      </label>

      <input
        name="email"
        value={formData.email}
        readOnly
        className="w-full rounded-xl border bg-gray-100 px-4 py-3"
        />
    </div>

    {/* PIN Code */}
    <div>
      <label className="mb-2 block font-semibold">
        PIN Code
      </label>

      <input
        type="text"
        name="pincode"
        value={formData.pincode}
        onChange={handleChange}
        placeholder="Enter PIN Code"
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>

    {/* Address */}
    <div className="md:col-span-2">
      <label className="mb-2 block font-semibold">
        Address
      </label>

      <textarea
        rows={4}
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Enter Complete Address"
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>

    {/* District */}
    <div>
      <label className="mb-2 block font-semibold">
        District
      </label>

      <input
        type="text"
        name="district"
        value={formData.district}
        onChange={handleChange}
        placeholder="District"
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>

    {/* State */}
    <div>
      <label className="mb-2 block font-semibold">
        State
      </label>

      <input
        type="text"
        name="state"
        value={formData.state}
        onChange={handleChange}
        placeholder="State"
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>

  </div>
</div>

        {/* Volunteer Information */}
<div className="mt-8 rounded-3xl bg-white shadow-lg">

  <div className="border-b px-8 py-6">
    <h2 className="flex items-center gap-2 text-2xl font-bold text-blue-700">
      🤝 Volunteer Information
    </h2>
  </div>

  <div className="grid gap-6 p-8 md:grid-cols-2">

    {/* Volunteer Role */}
    <div>
      <label className="mb-2 block font-semibold">
        Volunteer Role
      </label>

      <select
        name="volunteerRole"
        value={formData.volunteerRole}
        onChange={handleChange}
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
      >
        <option value="">Select Role</option>
        <option value="General Volunteer">General Volunteer</option>
        <option value="Medical Volunteer">Medical Volunteer</option>
        <option value="Rescue Volunteer">Rescue Volunteer</option>
        <option value="Crowd Management">Crowd Management</option>
        <option value="Traffic Volunteer">Traffic Volunteer</option>
      </select>
    </div>

    {/* Assigned Zone */}
    <div>
      <label className="mb-2 block font-semibold">
        Assigned Zone
      </label>

      <input
        type="text"
        name="assignedZone"
        value={formData.assignedZone}
        onChange={handleChange}
        placeholder="Zone Name"
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
      />
    </div>

    {/* Organization */}
    <div>
      <label className="mb-2 block font-semibold">
        Organization / NGO
      </label>

      <input
        type="text"
        name="organization"
        value={formData.organization}
        onChange={handleChange}
        placeholder="Organization Name"
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
      />
    </div>

    {/* Volunteer Since */}
    <div>
      <label className="mb-2 block font-semibold">
        Volunteer Since
      </label>

      <input
        type="date"
        name="volunteerSince"
        value={formData.volunteerSince}
        onChange={handleChange}
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
      />
    </div>

    {/* Availability */}
    <div>
      <label className="mb-2 block font-semibold">
        Availability
      </label>

      <select
        name="availability"
        value={formData.availability}
        onChange={handleChange}
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
      >
        <option value="">Select Availability</option>
        <option value="Full Time">Full Time</option>
        <option value="Part Time">Part Time</option>
        <option value="Weekends Only">Weekends Only</option>
        <option value="On Call">On Call</option>
      </select>
    </div>

    {/* Languages */}
    <div>
      <label className="mb-2 block font-semibold">
        Languages Known
      </label>

      <input
        type="text"
        name="languages"
        value={formData.languages}
        onChange={handleChange}
        placeholder="English, Hindi, Marathi"
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
      />
    </div>

    {/* Bio */}
    <div className="md:col-span-2">
      <label className="mb-2 block font-semibold">
        Volunteer Bio
      </label>

      <textarea
        rows={4}
        name="bio"
        value={formData.bio}
        onChange={handleChange}
        placeholder="Write something about yourself..."
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
      />
    </div>

  </div>
</div>
               {/* Emergency Contact */}
<div className="mt-8 rounded-3xl bg-white shadow-lg">

  <div className="border-b px-8 py-6">
    <h2 className="flex items-center gap-2 text-2xl font-bold text-red-600">
      🚨 Emergency Contact
    </h2>
  </div>

  <div className="grid gap-6 p-8 md:grid-cols-2">

    {/* Contact Name */}
    <div>
      <label className="mb-2 block font-semibold">
        Contact Person Name
      </label>

      <input
        type="text"
        name="emergencyName"
        value={formData.emergencyName}
        onChange={handleChange}
        placeholder="Enter Name"
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
      />
    </div>

    {/* Relationship */}
    <div>
      <label className="mb-2 block font-semibold">
        Relationship
      </label>

      <select
        name="relationship"
        value={formData.relationship}
        onChange={handleChange}
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-500"
      >
        <option value="">Select Relationship</option>
        <option value="Father">Father</option>
        <option value="Mother">Mother</option>
        <option value="Brother">Brother</option>
        <option value="Sister">Sister</option>
        <option value="Spouse">Spouse</option>
        <option value="Friend">Friend</option>
        <option value="Other">Other</option>
      </select>
    </div>

    {/* Mobile */}
    <div>
      <label className="mb-2 block font-semibold">
        Mobile Number
      </label>

      <input
        type="tel"
        name="emergencyMobile"
        value={formData.emergencyMobile}
        onChange={handleChange}
        placeholder="Enter Mobile Number"
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
      />
    </div>

    {/* Alternate Mobile */}
    <div>
      <label className="mb-2 block font-semibold">
        Alternate Number
      </label>

      <input
        type="tel"
        name="emergencyAlternateMobile"
        value={formData.emergencyAlternateMobile}
        onChange={handleChange}
        placeholder="Optional"
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
      />
    </div>

  </div>
</div>

        {/* Medical Information */}
<div className="mt-8 rounded-3xl bg-white shadow-lg">

  <div className="border-b px-8 py-6">
    <h2 className="flex items-center gap-2 text-2xl font-bold text-pink-600">
      ❤️ Medical Information
    </h2>
  </div>

  <div className="grid gap-6 p-8 md:grid-cols-2">

    {/* Blood Group */}
    <div>
      <label className="mb-2 block font-semibold">
        Blood Group
      </label>

      <select
        name="bloodGroup"
        value={formData.bloodGroup}
        onChange={handleChange}
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-pink-500"
      >
        <option value="">Select</option>
        <option value="A+">A+</option>
        <option value="A-">A-</option>
        <option value="B+">B+</option>
        <option value="B-">B-</option>
        <option value="AB+">AB+</option>
        <option value="AB-">AB-</option>
        <option value="O+">O+</option>
        <option value="O-">O-</option>
      </select>
    </div>

    {/* Organ Donor */}
    <div>
      <label className="mb-2 block font-semibold">
        Organ Donor
      </label>

      <select
        name="organDonor"
        value={String(formData.organDonor)}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            organDonor: e.target.value === "true",
          }))
        }
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-pink-500"
      >
        <option value="false">No</option>
        <option value="true">Yes</option>
      </select>
    </div>

    {/* Allergies */}
    <div className="md:col-span-2">
      <label className="mb-2 block font-semibold">
        Allergies
      </label>

      <textarea
        rows={3}
        name="allergies"
        value={formData.allergies}
        onChange={handleChange}
        placeholder="Mention allergies if any"
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-pink-500"
      />
    </div>

    {/* Conditions */}
    <div className="md:col-span-2">
      <label className="mb-2 block font-semibold">
        Existing Medical Conditions
      </label>

      <textarea
        rows={3}
        name="conditions"
        value={formData.conditions}
        onChange={handleChange}
        placeholder="Diabetes, Asthma, etc."
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-pink-500"
      />
    </div>

    {/* Medications */}
    <div className="md:col-span-2">
      <label className="mb-2 block font-semibold">
        Current Medications
      </label>

      <textarea
        rows={3}
        name="medications"
        value={formData.medications}
        onChange={handleChange}
        placeholder="List current medications"
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-pink-500"
      />
    </div>

  </div>
</div>

       {/* Skills */}
<div className="mt-8 rounded-3xl bg-white shadow-lg">

  <div className="border-b px-8 py-6">
    <h2 className="text-2xl font-bold text-green-600">
      🏅 Skills & Certifications
    </h2>
  </div>

  <div className="grid gap-5 p-8 md:grid-cols-2">

    {[
      ["firstAid", "First Aid Certified"],
      ["cpr", "CPR Certified"],
      ["disasterManagement", "Disaster Management"],
      ["crowdManagement", "Crowd Management"],
      ["searchRescue", "Search & Rescue"],
      ["fireSafety", "Fire Safety Training"],
    ].map(([key, label]) => (
      <label
        key={key}
        className="flex items-center gap-3 rounded-xl border p-4 cursor-pointer hover:bg-green-50"
      >
        <input
          type="checkbox"
          name={key}
          checked={formData[key]}
          onChange={handleChange}
          className="h-5 w-5"
        />

        {label}
      </label>
    ))}

  </div>

</div>

               {/* Identity Verification */}
<div className="mt-8 rounded-3xl bg-white shadow-lg">

  <div className="border-b px-8 py-6">
    <h2 className="text-2xl font-bold text-indigo-600">
      🪪 Identity Verification
    </h2>
  </div>

  <div className="grid gap-6 p-8 md:grid-cols-2">

    {/* Aadhaar */}

    <div>
      <label className="mb-2 block font-semibold">
        Aadhaar Card
      </label>

      <input
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={(e) =>
          setAadhaarDocument(e.target.files[0])
        }
        className="w-full rounded-xl border p-3"
      />
    </div>

    {/* Volunteer ID */}

    <div>
      <label className="mb-2 block font-semibold">
        Volunteer ID Card
      </label>

      <input
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={(e) =>
          setVolunteerIdDocument(e.target.files[0])
        }
        className="w-full rounded-xl border p-3"
      />
    </div>

  </div>

</div>

        {/* Account Information */}
        <div className="mt-8 rounded-3xl bg-white shadow-lg">

          <div className="border-b px-8 py-6">
            <h2 className="text-2xl font-bold text-slate-700">
              🔒 Account Information
            </h2>
          </div>

          <div className="grid gap-6 p-8 md:grid-cols-2">

            <div>
              <label className="mb-2 block font-semibold">
                Username
              </label>

              <input
  type="text"
  value={formData.username}
  readOnly
  className="w-full rounded-xl border bg-gray-100 px-4 py-3"
/>
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Email Verification
              </label>

              <input
  type="text"
  value={formData.emailVerified ? "Verified" : "Not Verified"}
  readOnly
  className={`w-full rounded-xl border px-4 py-3 font-semibold ${
    formData.emailVerified
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700"
  }`}
/>
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Registration Date
              </label>
<input
  type="text"
  value={formattedDate}
  readOnly
  className="w-full rounded-xl border bg-gray-100 px-4 py-3"
/>
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Account Status
              </label>

              <input
  type="text"
  value={formData.accountStatus}
  readOnly
  className={`w-full rounded-xl border px-4 py-3 font-semibold ${
    formData.accountStatus === "Active"
      ? "bg-blue-100 text-blue-700"
      : "bg-red-100 text-red-700"
  }`}
/>
            </div>

          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-end">

          <button
            type="button"
            className="rounded-xl border border-gray-300 px-8 py-3 font-semibold transition hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <Save size={20} />
            Save Changes
          </button>

        </div>

      </form>
    </div>
  );
};

export default VolunteerProfile;