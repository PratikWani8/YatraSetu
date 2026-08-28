import { useState,useRef } from "react"
import { motion } from "framer-motion"
import Swal from "sweetalert2"
import API from "../../api/api"

export default function SOS(){
const username = localStorage.getItem("username")
const [tracking,setTracking] = useState(false)
const sosIdRef = useRef(null)
const intervalRef = useRef(null)

/* GET LOCATION */
const getLocation = ()=>{
return new Promise((resolve,reject)=>{
navigator.geolocation.getCurrentPosition(

async(pos)=>{
const lat = pos.coords.latitude
const lon = pos.coords.longitude

const res = await fetch(
`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
)

const data = await res.json()

resolve({
location:data.display_name,
latitude:lat,
longitude:lon
})

},

()=>reject()
)
})
}

/* START SOS */
const startSOS = async () => {

  try {

    const loc = await getLocation();

    const res = await API.post(
      "/api/sos/start",
      {
        username,
        location: loc.location,
        latitude: loc.latitude,
        longitude: loc.longitude,
        message: "Help! I am in danger.",
      }
    );

    const data = res.data;

    if (data.success) {

      sosIdRef.current = data.sosId;

      setTracking(true);

      Swal.fire(
        "SOS Activated",
        "Live tracking started",
        "success"
      );

      startTracking();
    }

  } catch (err) {

    console.log("SOS error:", err);

    Swal.fire(
      "Error",
      "Location failed",
      "error"
    );
  }
};

/* START TRACKING */
const startTracking = () => {

  intervalRef.current = setInterval(async () => {

    try {

      const loc = await getLocation();

      await API.post(
        "/api/sos/update",
        {
          sosId: sosIdRef.current,
          location: loc.location,
          latitude: loc.latitude,
          longitude: loc.longitude,
        }
      );

    } catch (err) {

      console.log(
        "Tracking error:",
        err
      );

    }

  }, 5000);
};

/* STOP SOS */
const stopSOS = async () => {

  try {

    clearInterval(intervalRef.current);

    await API.post(
      "/api/sos/stop",
      {
        sosId: sosIdRef.current,
      }
    );

    setTracking(false);

    Swal.fire(
      "SOS Stopped",
      "Tracking cancelled",
      "info"
    );

  } catch (err) {

    console.log(
      "Stop SOS error:",
      err
    );

    Swal.fire(
      "Error",
      "Failed to stop SOS",
      "error"
    );
  }
};

return(

<div className="min-h-screen bg-[#fff5f8] flex flex-col items-center justify-center">

<motion.div
initial={{scale:0.8}}
animate={{scale:1}}
className="text-center bg-white p-8 rounded-2xl shadow-xl"
>

<h2 className="text-2xl font-bold text-[#e91e63]">
🚨 Emergency SOS
</h2>

<p className="text-gray-600 mt-2">
Location will update every 5 seconds
</p>

{!tracking ? (

<motion.button
whileHover={{scale:1.1}}
whileTap={{scale:0.9}}
onClick={startSOS}
className="mt-8 h-24 w-24 rounded-full bg-red-500 text-white text-lg font-bold shadow-lg animate-pulse"
>

SOS

</motion.button>

):(

<motion.button
whileHover={{scale:1.1}}
whileTap={{scale:0.9}}
onClick={stopSOS}
className="mt-8 h-24 w-24 rounded-full bg-gray-800 text-white text-lg font-bold shadow-lg"
>

STOP

</motion.button>

)}

<p className="text-sm text-gray-500 mt-4">
Tap the button or shake your phone
</p>

</motion.div>

<a href="/pilgrim/emergency">
<button className="mt-6 w-80 bg-gray-200 py-2 rounded-full hover:bg-gray-300 transition">

⬅ Back to Dashboard

</button>
</a>

</div>

)

}