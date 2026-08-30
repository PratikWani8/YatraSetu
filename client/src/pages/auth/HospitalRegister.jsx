import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Loader2,
  Building2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../services/authApi";

export default function HospitalRegister() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  /* ---------------- Validation ---------------- */

  const validate = () => {
    const err = {};

    if (!formData.name.trim()) {
      err.name = "Name is required";
    }

    if (!formData.email.trim()) {
      err.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      err.email = "Invalid email";
    }

    if (!formData.mobile.trim()) {
      err.mobile = "Mobile number is required";
    } else if (
      !/^[6-9]\d{9}$/.test(formData.mobile)
    ) {
      err.mobile = "Invalid mobile number";
    }

    if (formData.password.length < 8) {
      err.password =
        "Password must be at least 8 characters";
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

  /* ---------------- Handle Input ---------------- */

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

  /* ---------------- Register ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const res = await API.post(
        "/hospital/register",
        formData
      );

      const { token, hospital } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify(hospital)
      );

      toast.success(
        "Hospital registered successfully!"
      );

      setTimeout(() => {
        navigate("/hospital/dashboard");
      }, 1500);
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

          <div className="text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">

              <Building2
                size={42}
                className="text-red-600"
              />

            </div>

            <h1 className="mt-5 text-4xl font-black">
              Hospital Registration
            </h1>

            <p className="mt-2 text-gray-500">
              Create your hospital account
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            {/* Name */}

            <div>

              <label className="mb-2 block font-semibold">
                Full Name
              </label>

              <div className="flex items-center rounded-xl border px-4">

                <User className="text-red-600" />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="w-full bg-transparent px-3 py-4 outline-none"
                />

              </div>

              {errors.name && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.name}
                </p>
              )}

            </div>

            {/* Email */}

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
                  placeholder="example@gmail.com"
                  className="w-full bg-transparent px-3 py-4 outline-none"
                />

              </div>

              {errors.email && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.email}
                </p>
              )}

            </div>

            {/* Mobile */}

            <div>

              <label className="mb-2 block font-semibold">
                Mobile Number
              </label>

              <div className="flex items-center rounded-xl border px-4">

                <Phone className="text-red-600" />

                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="w-full bg-transparent px-3 py-4 outline-none"
                />

              </div>

              {errors.mobile && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.mobile}
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

            {/* Confirm Password */}

            <div>

              <label className="mb-2 block font-semibold">
                Confirm Password
              </label>

              <div className="flex items-center rounded-xl border px-4">

                <Lock className="text-red-600" />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className="w-full bg-transparent px-3 py-4 outline-none"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
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

            </div>

            {/* Register Button */}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 py-4 font-bold text-white shadow-xl transition hover:shadow-2xl disabled:opacity-60"
            >

              {loading ? (
                <>
                  <Loader2
                    className="animate-spin"
                    size={22}
                  />
                  Registering...
                </>
              ) : (
                <>
                  <UserPlus size={22} />
                  Register Hospital
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

          {/* Login */}

          <div className="text-center">

            <p className="text-gray-600">
              Already have a hospital account?
            </p>

            <Link
              to="/hospital/login"
              className="mt-3 inline-block rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Hospital Login
            </Link>

          </div>

        </motion.div>

      </div>

    </div>
  );
}