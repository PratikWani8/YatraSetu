import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  UserPlus,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/authApi";
import toast from "react-hot-toast";
import Confetti from "react-confetti";

function Requirement({ ok, text }) {
  return (
    <div
      className={`flex items-center gap-2 text-sm ${
        ok ? "text-green-600" : "text-gray-500"
      }`}
    >
      <CheckCircle2
        size={16}
        className={
          ok ? "text-green-600" : "text-gray-400"
        }
      />

      <span>{text}</span>
    </div>
  );
}

export default function PilgrimRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    remember: true,
  });

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [showSuccess, setShowSuccess] =
    useState(false);

  const [pilgrim, setPilgrim] =
    useState(null);

  /* ----------------------------- */

  const passwordStrength = () => {
    const password = formData.password;

    let score = 0;

    if (password.length >= 8) score++;

    if (/[A-Z]/.test(password)) score++;

    if (/[0-9]/.test(password)) score++;

    if (/[^A-Za-z0-9]/.test(password))
      score++;

    return score;
  };

  const strengthText = [
    "Very Weak",
    "Weak",
    "Good",
    "Strong",
    "Excellent",
  ];

  /* ----------------------------- */

  const validate = () => {
    const err = {};

    if (!formData.name.trim()) {
      err.name = "Name is required";
    }

    if (!formData.email.trim()) {
      err.email = "Email is required";
    } else if (
      !/^\S+@\S+\.\S+$/.test(
        formData.email
      )
    ) {
      err.email = "Invalid Email";
    }

    if (
      !/^[6-9]\d{9}$/.test(
        formData.mobile
      )
    ) {
      err.mobile =
        "Invalid Mobile Number";
    }

    if (formData.password.length < 8) {
      err.password =
        "Minimum 8 characters";
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      err.confirmPassword =
        "Passwords do not match";
    }

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  /* ----------------------------- */

  const handleChange = (e) => {
    const {
      name,
      value,
      checked,
      type,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  /* ----------------------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const res = await API.post("/register", formData);

      const { token, pilgrim } =
        res.data;

      if (formData.remember) {
        localStorage.setItem(
          "token",
          token
        );
      } else {
        sessionStorage.setItem(
          "token",
          token
        );
      }

      setPilgrim(pilgrim);

      setShowSuccess(true);

      toast.success(
        "Registration Successful"
      );

      setTimeout(() => {
        navigate(
          `/pilgrim/dashboard`
        );
      }, 2500);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-100">

      {/* Animated Background */}

      <motion.div
        animate={{
          x: [0, 120, 0],
          y: [0, -80, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 12,
        }}
        className="absolute left-0 top-0 h-80 w-80 rounded-full bg-blue-300 opacity-30 blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, -120, 0],
          y: [0, 80, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 10,
        }}
        className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-cyan-300 opacity-30 blur-3xl"
      />

      {showSuccess && (
        <Confetti
          recycle={false}
          numberOfPieces={350}
        />
      )}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="w-full max-w-xl rounded-3xl bg-white/80 p-8 shadow-2xl backdrop-blur-xl"
        >

          {/* Header */}

          <div className="text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">

              <ShieldCheck
                size={45}
                className="text-blue-600"
              />

            </div>

            <h1 className="mt-5 text-4xl font-black">

              Create Account

            </h1>

            <p className="mt-3 text-gray-500">

              Join the Smart Pilgrim
              Management System

            </p>

          </div>

          {/* ================= Registration Form ================= */}

<form
  onSubmit={handleSubmit}
  className="mt-10 space-y-6"
>

  {/* ================= Name ================= */}

  <div>

    <label className="mb-2 block font-semibold text-gray-700">

      Full Name

    </label>

    <div className="flex items-center rounded-xl border border-gray-300 bg-white px-4 transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">

      <User
        size={20}
        className="text-blue-500"
      />

      <input
        type="text"
        name="name"
        placeholder="Enter your full name"
        value={formData.name}
        onChange={handleChange}
        className="w-full bg-transparent px-3 py-4 outline-none"
      />

    </div>

    {errors.name && (

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-2 text-sm font-medium text-red-500"
      >

        {errors.name}

      </motion.p>

    )}

  </div>

  {/* ================= Email ================= */}

  <div>

    <label className="mb-2 block font-semibold text-gray-700">

      Email Address

    </label>

    <div className="flex items-center rounded-xl border border-gray-300 bg-white px-4 transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">

      <Mail
        size={20}
        className="text-blue-500"
      />

      <input
        type="email"
        name="email"
        placeholder="example@gmail.com"
        value={formData.email}
        onChange={handleChange}
        className="w-full bg-transparent px-3 py-4 outline-none"
      />

    </div>

    {errors.email && (

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-2 text-sm font-medium text-red-500"
      >

        {errors.email}

      </motion.p>

    )}

  </div>

  {/* ================= Mobile ================= */}

  <div>

    <label className="mb-2 block font-semibold text-gray-700">

      Mobile Number

    </label>

    <div className="flex items-center rounded-xl border border-gray-300 bg-white px-4 transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">

      <Phone
        size={20}
        className="text-blue-500"
      />

      <input
        type="tel"
        name="mobile"
        maxLength={10}
        placeholder="9876543210"
        value={formData.mobile}
        onChange={handleChange}
        className="w-full bg-transparent px-3 py-4 outline-none"
      />

    </div>

    {errors.mobile && (

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-2 text-sm font-medium text-red-500"
      >

        {errors.mobile}

      </motion.p>

    )}

  </div>

  {/* ================= Password ================= */}

<div>
  <label className="mb-2 block font-semibold text-gray-700">
    Password
  </label>

  <div className="flex items-center rounded-xl border border-gray-300 bg-white px-4 transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">

    <Lock size={20} className="text-blue-500" />

    <input
      type={showPassword ? "text" : "password"}
      name="password"
      placeholder="Create Password"
      value={formData.password}
      onChange={handleChange}
      className="w-full bg-transparent px-3 py-4 outline-none"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="text-gray-500 hover:text-blue-600"
    >
      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  </div>

  {errors.password && (
    <p className="mt-2 text-sm text-red-500">
      {errors.password}
    </p>
  )}
</div>

<div>

  <div className="mb-2 flex justify-between">

    <span className="text-sm font-medium text-gray-600">
      Password Strength
    </span>

    <span
      className={`text-sm font-bold ${
        passwordStrength() <= 1
          ? "text-red-500"
          : passwordStrength() === 2
          ? "text-orange-500"
          : passwordStrength() === 3
          ? "text-yellow-500"
          : "text-green-600"
      }`}
    >
      {strengthText[passwordStrength()]}
    </span>

  </div>

  <div className="rounded-xl bg-blue-50 p-4 border border-blue-100">

  <h4 className="font-semibold text-blue-700 mb-3">
    Password Requirements
  </h4>

  <Requirement
    ok={formData.password.length >= 8}
    text="Minimum 8 characters"
  />

  <Requirement
    ok={/[A-Z]/.test(formData.password)}
    text="One uppercase letter"
  />

  <Requirement
    ok={/[0-9]/.test(formData.password)}
    text="One number"
  />

  <Requirement
    ok={/[^A-Za-z0-9]/.test(formData.password)}
    text="One special character"
  />

</div>

  <div className="h-3 overflow-hidden rounded-full bg-gray-200">

    <motion.div
      animate={{
        width: `${passwordStrength() * 25}%`,
      }}
      className={`h-full ${
        passwordStrength() <= 1
          ? "bg-red-500"
          : passwordStrength() === 2
          ? "bg-orange-500"
          : passwordStrength() === 3
          ? "bg-yellow-500"
          : "bg-green-500"
      }`}
    />

  </div>

</div>

{/* ================= Confirm Password ================= */}

<div>

  <label className="mb-2 block font-semibold text-gray-700">
    Confirm Password
  </label>

  <div className="flex items-center rounded-xl border border-gray-300 bg-white px-4 transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">

    <Lock size={20} className="text-blue-500" />

    <input
      type={showConfirmPassword ? "text" : "password"}
      name="confirmPassword"
      placeholder="Confirm Password"
      value={formData.confirmPassword}
      onChange={handleChange}
      className="w-full bg-transparent px-3 py-4 outline-none"
    />

    <button
      type="button"
      onClick={() =>
        setShowConfirmPassword(!showConfirmPassword)
      }
      className="text-gray-500 hover:text-blue-600"
    >
      {showConfirmPassword ? (
        <EyeOff size={20} />
      ) : (
        <Eye size={20} />
      )}
    </button>

  </div>

  {errors.confirmPassword && (
    <p className="mt-2 text-sm text-red-500">
      {errors.confirmPassword}
    </p>
  )}

  {formData.confirmPassword &&
    formData.password ===
      formData.confirmPassword && (

      <div className="mt-3 flex items-center gap-2 text-green-600">

        <CheckCircle2 size={18} />

        Passwords Match

      </div>

    )}

</div>

{/* ================= Remember Me ================= */}

<div className="flex items-center justify-between">

  <label className="flex items-center gap-3">

    <input
      type="checkbox"
      name="remember"
      checked={formData.remember}
      onChange={handleChange}
      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
    />

    <span className="text-gray-700">
      Keep me logged in
    </span>

  </label>

  <Link
    to="/login"
    className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
  >
    Already Registered?
  </Link>

</div>

{/* ================= Register Button ================= */}

<motion.button
  type="submit"
  whileHover={{
    scale: 1.02,
  }}
  whileTap={{
    scale: 0.97,
  }}
  disabled={loading}
  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-4 text-lg font-bold text-white shadow-xl transition-all hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-70"
>

  {loading ? (

    <>

      <Loader2
        size={22}
        className="animate-spin"
      />

      Creating Account...

    </>

  ) : (

    <>

      <UserPlus size={22} />

      Create Account

    </>

  )}

</motion.button>

{/* ================= Login Divider ================= */}

<div className="relative py-3">

  <div className="absolute inset-0 flex items-center">

    <div className="w-full border-t border-gray-300"></div>

  </div>

  <div className="relative flex justify-center">

    <span className="bg-white px-4 text-sm text-gray-500">

      OR

    </span>

  </div>

</div>

{/* ================= Login Button ================= */}

<Link
  to="/pilgrim/login"
  className="flex w-full items-center justify-center rounded-2xl border-2 border-blue-600 py-4 font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
>

  Already have an account? Login

</Link>

</form>

{/* ================= Success Modal ================= */}

{showSuccess && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

  <motion.div
    initial={{
      opacity: 0,
      scale: 0.8,
    }}
    animate={{
      opacity: 1,
      scale: 1,
    }}
    className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-2xl"
  >

    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100">

      <CheckCircle2
        size={60}
        className="text-green-600"
      />

    </div>

    <h2 className="mt-6 text-3xl font-bold">

      Registration Successful

    </h2>

    <p className="mt-3 text-gray-600">

      Welcome{" "}

      <span className="font-bold">

        {pilgrim?.name}

      </span>

    </p>

    <p className="mt-2 text-sm text-gray-500">

      Your Pilgrim ID

    </p>

    <div className="mt-4 rounded-xl bg-blue-50 py-3 font-mono text-xl font-bold text-blue-700">

      {pilgrim?.pilgrimId}

    </div>

    <div className="mt-8">

      <div className="mx-auto h-2 w-48 overflow-hidden rounded-full bg-gray-200">

        <motion.div
          initial={{
            width: 0,
          }}
          animate={{
            width: "100%",
          }}
          transition={{
            duration: 2.5,
          }}
          className="h-full rounded-full bg-gradient-to-r from-green-500 to-blue-600"
        />

      </div>

      <p className="mt-4 text-gray-500">

        Redirecting to Dashboard...

      </p>

    </div>

  </motion.div>

</div>

)}

</motion.div>

</div>

</div>

);

}  