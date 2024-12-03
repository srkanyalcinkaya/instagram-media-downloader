import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "A valid video URL is required." }, { status: 400 });
  }

  try {
    // Video akışını indir
    const response = await axios.get(url, { responseType: "stream" });

    // Başlık ve içerik türü ayarla
    const headers = new Headers({
      "Content-Disposition": `attachment; filename="video.mp4"`,
      "Content-Type": "video/mp4",
    });

    return new NextResponse(response.data, { headers });
  } catch (error) {
    console.error("Error downloading the video:", error);
    return NextResponse.json({ error: "Failed to download the video." }, { status: 500 });
  }
}
