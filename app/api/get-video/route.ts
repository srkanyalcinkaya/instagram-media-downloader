const getId = (url: string) => {
    const regex = /instagram.com\/(?:[A-Za-z0-9_.]+\/)?(p|reels|reel|stories)\/([A-Za-z0-9-_]+)/;
    const match = url.match(regex);
    return match && match[2] ? match[2] : null;
  };
  
  import { NextResponse } from "next/server";
  import axios from "axios";
  
  export async function POST(req: Request) {
    try {
      const _userAgent = process.env.USER_AGENT;
      const _cookie = process.env.COOKIE;
      const _xIgAppId = process.env.X_IG_APP_ID;
      const { url } = await req.json();
  
      const igId = getId(url);
      if (!igId) return "Invalid URL";
  
      // Fetch data from Instagram post
      const response = await axios(`https://www.instagram.com/p/${igId}?__a=1&__d=dis`, {
        headers: {
          "Cookie": _cookie,
          "User-Agent": _userAgent,
          "X-IG-App-ID": _xIgAppId,
          "Sec-Fetch-Site": "same-origin"
        }
      });
  
      const json = response.data; // Corrected here
      const items = json?.items[0];
  
      // Check if post is a carousel
      let carousel_media: any = [];
      if (items?.product_type === "carousel_container") {
        for (const el of items?.carousel_media) {
          carousel_media.push({
            image_versions: el?.image_versions2?.candidates,
            video_versions: el?.video_versions
          });
        }
      }
  
      // Return custom json object
      const data: any = {
        code: items?.code,
        created_at: items?.taken_at,
        username: items?.user?.username,
        full_name: items?.user?.full_name,
        profile_picture: items?.user?.profile_pic_url,
        is_verified: items?.user?.is_verified,
        is_paid_partnership: items?.is_paid_partnership,
        product_type: items?.product_type,
        caption: items?.caption?.text,
        like_count: items?.like_count,
        comment_count: items?.comment_count,
        view_count: items?.view_count ? items.view_count : items?.play_count,
        video_duration: items?.video_duration,
        location: items?.location,
        height: items?.original_height,
        width: items?.original_width,
        image_versions: items?.image_versions2?.candidates,
        video_versions: items?.video_versions,
        carousel_media
      };
  
      if (!url || !url.includes("instagram.com/reel")) {
        return NextResponse.json({ error: "Geçerli bir Instagram reel URL'si giriniz." }, { status: 400 });
      }
      if (!data.video_versions[0].url) {
        return NextResponse.json({ error: "Video URL'si bulunamadı. Lütfen URL'yi kontrol ediniz." }, { status: 404 });
      }
  
      return NextResponse.json({ videoUrl: data.video_versions[0].url }, { status: 200 });
    } catch (error) {
      console.error("Hata:", error);
      return NextResponse.json({ error: "Bir hata oluştu. Tekrar deneyiniz." }, { status: 500 });
    }
  }
  