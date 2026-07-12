import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import WhyRaksha from "../components/WhyYatraSetu";
import HowItWorks from "../components/HowItWorks";
import Reviews from "../components/Reviews";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <WhyRaksha />
      <HowItWorks />
      <Reviews />
      <Footer />
    </>
  );
}

export default Home;