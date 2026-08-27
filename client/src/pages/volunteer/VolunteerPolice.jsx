import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import VolunteerSidebar from "../../components/volunteer/VolunteerSidebar";

function VolunteerPolice() {
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
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    shadowUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map("map").setView([20.5937, 78.9629], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    mapRef.current = map;

    getLocation();
  }, []);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    speechSynthesis.speak(utterance);
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

  const getLocation = () => {
    if (!navigator.geolocation)
      return alert("Geolocation is not supported.");

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      showMap,
      () => {
        setLoading(false);
        alert("Location permission denied.");
      },
      {
        enableHighAccuracy: true,
      }
    );
  };

  const showMap = (position) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    mapRef.current.setView([lat, lng], 14);

    markersRef.current.forEach((marker) => mapRef.current.removeLayer(marker));
    markersRef.current = [];

    if (routeRef.current) {
      mapRef.current.removeControl(routeRef.current);
    }

    const me = L.marker([lat, lng], {
      icon: userIcon,
    })
      .addTo(mapRef.current)
      .bindPopup("📍 Your Current Location")
      .openPopup();

    markersRef.current.push(me);

    getPoliceStations(lat, lng);
  };

  const getPoliceStations = async (userLat, userLng) => {
    const query = `
[out:json];
node["amenity"="police"](around:7000,${userLat},${userLng});
out;
`;

    try {
      const res = await fetch(
        "https://overpass-api.de/api/interpreter?data=" +
          encodeURIComponent(query)
      );

      const data = await res.json();

      if (!data.elements?.length) {
        setLoading(false);
        return alert("No nearby police stations found.");
      }

      const stations = data.elements
        .map((station) => ({
          lat: station.lat,
          lng: station.lon,
          name: station.tags?.name || "Police Station",
          distance: getDistance(
            userLat,
            userLng,
            station.lat,
            station.lon
          ),
        }))
        .sort((a, b) => a.distance - b.distance);

      showRoute(
        userLat,
        userLng,
        stations[0].lat,
        stations[0].lng
      );

      stations.slice(0, 5).forEach((station, index) => {
        const marker = L.marker([station.lat, station.lng], {
          icon: policeIcon,
        }).addTo(mapRef.current);

        marker.bindPopup(`
          <div style="font-family:Poppins;padding:10px;width:230px">
          
          <h3 style="color:#2563EB">
            ${station.name}
          </h3>

          <p>
            Distance : ${station.distance.toFixed(2)} km
          </p>

          ${
            index === 0
              ? "<p style='color:#2563EB;font-weight:bold'>🚔 Nearest Police Station</p>"
              : ""
          }

          <a
            href="tel:112"
            style="display:block;margin:8px 0;color:#2563EB;font-weight:bold;text-decoration:none"
          >
            📞 Call Police (112)
          </a>

          <button
            id="nav-${station.lat}-${station.lng}"
            style="
              width:100%;
              background:#2563EB;
              color:white;
              border:none;
              padding:8px;
              border-radius:20px;
              cursor:pointer;
            "
          >
            Navigate Here
          </button>

          </div>
        `);

        marker.on("popupopen", () => {
          document.getElementById(
            `nav-${station.lat}-${station.lng}`
          ).onclick = () => {
            showRoute(
              userLat,
              userLng,
              station.lat,
              station.lng
            );

            speak(
              "Navigation started to " + station.name
            );
          };
        });

        markersRef.current.push(marker);
      });
    } catch (err) {
      alert("Unable to fetch nearby police stations.");
    }

    setLoading(false);
  };

  const showRoute = (startLat, startLng, endLat, endLng) => {
    if (routeRef.current) {
      mapRef.current.removeControl(routeRef.current);
    }

    routeRef.current = L.Routing.control({
      waypoints: [
        L.latLng(startLat, startLng),
        L.latLng(endLat, endLng),
      ],
      routeWhileDragging: false,
      draggableWaypoints: false,
      addWaypoints: false,
      show: false,
      createMarker: () => null,
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
      }),
    }).addTo(mapRef.current);

    routeRef.current.on("routesfound", (e) => {
      const summary = e.routes[0].summary;

      speak(
        `Route ready. Distance ${(summary.totalDistance / 1000).toFixed(
          1
        )} kilometers. Estimated time ${(summary.totalTime / 60).toFixed(
          0
        )} minutes.`
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-blue-50"
    >
      <div className="flex">
        <VolunteerSidebar />

        <div className="flex-1 overflow-auto">
          <section
            ref={mapSectionRef}
            className="max-w-7xl mx-auto px-6 py-8 relative"
          >
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800">
                Nearby Police Stations
              </h1>

              <p className="text-gray-600 mt-2">
                The nearest police stations are detected automatically based on
                your current location.
              </p>
            </div>

            {loading && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 rounded-xl">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            <div
              id="map"
              className="w-full h-[82vh] rounded-2xl shadow-xl border bg-white"
            />
          </section>
        </div>
      </div>
    </motion.div>
  );
}

export default VolunteerPolice;