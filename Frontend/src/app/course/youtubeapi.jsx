"use client"
import React, { memo, useState, useEffect } from "react";

const YouTubeVideo = memo(({ query }) => {
  const [videoId, setVideoId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideo() {
      if (!query) return;
      setLoading(true);
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
            query
          )}&type=video&maxResults=1&videoEmbeddable=true&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
        );
        const data = await res.json();
        if (data.items?.length > 0) setVideoId(data.items[0].id.videoId);
        else setVideoId(null);
      } catch (err) {
        console.error(err);
        setVideoId(null);
      } finally {
        setLoading(false);
      }
    }
    fetchVideo();
  }, []);

  if (loading) return <p>Loading video...</p>;
  if (!videoId) return <p>No video found for "{query}"</p>;

  return (
    <div className="my-4 flex justify-center">
      <iframe
        width="960"
        height="315"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={query}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="border-4 border-black"
      />
    </div>
  );
});

export default YouTubeVideo;
