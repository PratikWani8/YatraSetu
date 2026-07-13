import { useEffect, useState } from "react";
import axios from "axios";
import {
  Thermometer,
  Droplets,
  Wind,
  MapPin,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";

export default function WeatherCard() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("Current Location");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;

        try {
          // Weather Data
          const weatherRes = await axios.get(
            "https://api.open-meteo.com/v1/forecast",
            {
              params: {
                latitude,
                longitude,
                current:
                  "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code",
              },
            }
          );

          setWeather(weatherRes.data.current);

          // Reverse Geocoding
          const geoRes = await axios.get(
            "https://geocoding-api.open-meteo.com/v1/reverse",
            {
              params: {
                latitude,
                longitude,
              },
            }
          );

          if (geoRes.data.results?.length) {
            setCity(geoRes.data.results[0].name);
          }
        } catch (err) {
          console.error(err);
        }

        setLoading(false);
      },
      () => setLoading(false)
    );
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-lg">
        Loading weather...
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-lg">
        Unable to fetch weather.
      </div>
    );
  }

  const temp = weather.temperature_2m;
  const feels = weather.apparent_temperature;
  const humidity = weather.relative_humidity_2m;
  const wind = weather.wind_speed_10m;
  const code = weather.weather_code;

  let bg = "from-green-500 to-green-700";
  let risk = "Safe";

  if (feels >= 45) {
    bg = "from-red-600 to-red-800";
    risk = "Extreme Heat";
  } else if (feels >= 38) {
    bg = "from-orange-500 to-red-500";
    risk = "High Risk";
  } else if (feels >= 32) {
    bg = "from-yellow-400 to-orange-500";
    risk = "Moderate";
  }

  let WeatherIcon = Sun;
  let weatherText = "Clear Sky";

  if ([1, 2, 3].includes(code)) {
    WeatherIcon = Cloud;
    weatherText = "Cloudy";
  } else if (
    [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)
  ) {
    WeatherIcon = CloudRain;
    weatherText = "Rain";
  } else if ([71, 73, 75, 77].includes(code)) {
    WeatherIcon = CloudSnow;
    weatherText = "Snow";
  } else if ([95, 96, 99].includes(code)) {
    WeatherIcon = CloudLightning;
    weatherText = "Thunderstorm";
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br ${bg} text-white`}
    >
      <div className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">
              Today's Weather
            </h2>

            <div className="flex items-center gap-2 mt-2">
              <MapPin size={18} />
              <span>{city}</span>
            </div>
          </div>

          <WeatherIcon size={60} />
        </div>

        <div className="mt-4">
          <h1 className="text-5xl font-bold">
            {Math.round(temp)}°C
          </h1>

          <p className="mt-2 text-lg">
            {weatherText}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-8">
          <div className="bg-white/20 rounded-xl p-4">
            <Thermometer size={26} />
            <p className="text-sm mt-2">Feels Like</p>
            <h3 className="font-bold text-xl">
              {Math.round(feels)}°
            </h3>
          </div>

          <div className="bg-white/20 rounded-xl p-4">
            <Droplets size={26} />
            <p className="text-sm mt-2">Humidity</p>
            <h3 className="font-bold text-xl">
              {humidity}%
            </h3>
          </div>

          <div className="bg-white/20 rounded-xl p-4">
            <Wind size={26} />
            <p className="text-sm mt-2">Wind</p>
            <h3 className="font-bold text-xl">
              {wind} km/h
            </h3>
          </div>

        <div className="mt-8 bg-white/20 rounded-2xl p-5">
          <div className="flex items-center gap-2">
            <AlertTriangle />
            <h3 className="font-semibold">
              Heat Index
            </h3>
          </div>

          <h2 className="text-3xl font-bold mt-3">
            {Math.round(feels)}°C
          </h2>

          <p className="mt-2">
            {risk}
          </p>
        </div>
        </div>

        <div className="mt-6 bg-white/15 rounded-xl p-4">
          {feels >= 45 && (
            <p>🚨 Extreme heat! Stay indoors and hydrate frequently.</p>
          )}

          {feels >= 38 && feels < 45 && (
            <p>🥤 Drink water every 20 minutes.</p>
          )}

          {feels >= 32 && feels < 38 && (
            <p>🧢 Wear a cap and avoid direct sunlight.</p>
          )}

          {feels < 32 && (
            <p>✅ Weather conditions are comfortable for travel.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}