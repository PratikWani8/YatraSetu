import { useState, useRef } from "react"
import { Send, Mic } from "lucide-react"
import { BASE_URL } from "../api/api"
import botAvatar from "../assets/raksha_ai_pfp02.jpg";

function Chatbot(){

const [open,setOpen] = useState(false)

const [messages,setMessages] = useState([
{sender:"bot",text:"Hello! I am Raksha Your Personal Smart Safety Companion."}
])

const [input,setInput] = useState("")

const username = localStorage.getItem("username")

// SAFETY TIPS
const tips = [
"Always share your live location with a trusted contact when traveling late.",
"Keep your phone in your hand in isolated areas.",
"Move to crowded places if you feel unsafe.",
"Trust your instincts.",
"Use Raksha AI to avoid dangerous areas."
]

// SPEECH
const speak = (text)=>{
const u = new SpeechSynthesisUtterance(text)
speechSynthesis.speak(u)
}

const addMessage = (text,sender="bot")=>{
setMessages(prev=>[...prev,{sender,text}])
if(sender==="bot") speak(text)
}

// VOICE INPUT
const startVoiceInput = ()=>{

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()

recognition.lang = "en-IN"

recognition.start()

recognition.onresult = (event)=>{

const text = event.results[0][0].transcript

setInput(text)

sendMessage(text)

}

recognition.onerror = ()=>{
addMessage("❌ Voice recognition failed")
}

}

// SOS
const handleSOS = ()=>{

addMessage("🚨 Initiating Emergency Protocol...")

if(navigator.geolocation){

navigator.geolocation.getCurrentPosition(async(pos)=>{

const lat = pos.coords.latitude
const lng = pos.coords.longitude

try{

const geo = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
const geoData = await geo.json()

const place = geoData.display_name

const username = localStorage.getItem("username") || "Chatbot User"

await fetch(
  `${BASE_URL}/api/sos/start`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      location: place,
      latitude: lat,
      longitude: lng,
      message: "SOS triggered via Raksha AI",
    }),
  }
);

addMessage("✅ SOS alert sent!")

}catch(err){

console.error(err)
addMessage("❌ Unable to contact server")

}

})

}

}

// FIND NEARBY POLICE
const findNearbyPolice = () => {

addMessage("📍 Finding nearby police stations within 10 km...")

navigator.geolocation.getCurrentPosition(async(pos)=>{

const lat = pos.coords.latitude
const lng = pos.coords.longitude

const query = `
[out:json];
node["amenity"="police"](around:10000,${lat},${lng});
out;
`

const res = await fetch("https://overpass-api.de/api/interpreter",{
method:"POST",
body:query
})

const data = await res.json()

if(!data.elements.length){
addMessage("❌ No police stations found nearby")
return
}

// distance function
const getDistance = (lat1, lon1, lat2, lon2)=>{

const R = 6371
const dLat = (lat2-lat1) * Math.PI/180
const dLon = (lon2-lon1) * Math.PI/180

const a =
Math.sin(dLat/2)*Math.sin(dLat/2) +
Math.cos(lat1*Math.PI/180) *
Math.cos(lat2*Math.PI/180) *
Math.sin(dLon/2)*Math.sin(dLon/2)

return R * 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a))
}

// sort by distance
const stations = data.elements.map(p=>({
name: p.tags?.name || "Police Station",
lat: p.lat,
lon: p.lon,
distance: getDistance(lat,lng,p.lat,p.lon)
})).sort((a,b)=>a.distance-b.distance)

let message = "🚔 Nearest Police Stations:\n"

stations.slice(0,3).forEach((s,i)=>{
message += `${i+1}. ${s.name} (${s.distance.toFixed(2)} km)\n`
})

addMessage(message)

const nearest = stations[0]

const url = `https://www.google.com/maps/dir/?api=1&destination=${nearest.lat},${nearest.lon}`

window.open(url,"_blank")

})
}

const findSafePlaces = ()=>{

addMessage("📍 Finding nearby safe places...")

navigator.geolocation.getCurrentPosition(async(pos)=>{

const lat = pos.coords.latitude
const lng = pos.coords.longitude

const query = `
[out:json];
(
node["amenity"="police"](around:10000,${lat},${lng});
node["amenity"="hospital"](around:10000,${lat},${lng});
node["amenity"="cafe"](around:10000,${lat},${lng});
);
out;
`

const res = await fetch("https://overpass-api.de/api/interpreter",{
method:"POST",
body:query
})

const data = await res.json()

if(!data.elements.length){
addMessage("❌ No safe places nearby")
return
}

const getDistance = (lat1, lon1, lat2, lon2)=>{

const R = 6371
const dLat = (lat2-lat1) * Math.PI/180
const dLon = (lon2-lon1) * Math.PI/180

const a =
Math.sin(dLat/2)*Math.sin(dLat/2) +
Math.cos(lat1*Math.PI/180) *
Math.cos(lat2*Math.PI/180) *
Math.sin(dLon/2)*Math.sin(dLon/2)

return R * 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a))
}

const places = data.elements.map(p=>({

name: p.tags?.name || p.tags?.amenity,
type: p.tags?.amenity,
lat: p.lat,
lon: p.lon,
distance: getDistance(lat,lng,p.lat,p.lon)

})).sort((a,b)=>a.distance-b.distance)

let message = "🛡️ Nearby Safe Places:\n"

places.slice(0,5).forEach((p,i)=>{
message += `${i+1}. ${p.name} (${p.type}) - ${p.distance.toFixed(2)} km\n`
})

addMessage(message)

const nearest = places[0]

const url = `https://www.google.com/maps/dir/?api=1&destination=${nearest.lat},${nearest.lon}`

window.open(url,"_blank")

})
}

// EMOTION DETECTION
const detectDangerEmotion = (text)=>{

const words=["scared","unsafe","fear","help","follow","danger","panic"]

return words.some(w=>text.includes(w))

}

// SIREN SETUP
const sirenRef = useRef(null)
const sirenTimeoutRef = useRef(null)

if (!sirenRef.current) {
  sirenRef.current = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg")
  sirenRef.current.loop = true
}

// START SIREN
const startSiren = () => {

  const siren = sirenRef.current

  siren.play().catch(() => {
    console.log("Audio needs user interaction first")
  })

  if (navigator.vibrate) {
    navigator.vibrate([500, 300, 500])
  }

  addMessage("🚨 Siren activated! Type 'stop' to stop the alarm.")

  // AUTO STOP AFTER 30 SECONDS
  sirenTimeoutRef.current = setTimeout(() => {
    stopSiren()
  }, 30000)
}


// STOP SIREN
const stopSiren = () => {

  const siren = sirenRef.current

  siren.pause()
  siren.currentTime = 0

  if (navigator.vibrate) {
    navigator.vibrate(0)
  }

  if (sirenTimeoutRef.current) {
    clearTimeout(sirenTimeoutRef.current)
    sirenTimeoutRef.current = null
  }

  addMessage("✅ Siren stopped.")
}

// SEND MESSAGE
const sendMessage = (voiceText=null)=>{

const text=(voiceText || input).toLowerCase().trim()

if(!text) return

addMessage(text,"user")

setInput("")

setTimeout(()=>{

if(text.includes("police")){
findNearbyPolice()
}

else if(text.includes("sos") || text.includes("help")){
handleSOS()
}

else if(text.includes("tip")){
const t=tips[Math.floor(Math.random()*tips.length)]
addMessage("Tip: "+t)
}

else if(text.includes("safe")){
findSafePlaces()
}

else if(text.includes("siren") || text.includes("alarm") || text.includes("danger")){
startSiren()
}

else if(text === "stop" || text.includes("stop alarm") || text.includes("stop siren")){
stopSiren()
}

else if(detectDangerEmotion(text)){
addMessage("⚠️ You seem unsafe. Should I send SOS or find safe places nearby?")
}

else{
addMessage("Try typing: SOS, Police, Safe place, Tip, Siren")
}

},500)

}

return(

<>

<button
  onClick={() => setOpen(!open)}
  className="fixed bottom-8 right-8 w-16 h-16 rounded-full hover:scale-110 transition flex items-center justify-center"
>
  <div className="relative w-14 h-14 flex items-center justify-center">

    <span className="absolute w-full h-full rounded-full bg-blue-500 opacity-20 animate-ping [animation-delay:0.5s]"></span>
    
    <img src={botAvatar} alt="chatbot"
      className="relative w-full h-full rounded-full object-cover border-2 border-white z-10" />

    <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full z-20"></span>

  </div>
</button>

{/* CHAT WINDOW */}
{open && (

<div className="fixed bottom-24 right-5 w-80 h-115 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">

<div className="bg-[#e91e63] text-white p-3 font-semibold">

Raksha AI

</div>

<div className="flex-1 p-3 overflow-y-auto bg-[#fdf2f5] flex flex-col gap-2">

{messages.map((msg,i)=>(

<div
key={i}
className={`px-3 py-2 rounded-lg max-w-[80%] text-sm ${
msg.sender==="bot"
? "bg-white border"
: "bg-[#e91e63] text-white self-end"
}`}
>

{msg.text}

</div>

))}

</div>

<div className="flex items-center gap-2 p-2 border-t">

<input
value={input}
onChange={(e)=>setInput(e.target.value)}
placeholder="Type here..."
className="flex-1 border rounded-full px-4 py-2 outline-none"
onKeyDown={(e)=> e.key==="Enter" && sendMessage()}
/>

<button
onClick={startVoiceInput}
className="w-10 h-10 flex items-center justify-center border rounded-full"
>

<Mic size={18}/>

</button>

<button
onClick={()=>sendMessage()}
className="w-10 h-10 flex items-center justify-center bg-[#e91e63] text-white rounded-full"
>

<Send size={18}/>

</button>

</div>

</div>

)}

</>

)

}

export default Chatbot