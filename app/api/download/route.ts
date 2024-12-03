// pages/api/download.ts
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Only GET requests are allowed." });
  }

  const { url } = req.query;
  
  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "A valid video URL is required." });
  }

  try {
    const response = await axios.get(url, { responseType: "stream" });

    res.setHeader("Content-Disposition", `attachment; filename="video.mp4"`);
    res.setHeader("Content-Type", "video/mp4");

    response.data.pipe(res);
  } catch (error) {
    console.error("Error downloading the video:", error);
    res.status(500).json({ error: "Failed to download the video." });
  }
}
