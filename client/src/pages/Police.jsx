import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import ShinyText from "../components/ui/ShinyText"; 
import GroqChatbot from "../components/GroqChatbot";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import policeImg from "../assets/police.png";

function Police() {
  const mapRef = useRef(null);
  const routeRef = useRef(null);
  const markersRef = useRef([]);
  const mapSectionRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const userIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    shadowUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const policeIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  useEffect(() => {
    if (mapRef.current) return;

    const mapInstance = L.map("map").setView([20.5937, 78.9629], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapInstance);

    mapRef.current = mapInstance;
  }, []);

  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-IN";
    speech.rate = 1;
    window.speechSynthesis.speak(speech);
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(showMap, showError);
  };

  const showMap = (position) => {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;

    mapRef.current.setView([userLat, userLng], 14);

    markersRef.current.forEach((marker) =>
      mapRef.current.removeLayer(marker)
    );
    markersRef.current = [];

    if (routeRef.current) {
      mapRef.current.removeControl(routeRef.current);
    }

    const userMarker = L.marker([userLat, userLng], {
      icon: userIcon,
    })
      .addTo(mapRef.current)
      .bindPopup("📍 You are here")
      .openPopup();

    markersRef.current.push(userMarker);

    setTimeout(() => {
      mapRef.current.invalidateSize();
    }, 200);

    getPoliceStations(userLat, userLng);
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  const getPoliceStations = async (userLat, userLng) => {
    const radius = 7000;

    const query = `
      [out:json];
      node
        [amenity=police]
        (around:${radius},${userLat},${userLng});
      out;
    `;

    const url =
      "https://overpass-api.de/api/interpreter?data=" +
      encodeURIComponent(query);

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!data.elements || data.elements.length === 0) {
        alert("No police stations found nearby.");
        setLoading(false);
        return;
      }

      const stations = data.elements.map((place) => {
        const policeLat = place.lat;
        const policeLng = place.lon;
        const name = place.tags?.name || "Police Station";

        const distance = getDistance(
          userLat,
          userLng,
          policeLat,
          policeLng
        );

        return { policeLat, policeLng, name, distance };
      });

      stations.sort((a, b) => a.distance - b.distance);

      const nearest = stations[0];

      showRoute(userLat, userLng, nearest.policeLat, nearest.policeLng);

      stations.slice(0, 5).forEach((station, index) => {
        const { policeLat, policeLng, name, distance } = station;

        const marker = L.marker([policeLat, policeLng], {
          icon: policeIcon,
        }).addTo(mapRef.current);

        marker.bindPopup(`
          <div style="
            font-family:Poppins,sans-serif;
            padding:10px;
            width:200px;
          ">
            <h3 style="color:#F97316;margin-bottom:5px;">
              ${name}
            </h3>
            <p style="margin:4px 0;">
              Distance: ${distance.toFixed(2)} km
            </p>
            ${
              index === 0
                ? "<p style='color:red;font-weight:bold;'>🚨 Nearest Station</p>"
                : ""
            }
            <a href="tel:112" style="
              display:block;
              margin-top:8px;
              text-align:center;
              color:red;
              font-weight:bold;
              text-decoration:none;
            ">
              📞 Call 112
            </a>
            
            <button 
              id="navigate-${policeLat}-${policeLng}"
              style="
                background:#F97316;
                color:white;
                border:none;
                padding:6px 12px;
                border-radius:20px;
                margin-top:6px;
                cursor:pointer;
                width:100%;
              "
            >
              Navigate Here
            </button>
            
          </div>
        `);

        marker.on("popupopen", () => {
          const btn = document.getElementById(
            `navigate-${policeLat}-${policeLng}`
          );

          if (btn) {
            btn.onclick = () => {
              showRoute(userLat, userLng, policeLat, policeLng);
              speak("Navigation started to " + name);
            };
          }
        });

        markersRef.current.push(marker);
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Overpass API temporarily unavailable.");
      setLoading(false);
    }
  };

  const showRoute = (userLat, userLng, destLat, destLng) => {
    if (routeRef.current) {
      mapRef.current.removeControl(routeRef.current);
    }

    routeRef.current = L.Routing.control({
      waypoints: [
        L.latLng(userLat, userLng),
        L.latLng(destLat, destLng),
      ],
      routeWhileDragging: false,
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      createMarker: () => null,
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
      }),
    }).addTo(mapRef.current);

    routeRef.current.on("routesfound", function (e) {
      const routes = e.routes;
      const summary = routes[0].summary;
      const distance = (summary.totalDistance / 1000).toFixed(2);
      const time = (summary.totalTime / 60).toFixed(0);

      speak(
        `Route ready. Distance is ${distance} kilometers. Estimated time ${time} minutes.`
      );
    });
  };

  const showError = () => {
    setLoading(false);
    alert("Location access denied.");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[#fff5f8]"
    >
      <Navbar />

      <section className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto px-6 py-16 gap-12">
        <div className="max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-[#faede3] px-4 py-2 rounded-full mb-3">
  
          <ShinyText
          text="🚓 Find Police Stations Near You"
          className="text-sm font-semibold"
          speed={4}
          delay={0}
          color="#F97316"
          shineColor="#ffffff"
          spread={120}
          pauseOnHover={false}
          />
        

        </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-6">
           Nearby{" "}
           <span className="text-[#F97316] audiowide block mt-4 mb-4">
           Police Help
          </span>
           Anytime You Need
           </h1>

          <p className="text-gray-600 mb-8">
            Allow location access to find nearby police stations for quick assistance and safety.
          </p>

          <button
            onClick={() => {
              getLocation();
              mapSectionRef.current?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            className="bg-[#F97316] text-white px-6 py-3 font-semibold rounded-full hover:scale-105 transition"
          >
            Find Nearby Police ➜
          </button>
        </div>

        <div className="hidden md:block">
          <img src={policeImg} alt="Police Image" className="w-130 drop-shadow-2xl" />
        </div>
      </section>

      <section
        ref={mapSectionRef}
        className="max-w-6xl mx-auto px-6 pt-24 pb-20 relative"
      >
        <h2 className="text-4xl font-bold text-[#F97316] mb-6 text-center flex items-center justify-center gap-3">
  <Shield size={40} className="text-[#F97316]" />
  Police Stations Near You
</h2>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10 rounded-xl">
            <div className="w-12 h-12 border-4 border-[#F97316] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <div id="map" className="w-full h-96 rounded-xl"></div>
      </section>
      <GroqChatbot />
      <Footer />
    </motion.div>
  );
}

export default Police;