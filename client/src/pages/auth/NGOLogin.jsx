import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../services/api";

export default function NGOLogin() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });

  const [errors, setErrors] = useState({});

  /* ---------------- Validation ---------------- */

  const validate = () => {
    const err = {};

    if (!formData.email.trim()) {
      err.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      err.email = "Invalid email";
    }

    if (!formData.password) {
      err.password = "Password is required";
    }

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  /* ---------------- Handle Change ---------------- */

  const handleChange = (e) => {
    const { name, value, type, checked } =
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

  /* ---------------- Login ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const res = await API.post(
        "/ngo/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      const { token, ngo } = res.data;

      if (formData.rememberMe) {
        localStorage.setItem("token", token);
        localStorage.setItem(
          "user",
          JSON.stringify(ngo)
        );
      } else {
        sessionStorage.setItem(
          "token",
          token
        );
        sessionStorage.setItem(
          "user",
          JSON.stringify(ngo)
        );
      }

      toast.success("Login Successful!");

      setTimeout(() => {
        navigate("/ngo/dashboard");
      }, 1200);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">

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
        className="absolute left-0 top-0 h-80 w-80 rounded-full bg-violet-300 opacity-30 blur-3xl"
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
        className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-fuchsia-300 opacity-30 blur-3xl"
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="w-full max-w-xl rounded-3xl bg-white/90 p-8 shadow-2xl backdrop-blur-xl"
        >

          {/* Header */}

          <div className="text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-violet-100">

              <Building2
                size={42}
                className="text-violet-600"
              />

            </div>

            <h1 className="mt-5 text-4xl font-black">
              NGO Login
            </h1>

            <p className="mt-2 text-gray-500">
              Login to manage food
              distribution, medical camps,
              water supply and volunteer
              coordination.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            {/* Email */}

            <div>

              <label className="mb-2 block font-semibold">
                Official Email
              </label>

              <div className="flex items-center rounded-xl border px-4">

                <Mail className="text-violet-600" />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ngo@example.com"
                  className="w-full bg-transparent px-3 py-4 outline-none"
                />

              </div>

              {errors.email && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.email}
                </p>
              )}

            </div>
                        {/* Password */}

            <div>

              <label className="mb-2 block font-semibold">
                Password
              </label>

              <div className="flex items-center rounded-xl border px-4">

                <Lock className="text-violet-600" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full bg-transparent px-3 py-4 outline-none"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <EyeOff
                      size={20}
                      className="text-gray-500"
                    />
                  ) : (
                    <Eye
                      size={20}
                      className="text-gray-500"
                    />
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

              <label className="flex items-center gap-2 text-sm text-gray-600">

                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                />

                Remember Me

              </label>

              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-violet-600 hover:text-violet-700"
              >
                Forgot Password?
              </Link>

            </div>

            {/* Login Button */}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 py-4 font-bold text-white shadow-xl transition hover:shadow-2xl disabled:opacity-60"
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

            <div className="h-px flex-1 bg-gray-300" />

            <span className="px-4 text-gray-500">
              OR
            </span>

            <div className="h-px flex-1 bg-gray-300" />

          </div>

          {/* Register */}

          <div className="text-center">

            <p className="text-gray-600">
              Don't have an NGO account?
            </p>

            <Link
              to="/ngo/register"
              className="mt-3 inline-block rounded-xl bg-violet-600 px-8 py-3 font-semibold text-white transition hover:bg-violet-700"
            >
              Register NGO
            </Link>

          </div>

        </motion.div>

      </div>

    </div>
  );
}