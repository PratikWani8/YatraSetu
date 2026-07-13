import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  LogIn,
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/authApi";
import toast from "react-hot-toast";
import LoginSuccessAnimation from "../../components/pilgrim/LoginSuccessAnimation";

export default function PilgrimLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showSuccess, setShowSuccess] =
    useState(false);

  const [pilgrim, setPilgrim] = useState(null);

  // ----------------------------
  // Validation
  // ----------------------------

  const validate = () => {
    const err = {};

    if (!formData.identifier.trim()) {
      err.identifier =
        "Email or Pilgrim ID is required";
    }

    if (!formData.password.trim()) {
      err.password = "Password is required";
    }

    if (formData.password.length < 6) {
      err.password =
        "Password must be at least 6 characters";
    }

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  // ----------------------------
  // Input Change
  // ----------------------------

  const handleChange = (e) => {
    const { name, value, checked, type } =
      e.target;

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

  // ----------------------------
  // Login
  // ----------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

    const res = await API.post("/login", {
    identifier: formData.identifier,
    password: formData.password,
});
    
    const { token, pilgrim } = res.data;

// Save token and user
if (formData.remember) {
  localStorage.setItem("token", token);
  localStorage.setItem(
    "user",
    JSON.stringify(pilgrim)
  );
} else {
  sessionStorage.setItem("token", token);
  sessionStorage.setItem(
    "user",
    JSON.stringify(pilgrim)
  );
}

setPilgrim(pilgrim);

toast.success("Login Successful");

setShowSuccess(true);

// Redirect
setTimeout(() => {
      navigate("/pilgrim/dashboard");
}, 2500);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Invalid Credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-white overflow-hidden">

      {/* Animated Background */}

      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -60, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 12,
        }}
        className="absolute left-0 top-0 h-80 w-80 rounded-full bg-blue-200 blur-3xl opacity-30"
      />

      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 60, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 10,
        }}
        className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-cyan-200 blur-3xl opacity-30"
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6">

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
          className="w-full max-w-lg rounded-3xl bg-white/80 backdrop-blur-xl shadow-2xl p-8"
        >

          {/* Header */}

          <div className="text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">

              <ShieldCheck
                className="text-blue-600"
                size={45}
              />

            </div>

            <h1 className="mt-5 text-4xl font-black">

              Welcome Back

            </h1>

            <p className="mt-2 text-gray-500">

              Login using Email or Pilgrim ID

            </p>

          </div>

          {/* ================= LOGIN FORM ================= */}

<form
  onSubmit={handleSubmit}
  className="mt-10 space-y-6"
>

  {/* Email / Pilgrim ID */}

  <div>

    <label className="mb-2 block font-semibold text-gray-700">

      Email or Pilgrim ID

    </label>

    <div className="flex items-center rounded-xl border border-gray-300 bg-white px-4 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">

      <Mail
        size={20}
        className="text-blue-500"
      />

      <input
        type="text"
        name="identifier"
        value={formData.identifier}
        onChange={handleChange}
        placeholder="Email or PIL-2026-000001"
        className="w-full bg-transparent px-3 py-4 outline-none"
      />

    </div>

    {errors.identifier && (

      <p className="mt-2 text-sm text-red-500">

        {errors.identifier}

      </p>

    )}

  </div>

  {/* Password */}

  <div>

    <label className="mb-2 block font-semibold text-gray-700">

      Password

    </label>

    <div className="flex items-center rounded-xl border border-gray-300 bg-white px-4 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">

      <Lock
        size={20}
        className="text-blue-500"
      />

      <input
        type={
          showPassword
            ? "text"
            : "password"
        }
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Enter Password"
        className="w-full bg-transparent px-3 py-4 outline-none"
      />

      <button
        type="button"
        onClick={() =>
          setShowPassword(!showPassword)
        }
      >

        {showPassword ? (

          <EyeOff size={20} />

        ) : (

          <Eye size={20} />

        )}

      </button>

    </div>

    {errors.password && (

      <p className="mt-2 text-sm text-red-500">

        {errors.password}

      </p>

    )}

  </div>

  {/* Remember */}

  <div className="flex items-center justify-between">

    <label className="flex items-center gap-2">

      <input
        type="checkbox"
        name="remember"
        checked={formData.remember}
        onChange={handleChange}
      />

      Remember Me

    </label>

    <Link
      to="/forgot-password"
      className="font-medium text-blue-600 hover:underline"
    >

      Forgot Password?

    </Link>

  </div>

  {/* Login Button */}

  <motion.button
    whileHover={{
      scale: 1.03,
    }}
    whileTap={{
      scale: 0.97,
    }}
    disabled={loading}
    className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-4 font-bold text-white shadow-xl transition hover:shadow-2xl disabled:opacity-60"
  >

    {loading ? (

      <>

        <Loader2
          className="animate-spin"
          size={22}
        />

        Logging In...

      </>

    ) : (

      <>

        <LogIn size={22} />

        Login

      </>

    )}

  </motion.button>

</form>

{/* Divider */}

<div className="my-8 flex items-center">

  <div className="h-px flex-1 bg-gray-300"/>

  <span className="px-4 text-gray-500">

    OR

  </span>

  <div className="h-px flex-1 bg-gray-300"/>

</div>

{/* Register */}

<div className="text-center">

  <p className="text-gray-600">

    Don't have an account?

  </p>

  <Link
    to="/pilgrim/register"
    className="mt-3 inline-block rounded-xl bg-green-600 px-8 py-3 font-semibold text-white transition hover:bg-green-700"
  >

    Register Now

  </Link>

</div>

{/* Success */}

<LoginSuccessAnimation
  open={showSuccess}
  pilgrim={pilgrim || {}}
  onClose={() => {}}
  onDownload={() => {}}
  onRegisterAnother={() => {}}
>

  <div className="text-center">

    <ShieldCheck
      size={90}
      className="mx-auto text-green-600"
    />

    <h2 className="mt-5 text-3xl font-bold">

      Login Successful

    </h2>

    <p className="mt-2 text-gray-500">

      Redirecting to Dashboard...

    </p>

  </div>

</LoginSuccessAnimation>

</motion.div>

</div>

</div>

);
}