import { motion } from "framer-motion";
import BlurText from "./ui/BlurText"; 

const steps = [
  "Register & Login securely.",
  "Activate SOS during emergency.",
  "Share live location with police.",
  "Get immediate help from authorities."
];

function HowItWorks() {
  return (
    <section className="bg-softOrange py-24 px-6 text-center">
      <div className="max-w-6xl mx-auto">
        
        <BlurText
          text="How YatraSetu Works"
          delay={120}
          stepDuration={0.3}
          className="text-4xl font-bold text-[#F97316] justify-center mb-6"
        />

        <p className="text-gray-600 mb-16 max-w-2xl mx-auto">
          YatraSetu protects pilgrims in emergency situations using smart technology and quick response systems.
        </p>

        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-8">

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}

              transition={{
                delay: index * 0.15,
                duration: 0.4,
                ease: "easeOut"
              }}

              whileHover={{
                y: -10,
                scale: 1.04,
                transition: { duration: 0.2 }
              }}

              className="bg-white border border-[#F97316] rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow duration-200"
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-[#F97316] text-white rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>

              <p className="text-gray-700 font-medium">
                {step}
              </p>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default HowItWorks;