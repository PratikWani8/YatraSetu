import { useState } from "react"
import { Mic, Send } from "lucide-react"
import botAvatar from "../assets/raksha_ai_pfp02.jpg";

const GroqChatbot = () => {

  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋 I am Raksha AI. How can I help you?" }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  // SPEAK FUNCTION 
  const speak = (text) => {
  const utterance = new SpeechSynthesisUtterance(text)

  // Detect language using Unicode ranges
  if (/[\u0980-\u09FF]/.test(text)) {
  utterance.lang = "bn-IN" // Bengali 
}
else if (/[\u0A80-\u0AFF]/.test(text)) {
  utterance.lang = "gu-IN" // Gujarati
}
else if (/[\u0A00-\u0A7F]/.test(text)) {
  utterance.lang = "pa-IN" // Punjabi
}
else if (/[\u0B00-\u0B7F]/.test(text)) {
  utterance.lang = "or-IN" // Odia
}
else if (/[\u0C00-\u0C7F]/.test(text)) {
  utterance.lang = "te-IN" // Telugu
}
else if (/[\u0C80-\u0CFF]/.test(text)) {
  utterance.lang = "kn-IN" // Kannada
}
else if (/[\u0D00-\u0D7F]/.test(text)) {
  utterance.lang = "ml-IN" // Malayalam
}
else if (/[\u0B80-\u0BFF]/.test(text)) {
  utterance.lang = "ta-IN" // Tamil
}
else if (/[\u0900-\u097F]/.test(text)) {
  utterance.lang = "hi-IN" // Hindi + Marathi 
}
else if (/[\u0600-\u06FF]/.test(text)) {
  utterance.lang = "ur-IN" // Urdu
}
else {
  utterance.lang = "en-IN"
}

 utterance.rate = 0.95  
  utterance.pitch = 1.15  

  const voices = speechSynthesis.getVoices()

  const preferredVoices = [
    "Google हिन्दी",
    "Google Indian English",
    "Microsoft Heera",
    "Microsoft Swara",
    "Microsoft Zira"
  ]

  let selectedVoice = voices.find(v =>
    preferredVoices.includes(v.name)
  )

  if (!selectedVoice) {
    selectedVoice = voices.find(v =>
      v.lang.toLowerCase().includes(utterance.lang.toLowerCase())
    )
  }

  if (!selectedVoice) {
    selectedVoice = voices.find(v =>
      v.name.toLowerCase().includes("female") ||
      v.name.toLowerCase().includes("zira") ||
      v.name.toLowerCase().includes("samantha")
    )
  }

  if (!selectedVoice) selectedVoice = voices[0]

  utterance.voice = selectedVoice

  speechSynthesis.cancel()
  speechSynthesis.speak(utterance)
}

  const startVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()

    recognition.lang = "hi-IN"
    recognition.continuous = true
    recognition.interimResults = false

    recognition.start()

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript
      setInput(transcript)

      setTimeout(() => {
        sendMessageFromVoice(transcript)
      }, 500)
    }

    recognition.onerror = (err) => {
      console.error(err)
    }
  }

  const sendMessageFromVoice = async (voiceText) => {
    if (!voiceText.trim() || loading) return

    const userMsg = { sender: "user", text: voiceText }
    setMessages((prev) => [...prev, userMsg])

    setLoading(true)

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              {
                role: "system",
                content: `
You are Raksha AI — a women safety assistant.

Language Rules:
- Detect user's language automatically
- Supported: English, Hindi, Marathi, Tamil, Telugu, Kannada, Malayalam, Bengali, Gujarati, Punjabi, Odia, Urdu
- Reply in SAME language as user
- Keep response short, clear, and practical

IMPORTANT INDIAN HELPLINES:
-  Police: 100
-  Emergency: 112
-  Women Helpline: 1091
-  Domestic Violence: 181
-  Ambulance: 102
-  Child Helpline: 1098

Behavior:
- Always suggest calling 112 in serious danger
- Stay calm, supportive, and direct
- Prioritize safety over explanation
`
              },
              {
                role: "user",
                content: voiceText
              }
            ]
          })
        }
      )

      const data = await response.json()

      if (!response.ok) throw new Error(data.error?.message)

      const botReply = data.choices[0].message.content

      const botMsg = { sender: "bot", text: botReply }

      speak(botReply)

      setMessages((prev) => [...prev, botMsg])

    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMsg = { sender: "user", text: input }
    setMessages((prev) => [...prev, userMsg])

    const userInput = input
    setInput("")
    setLoading(true)

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              {
                role: "system",
                content: "You are Raksha AI, a women safety assistant. Give short emergency-focused answers."
              },
              {
                role: "user",
                content: userInput
              }
            ]
          })
        }
      )

      const data = await response.json()

      if (!response.ok) throw new Error(data.error?.message)

      const botReply = data.choices[0].message.content

      const botMsg = { sender: "bot", text: botReply }

      speak(botReply)

      setMessages((prev) => [...prev, botMsg])

    } catch (error) {
      console.error(error)

      const fallback = {
        sender: "bot",
        text: "⚠️ Connection issue. Call 112 if in danger."
      }

      setMessages((prev) => [...prev, fallback])
    } finally {
      setLoading(false)
    }
  }

  return (
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

      {open && (
        <div className="fixed bottom-24 right-5 w-80 h-115 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">

          <div className="bg-[#e91e63] text-white p-3 font-semibold">
            Raksha AI
          </div>

          <div className="flex-1 p-3 overflow-y-auto bg-[#fdf2f5] flex flex-col gap-2">

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`px-3 py-2 rounded-lg max-w-[80%] text-sm ${
                  msg.sender === "bot"
                    ? "bg-white border"
                    : "bg-[#e91e63] text-white self-end"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="text-xs text-gray-400">Raksha AI is typing...</div>
            )}

          </div>

          <div className="flex items-center gap-2 p-2 border-t">

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type here..."
              className="flex-1 border rounded-full px-4 py-2 outline-none"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button
              onClick={startVoiceInput}
              className="w-10 h-10 flex items-center justify-center border rounded-full"
            >
              <Mic size={18} />
            </button>

            <button
              onClick={sendMessage}
              className="w-10 h-10 flex items-center justify-center bg-[#e91e63] text-white rounded-full"
            >
              <Send size={18} />
            </button>

          </div>

        </div>
      )}
    </>
  )
}

export default GroqChatbot