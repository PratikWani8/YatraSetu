import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  LogIn,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../services/authApi";

export default function VolunteerLogin() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState({});

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

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const res = await API.post("/volunteer/login", {
         identifier: formData.identifier,
        password: formData.password,
        });

    const { token, volunteer } = res.data;
      // Allow only volunteers
      if (volunteer.role !== "volunteer") {
  toast.error("This account is not a Volunteer account.");
  return;
}

      if (formData.remember) {
  localStorage.setItem("token", token);
  localStorage.setItem(
    "user",
    JSON.stringify(volunteer)
  );
} else {
  sessionStorage.setItem("token", token);
  sessionStorage.setItem(
    "user",
    JSON.stringify(volunteer)
  );
}

      toast.success("Volunteer Login Successful");

      navigate("/volunteer/dashboard");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-6">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl"
      >
        <div className="text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">

            <ShieldCheck
              className="text-green-600"
              size={45}
            />

          </div>

          <h1 className="mt-5 text-4xl font-black">
            Volunteer Login
          </h1>

          <p className="mt-2 text-gray-500">
            Login to access the Volunteer Dashboard
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >
          <div>

            <label className="mb-2 block font-semibold">
              Email
            </label>

            <div className="flex items-center rounded-xl border px-4">

              <Mail className="text-green-600" />

              <input
                type="email"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full bg-transparent px-3 py-4 outline-none"
              />

            </div>

            {errors.identifier && (
              <p className="mt-2 text-sm text-red-500">
                {errors.identifier}
              </p>
            )}

          </div>

          <div>

            <label className="mb-2 block font-semibold">
              Password
            </label>

            <div className="flex items-center rounded-xl border px-4">

              <Lock className="text-green-600" />

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
              className="text-green-600 hover:underline"
            >
              Forgot Password?
            </Link>

          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 py-4 font-bold text-white"
          >
            {loading ? (
              <>
                <Loader2
                  className="animate-spin"
                  size={20}
                />
                Logging In...
              </>
            ) : (
              <>
                <LogIn size={20} />
                Volunteer Login
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 text-center">

          <p className="text-gray-600">
            Don't have a Volunteer account?
          </p>

          <Link
            to="/volunteer/register"
            className="mt-3 inline-block rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Register Now
          </Link>

        </div>
      </motion.div>
    </div>
  );
}