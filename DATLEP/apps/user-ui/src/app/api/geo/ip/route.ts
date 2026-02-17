import { NextResponse } from "next/server";
import { headers } from "next/headers";

function isPublicIp(ip: string) {
  // crude but effective checks for local/private/reserved ranges
  if (!ip) return false;

  const lower = ip.toLowerCase();

  // ipv6 loopback
  if (lower === "::1") return false;

  // ipv4 loopback
  if (ip.startsWith("127.")) return false;

  // private ranges
  if (ip.startsWith("10.")) return false;
  if (ip.startsWith("192.168.")) return false;
  if (ip.startsWith("172.")) {
    const second = Number(ip.split(".")[1]);
    if (second >= 16 && second <= 31) return false;
  }

  return true;
}

async function getClientIp() {
  const h = await headers();

  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();

  const xri = h.get("x-real-ip");
  if (xri) return xri.trim();

  return "";
}

export async function GET() {
  try {
    const ip = await getClientIp();
    console.log("[GEO] raw client ip:", ip || "(none)");

    // ✅ If IP is not public, don't call ip-api with it
    const useIp = isPublicIp(ip) ? ip : "";

    console.log("[GEO] using ip for lookup:", useIp || "(fallback)");

    const url = useIp
      ? `http://ip-api.com/json/${useIp}?fields=status,message,country,city`
      : `http://ip-api.com/json/?fields=status,message,country,city`;

    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();

    console.log("[GEO] ip-api response:", data);

    // ✅ If ip-api fails in dev, don't hard-fail the route
    if (data?.status !== "success") {
      return NextResponse.json({
        ok: true,
        country: null,
        city: null,
        note: data?.message || "lookup failed",
      });
    }

    return NextResponse.json({
      ok: true,
      country: data.country ?? null,
      city: data.city ?? null,
    });
  } catch (e: any) {
    console.error("[GEO] route error:", e);
    return NextResponse.json({
      ok: true,
      country: null,
      city: null,
      note: e?.message || "server error",
    });
  }
}
