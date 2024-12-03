import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const getId = (url: string) => {
  const regex = /instagram.com\/(?:[A-Za-z0-9_.]+\/)?(p|reels|reel|stories)\/([A-Za-z0-9-_]+)/;
  const match = url.match(regex);
  return match && match[2] ? match[2] : null;
};

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || !url.includes("instagram.com")) {
      return NextResponse.json(
        { error: "Geçerli bir Instagram URL'si giriniz." },
        { status: 400 }
      );
    }

    const igId = getId(url);
    if (!igId) {
      return NextResponse.json(
        { error: "Geçerli bir Instagram gönderi ID'si bulunamadı." },
        { status: 400 }
      );
    }

    const _userAgent = process.env.USER_AGENT || "Mozilla/5.0";
    const _cookie = process.env.COOKIE || "";
    const _xIgAppId = process.env.X_IG_APP_ID || "";

    // Instagram API isteği
    const response = await axios.get(
      `https://www.instagram.com/p/${igId}?__a=1&__d=dis`,
      {
        headers: {
          "Cookie": _cookie,
          "User-Agent": _userAgent,
          "X-IG-App-ID": _xIgAppId,
          "Sec-Fetch-Site": "same-origin",
        },
      }
    );

    const json = response.data;

    if (!json || !json.items || !json.items[0]) {
      return NextResponse.json(
        { error: "Gönderi bilgileri alınamadı. URL'yi kontrol ediniz." },
        { status: 404 }
      );
    }

    const items = json.items[0];
    const videoUrl = items?.video_versions?.[0]?.url;

    if (!videoUrl) {
      return NextResponse.json(
        { error: "Video URL'si bulunamadı. Lütfen URL'yi kontrol ediniz." },
        { status: 404 }
      );
    }

    return NextResponse.json({ videoUrl }, { status: 200 });
  } catch (error) {
    console.error("Hata:", error);
    return NextResponse.json(
      { error: "Bir hata oluştu. Tekrar deneyiniz." },
      { status: 500 }
    );
  }
}
