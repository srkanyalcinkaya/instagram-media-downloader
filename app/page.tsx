"use client"
import { useState } from "react";
import axios from 'axios';
export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloadLink, setDownloadLink] = useState("");

  const handleGetVideo = async () => {
    if (!url) {
      alert("Lütfen bir Instagram URL'si giriniz!");
      return;
    }
    setLoading(true);
    setDownloadLink("");
    try {

      const response = await axios.post("/api/get-video", {
        url
      })

      if (response.data.error) {
        console.log("Hata var")
        return;
      }
      // console.log(response.data.videoUrl)
      setDownloadLink(response.data.videoUrl);
    } catch (error) {
      console.error("Hata:", error);
      alert("Bir hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const videoDownloadLink = `/api/download?url=${encodeURIComponent(downloadLink)}`;
    window.location.href = videoDownloadLink;
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Instagram Downloader
      </h1>
      <div className="w-full max-w-md p-4 bg-white rounded shadow">
        <input
          type="text"
          className="w-full p-2 mb-4 border rounded text-black placeholder:text-black"
          placeholder="Instagram URL'sini buraya yapıştırın"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        {downloadLink ?
          <button
            onClick={handleDownload}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "İndiriliyor..." : "İndir"}
          </button>
          :
          <button
            onClick={handleGetVideo}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Bekleyin..." : "İndir"}
          </button>
        }

        {/* <video src="blob:https://www.instagram.com/95cf58b3-4d24-433e-892d-e99a6274dff9" className="h-40 w-40 "></video> */}
      </div>
      {downloadLink && (
        <div className="mt-6">
          <a
            href={downloadLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Dosyayı İndir
          </a>
        </div>
      )}
    </div>
  );
}
