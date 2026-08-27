import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import VolunteerSidebar from "../../components/volunteer/VolunteerSidebar";

function VolunteerHospital() {
  const mapRef = useRef(null);
  const routeRef = useRef(null);
  const markersRef = useRef([]);
  const mapSectionRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const userIcon = new L.Icon({
    iconUrl:"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    shadowUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize:[25,41], iconAnchor:[12,41]
  });

  const hospitalIcon = new L.Icon({
    iconUrl:"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize:[25,41], iconAnchor:[12,41]
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

  const speak=(t)=>{
    const u=new SpeechSynthesisUtterance(t);
    u.lang="en-IN";
    speechSynthesis.speak(u);
  };

  const getDistance=(a,b,c,d)=>{
    const R=6371;
    const dLat=(c-a)*Math.PI/180;
    const dLon=(d-b)*Math.PI/180;
    const x=Math.sin(dLat/2)**2+Math.cos(a*Math.PI/180)*Math.cos(c*Math.PI/180)*Math.sin(dLon/2)**2;
    return R*(2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x)));
  };

  const getLocation=()=>{
    if(!navigator.geolocation) return alert("Geolocation not supported");
    setLoading(true);
    navigator.geolocation.getCurrentPosition(showMap,()=>{setLoading(false);alert("Location denied");});
  };

  const showMap=(pos)=>{
    const lat=pos.coords.latitude,lng=pos.coords.longitude;
    mapRef.current.setView([lat,lng],14);
    markersRef.current.forEach(m=>mapRef.current.removeLayer(m));
    markersRef.current=[];
    if(routeRef.current) mapRef.current.removeControl(routeRef.current);

    const me=L.marker([lat,lng],{icon:userIcon}).addTo(mapRef.current).bindPopup("📍 You are here").openPopup();
    markersRef.current.push(me);
    getHospitals(lat,lng);
  };

  const getHospitals=async(userLat,userLng)=>{
    const query=`[out:json];
node[amenity=hospital](around:7000,${userLat},${userLng});
out;`;
    try{
      const res=await fetch("https://overpass-api.de/api/interpreter?data="+encodeURIComponent(query));
      const data=await res.json();
      if(!data.elements?.length){setLoading(false);return alert("No hospitals found nearby.");}
      const hospitals=data.elements.map(h=>({
        lat:h.lat,
        lng:h.lon,
        name:h.tags?.name||"Hospital",
        distance:getDistance(userLat,userLng,h.lat,h.lon)
      })).sort((a,b)=>a.distance-b.distance);

      showRoute(userLat,userLng,hospitals[0].lat,hospitals[0].lng);

      hospitals.slice(0,5).forEach((h,i)=>{
        const marker=L.marker([h.lat,h.lng],{icon:hospitalIcon}).addTo(mapRef.current);
        marker.bindPopup(`
        <div style="font-family:Poppins;padding:10px;width:220px">
        <h3 style="color:#DC2626">${h.name}</h3>
        <p>Distance: ${h.distance.toFixed(2)} km</p>
        ${i===0?"<p style='color:red;font-weight:bold'>🚑 Nearest Hospital</p>":""}
        <a href="tel:108" style="display:block;margin:8px 0;color:red;font-weight:bold;text-decoration:none">📞 Call Ambulance (108)</a>
        <button id="nav-${h.lat}-${h.lng}" style="width:100%;background:#DC2626;color:#fff;border:none;padding:8px;border-radius:20px;cursor:pointer">Navigate Here</button>
        </div>`);
        marker.on("popupopen",()=>{
          document.getElementById(`nav-${h.lat}-${h.lng}`).onclick=()=>{
            showRoute(userLat,userLng,h.lat,h.lng);
            speak("Navigation started to "+h.name);
          };
        });
        markersRef.current.push(marker);
      });
    }catch(e){
      alert("Unable to fetch hospitals.");
    }
    setLoading(false);
  };

  const showRoute=(a,b,c,d)=>{
    if(routeRef.current) mapRef.current.removeControl(routeRef.current);
    routeRef.current=L.Routing.control({
      waypoints:[L.latLng(a,b),L.latLng(c,d)],
      routeWhileDragging:false,
      addWaypoints:false,
      draggableWaypoints:false,
      show:false,
      createMarker:()=>null,
      router:L.Routing.osrmv1({serviceUrl:"https://router.project-osrm.org/route/v1"})
    }).addTo(mapRef.current);

    routeRef.current.on("routesfound",e=>{
      const s=e.routes[0].summary;
      speak(`Route ready. Distance ${(s.totalDistance/1000).toFixed(1)} kilometers. Estimated time ${(s.totalTime/60).toFixed(0)} minutes.`);
    });
  };

  return (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="min-h-screen bg-red-50"
  >
    <div className="flex">
      {/* Sidebar */}
      <VolunteerSidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <section
          ref={mapSectionRef}
          className="max-w-7xl mx-auto px-6 py-8 relative"
        >
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Nearby Hospitals
            </h1>

            <p className="text-gray-600 mt-2">
              The nearest hospitals are detected automatically based on your
              current location.
            </p>
          </div>

          {loading && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 rounded-xl">
              <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
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

export default VolunteerHospital;
