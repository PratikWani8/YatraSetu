import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Phone,
  Eye,
  Moon,
  Shield,
  Hand,
  AlertTriangle,
  QrCode,
  MapPinned,
  CloudSun,
  Droplets,
  HeartPulse,
  Users,
  Navigation,
  BatteryCharging,
  Tent,
  Ambulance,
  Footprints,
  BadgeCheck,
  Package,
  Baby,
} from "lucide-react";
import ShinyText from "../components/ui/ShinyText"; 
import GroqChatbot from "../components/GroqChatbot";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import safetyImg from "../assets/safety.png";

function Safety() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
      className="bg-[#FFF7ED]"
    >
      <Navbar />

      {/* HERO SECTION */}
      <section className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto px-6 py-16 gap-12">

        {/* LEFT CONTENT */}
        <div className="max-w-xl text-center md:text-left">

          <div className="inline-flex items-center gap-2 bg-[#faede3] px-4 py-2 rounded-full mb-3">
  
          <ShinyText
          text="Stay Alert • Stay Safe • Stay Strong"
          className="text-sm font-semibold"
          speed={4}
          delay={0}
          color="#F97316"
          shineColor="#ffffff"
          spread={120}
          pauseOnHover={false}
          />

        </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Essential{" "}
            <span className="text-[#F97316] audiowide">
              Safety Tips
            </span>
            <br />
            for Pilgrims
          </h1>

          <p className="text-gray-600 mb-8">
            Follow these simple safety guidelines to protect yourself
            and stay confident in every situation.
          </p>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">

            <button
              onClick={() =>
                document.getElementById("tips").scrollIntoView({
                  behavior: "smooth",
                })
              }
              className="bg-[#F97316] text-white px-6 py-3 font-semibold
              rounded-full hover:scale-105 transition duration-300 shadow-md"
            >
              Get Started ➜
            </button>

            <button
              onClick={() => navigate("/police")}
              className="border-2 border-[#F97316] text-[#F97316] px-6 py-3 font-semibold 
              rounded-full hover:bg-[#F97316] hover:text-white transition duration-300"
            >
              Nearby Police
            </button>

          </div>
        </div>

        {/* RIGHT IMAGE (HIDDEN ON MOBILE) */}
        <div className="hidden md:block">
          <img
            src={safetyImg}
            alt="Safety Tips Illustration"
            className="w-130 drop-shadow-2xl"
          />
        </div>

      </section>

      {/* TIPS SECTION */}
      <section
        id="tips"
        className="max-w-6xl mx-auto px-6 pt-24 pb-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {tips.map((tip, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -6 }}
            className="bg-white border border-[#F97316] rounded-2xl p-6 shadow-md"
          >
            <div className="flex items-center gap-2 text-[#F97316] font-semibold mb-3">
              {tip.icon}
              {tip.title}
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">
              {tip.description}
            </p>
          </motion.div>
        ))}
      </section>
      <GroqChatbot />
      <Footer />
    </motion.div>
  );
}

const tips = [
  {
    icon: <Phone size={20} />,
    title: "Keep Emergency Contacts",
    description:
      "Save important contacts on speed dial and share your live location with trusted family members.",
  },
  {
    icon: <Eye size={20} />,
    title: "Stay Aware of Surroundings",
    description:
      "Remain alert in crowded places and avoid distractions while walking.",
  },
  {
    icon: <Moon size={20} />,
    title: "Avoid Isolated Areas",
    description:
      "Stick to designated pilgrimage routes and avoid isolated shortcuts, especially after dark.",
  },
  {
    icon: <Shield size={20} />,
    title: "Protect Personal Information",
    description:
      "Do not share sensitive personal details or travel plans with strangers.",
  },
  {
    icon: <Hand size={20} />,
    title: "Learn Basic Self-Defense",
    description:
      "Knowing simple self-defense techniques can help you react during emergencies.",
  },
  {
    icon: <AlertTriangle size={20} />,
    title: "Trust Your Instincts",
    description:
      "If a situation feels unsafe, move to a secure location and contact authorities immediately.",
  },
  {
    icon: <QrCode size={20} />,
    title: "Carry Your YatraSetu QR ID",
    description:
      "Keep your QR ID accessible at all times for quick identification during emergencies.",
  },
  {
    icon: <MapPinned size={20} />,
    title: "Use Official Pilgrim Routes",
    description:
      "Follow approved routes and checkpoints to ensure safety and avoid restricted areas.",
  },
  {
    icon: <CloudSun size={20} />,
    title: "Monitor Weather Updates",
    description:
      "Check weather alerts before starting your journey and avoid traveling during severe conditions.",
  },
  {
    icon: <Droplets size={20} />,
    title: "Stay Hydrated",
    description:
      "Drink water regularly and carry oral rehydration salts, especially during long walks.",
  },
  {
    icon: <HeartPulse size={20} />,
    title: "Carry Essential Medicines",
    description:
      "Keep your prescribed medicines, first-aid kit, and medical information with you.",
  },
  {
    icon: <Users size={20} />,
    title: "Stay With Your Group",
    description:
      "Avoid wandering alone in crowded areas. Decide on a meeting point in case anyone gets separated.",
  },
  {
    icon: <Navigation size={20} />,
    title: "Enable Location Services",
    description:
      "Keep GPS enabled so emergency responders can locate you quickly if needed.",
  },
  {
    icon: <BatteryCharging size={20} />,
    title: "Keep Your Phone Charged",
    description:
      "Carry a fully charged phone and a power bank for uninterrupted communication.",
  },
  {
    icon: <Tent size={20} />,
    title: "Know Nearby Help Centers",
    description:
      "Locate the nearest medical camps, police assistance booths, and emergency shelters.",
  },
  {
    icon: <Ambulance size={20} />,
    title: "Report Emergencies Immediately",
    description:
      "Use the YatraSetu SOS feature to notify volunteers, police, or medical teams instantly.",
  },
  {
    icon: <Footprints size={20} />,
    title: "Avoid Crowd Rush",
    description:
      "Follow crowd management instructions and never push or run during peak hours.",
  },
  {
    icon: <BadgeCheck size={20} />,
    title: "Verify Volunteers",
    description:
      "Seek assistance only from authorized volunteers and officials wearing valid ID cards.",
  },
  {
    icon: <Package size={20} />,
    title: "Travel Light",
    description:
      "Carry only essential belongings to move comfortably and reduce the risk of losing valuables.",
  },
  {
    icon: <Baby size={20} />,
    title: "Take Care of Children & Elderly",
    description:
      "Keep children and senior citizens close, and ensure they also carry their YatraSetu QR ID.",
  },
];

export default Safety;