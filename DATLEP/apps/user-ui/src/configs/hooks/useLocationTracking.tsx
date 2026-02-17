"use client";

import { useEffect, useState } from "react";

const LOCATION_STORAGE_KEY = "user_location";
const LOCATION_EXPIRY_DAYS = 20;

type LocationData = {
  country: string;
  city: string;
  timestamp: number;
};

const getStoredLocation = (): LocationData | null => {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(LOCATION_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<LocationData>;

    // ✅ if corrupted/partial, delete it
    if (!parsed.country || !parsed.city || !parsed.timestamp) {
      localStorage.removeItem(LOCATION_STORAGE_KEY);
      return null;
    }

    const expiryMs = LOCATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    const expired = Date.now() - parsed.timestamp > expiryMs;

    if (expired) {
      localStorage.removeItem(LOCATION_STORAGE_KEY);
      return null;
    }

    return parsed as LocationData;
  } catch {
    localStorage.removeItem(LOCATION_STORAGE_KEY);
    return null;
  }
};

export default function useLocationTracking() {
  const [location, setLocation] = useState<LocationData | null>(null);

  useEffect(() => {
    const stored = getStoredLocation();
    console.log("[LOC] storedLocation", stored);

    if (stored) {
      setLocation(stored);
      return;
    }

    console.log("[LOC] calling /api/geo/ip ...");

    fetch("/api/geo/ip", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        console.log("[LOC] /api/geo/ip response", data);

        if (!data?.ok) throw new Error(data?.error || "geo api failed");

        const next: LocationData = {
          country: data.country,
          city: data.city,
          timestamp: Date.now(),
        };

        localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(next));
        console.log("[LOC] saved", next);
        setLocation(next);
      })
      .catch((err) => {
        console.error("[LOC] Location fetch failed:", err);
      });
  }, []);

  return location;
}
