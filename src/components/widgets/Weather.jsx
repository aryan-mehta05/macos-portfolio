import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import dayjs from "dayjs";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Wind,
  Loader2,
} from "lucide-react";
import ArrowTopRight from "./ArrowTopRight";

function pickWeatherVisual(code) {
  // Open-Meteo weathercode mapping (condensed for widget use)
  // https://open-meteo.com/en/docs
  if (code === 0) return { label: "Clear", Icon: Sun };
  if ([1, 2].includes(code)) return { label: "Mostly clear", Icon: Sun };
  if (code === 3) return { label: "Cloudy", Icon: Cloud };
  if ([45, 48].includes(code)) return { label: "Fog", Icon: CloudFog };
  if ([51, 53, 55, 56, 57].includes(code)) return { label: "Drizzle", Icon: CloudRain };
  if ([61, 63, 65, 66, 67].includes(code)) return { label: "Rain", Icon: CloudRain };
  if ([71, 73, 75, 77].includes(code)) return { label: "Snow", Icon: CloudSnow };
  if ([80, 81, 82].includes(code)) return { label: "Showers", Icon: CloudRain };
  if ([85, 86].includes(code)) return { label: "Snow showers", Icon: CloudSnow };
  if ([95, 96, 99].includes(code)) return { label: "Thunder", Icon: CloudLightning };
  return { label: "Windy", Icon: Wind };
};

async function getCoordsFromBrowser() {
  if (!("geolocation" in navigator)) return null;

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        }),
      () => resolve(null),
      { enableHighAccuracy: false, timeout: 7000, maximumAge: 10 * 60 * 1000 }
    );
  });
};

async function reverseGeocode(lat, lon) {
  const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Reverse geocode failed");
  const data = await res.json();

  return (
    data.city ||
    data.locality ||
    data.principalSubdivision ||
    data.countryName ||
    "Local"
  );
}

async function fetchWeatherOpenMeteo(lat, lon) {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,weather_code,wind_speed_10m` +
    `&daily=temperature_2m_max,temperature_2m_min` +
    `&temperature_unit=celsius` +
    `&wind_speed_unit=mph` +
    `&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Weather fetch failed");
  return res.json();
};

const Weather = ({
  className,
  defaultCoords = { lat: 42.3601, lon: -71.0589 },
}) => {
  const [coords, setCoords] = useState(null);
  const [place, setPlace] = useState("");
  const [wx, setWx] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setStatus("loading");

        const browserCoords = await getCoordsFromBrowser();
        const finalCoords = browserCoords ?? defaultCoords;

        if (cancelled) return;
        setCoords(finalCoords);

        const [placeName, weather] = await Promise.all([
          reverseGeocode(finalCoords.lat, finalCoords.lon).catch(() => "Local"),
          fetchWeatherOpenMeteo(finalCoords.lat, finalCoords.lon),
        ]);

        if (cancelled) return;
        setPlace(placeName);
        setWx(weather);
        setStatus("ready");
      } catch (e) {
        if (cancelled) return;
        setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [defaultCoords.lat, defaultCoords.lon]);

  const view = useMemo(() => {
    if (!wx?.current) return null;

    const temp = Math.round(wx.current.temperature_2m);
    const code = wx.current.weather_code;
    const wind = Math.round(wx.current.wind_speed_10m);

    const hi = Math.round(wx.daily?.temperature_2m_max?.[0] ?? temp);
    const lo = Math.round(wx.daily?.temperature_2m_min?.[0] ?? temp);

    const { label, Icon } = pickWeatherVisual(code);

    return { temp, hi, lo, wind, label, Icon };
  }, [wx]);

  return (
    <div
      className={clsx(
        "w-42 h-42",
        "rounded-[22px] p-3 overflow-hidden",
        "bg-white/65 dark:bg-zinc-900/55",
        "backdrop-blur-xl",
        "border border-white/35 dark:border-white/10",
        "shadow-[0_18px_40px_rgba(0,0,0,0.18)]",
        "ring-1 ring-white/25 dark:ring-white/5",
        className
      )}
      aria-label="Weather widget"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex leading-none">
          <span className="mr-0.5 text-[12px] font-semibold text-zinc-900/90 dark:text-white/90">
            {place || " "}
          </span>
          <ArrowTopRight />
        </div>

        {/* tiny timestamp like system widgets */}
        <span className="text-[10px] font-semibold text-zinc-700/45 dark:text-white/35">
          {dayjs().format("h:mm")}
        </span>
      </div>

      {/* Body */}
      <div className="mt-1">
        {status === "loading" && (
          <div className="flex h-27.5 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-zinc-900/40 dark:text-white/35" />
          </div>
        )}

        {status === "error" && (
          <div className="flex h-27.5 flex-col items-center justify-center text-center">
            <Cloud className="h-6 w-6 text-zinc-900/35 dark:text-white/30" />
            <div className="mt-2 text-[11px] font-semibold text-zinc-900/60 dark:text-white/55">
              Couldn’t load
            </div>
            <div className="mt-1 text-[10px] font-medium text-zinc-700/50 dark:text-white/40">
              Check location / network
            </div>
          </div>
        )}

        {status === "ready" && view && (
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="text-[40px] leading-none font-extralight tracking-tight text-zinc-900/90 dark:text-white/90">
                {view.temp}°
              </div>

              <div className="mt-5 text-[11px] font-semibold text-zinc-900/90 dark:text-white/90">
                <view.Icon className="h-4 w-4" />
                {view.label}
              </div>
              <div className="lex items-center text-[11px] font-semibold text-zinc-700/55 dark:text-white/45">
                <span className="mr-1">H:{view.hi}°</span>
                <span>L:{view.lo}°</span>
              </div>

              <div className="text-[10px] font-semibold text-zinc-700/45 dark:text-white/35">
                Wind {view.wind} mph
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
