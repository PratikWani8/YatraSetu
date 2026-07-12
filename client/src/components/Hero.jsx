import heroImg from "../assets/yatrasetu_logo.png";
import { motion } from "framer-motion";
import ShinyText from "./ui/ShinyText"; 
import { Sparkles } from "lucide-react";
import GroqChatbot from "./GroqChatbot";

function Hero() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto px-6 pt-4 pb-10 md:pt-4 md:pb-16 gap-12">
      
      {/* Left Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-xl text-center md:text-left"
      >
        <div className="inline-flex items-center gap-2 bg-[#faede3] px-4 py-2 rounded-full mb-3">
          
          <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-orange-500" />
  
          <ShinyText
          text="Trusted Platform for Safety of Pilgrims"
          className="text-sm font-semibold"
          speed={4}
          delay={0}
          color="#F97316"
          shineColor="#ffffff"
          spread={120}
          pauseOnHover={false}
          />
        </div>

        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
          Your Personal Smart <br />
          <span className="text-[#F97316] audiowide">
            Safety Protection
          </span>{" "}
          Companion.
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-8 text-sm sm:text-base leading-relaxed">
          A smart A.I based platform for pilgrims to report safety incidents,
          send emergency SOS alerts and track complaint status securely.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start font-semibold">
          <button onClick={() => {
           document.getElementById("why-raksha")?.scrollIntoView({ behavior: "smooth" });
        }}
        className="bg-[#F97316] text-white px-6 py-3 rounded-full hover:scale-105 transition-all duration-300 shadow-md">
        Start ➜
        </button>

          <button className="border-2 border-[#F97316] text-[#F97316] px-6 py-3 font-semibold rounded-full hover:bg-[#F97316] hover:text-white transition-all duration-300">
            Safety Guide
          </button>
        </div>
      </motion.div>

      {/* Right Image */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="hidden md:flex justify-center"
      >
        <motion.img
          src={heroImg}
          alt="Raksha Safety Hero"
          className="w-115 drop-shadow-2xl"
          whileHover={{ scale: 1.15 }}
        />
      </motion.div>

      <GroqChatbot />

    </section>

  );
}

export default Hero;