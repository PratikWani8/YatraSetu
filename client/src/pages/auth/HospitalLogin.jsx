import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  LogIn,
  Building2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../services/authApi";

export default function HospitalLogin() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  /* ==============================
        Validation
  ============================== */

  const validate = () => {
    const err = {};

    if (!formData.identifier.trim()) {
      err.identifier = "Email is required";
    }

    if (!formData.password.trim()) {
      err.password = "Password is required";
    }

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  /* ==============================
        Handle Input
  ============================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  /* ==============================
        Login
  ============================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const res = await API.post(
        "/hospital/login",
        formData
      );

      const { token, hospital } = res.data;

      if (rememberMe) {
        localStorage.setItem("token", token);
        localStorage.setItem(
          "user",
          JSON.stringify(hospital)
        );

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
      } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem(
          "user",
          JSON.stringify(hospital)
        );

        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      toast.success("Login Successful!");

      setTimeout(() => {
        navigate("/hospital/dashboard");
      }, 1200);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-red-50 via-white to-blue-50">

      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -60, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 12,
        }}
        className="absolute left-0 top-0 h-80 w-80 rounded-full bg-red-200 opacity-30 blur-3xl"
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
        className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-200 opacity-30 blur-3xl"
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xl rounded-3xl bg-white/90 p-8 shadow-2xl backdrop-blur-xl"
        >

          <div className="text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">

              <Building2
                size={42}
                className="text-red-600"
              />

            </div>

            <h1 className="mt-5 text-4xl font-black">
              Hospital Login
            </h1>

            <p className="mt-2 text-gray-500">
              Sign in to your hospital account
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            {/* Email */}

            <div>

              <label className="mb-2 block font-semibold">
                Email
              </label>

              <div className="flex items-center rounded-xl border px-4">

                <Mail className="text-red-600" />

                <input
                  type="email"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
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

              <label className="mb-2 block font-semibold">
                Password
              </label>

              <div className="flex items-center rounded-xl border px-4">

                <Lock className="text-red-600" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full bg-transparent px-3 py-4 outline-none"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="text-gray-500 hover:text-red-600"
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

            {/* Remember Me */}

            <div className="flex items-center justify-between">

              <label className="flex cursor-pointer items-center gap-2">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                  className="h-4 w-4 accent-red-600"
                />

                <span className="text-sm text-gray-700">
                  Remember Me
                </span>

              </label>

              <Link
                to="/hospital/forgot-password"
                className="text-sm font-medium text-red-600 hover:text-red-700"
              >
                Forgot Password?
              </Link>

            </div>

            {/* Login Button */}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 py-4 font-bold text-white shadow-xl transition hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading ? (
                <>
                  <Loader2
                    size={22}
                    className="animate-spin"
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

            <div className="h-px flex-1 bg-gray-300" />

            <span className="px-4 text-gray-500">
              OR
            </span>

            <div className="h-px flex-1 bg-gray-300" />

          </div>

          {/* Register */}

          <div className="text-center">

            <p className="text-gray-600">
              Don't have a hospital account?
            </p>

            <Link
              to="/hospital/register"
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Register Hospital
            </Link>

          </div>

        </motion.div>

      </div>

    </div>
  );
}