// src/pages/Playlists.jsx
import React, { useEffect, useState } from "react";
import "./Playlists.css";
import { VIDEOS } from "../data/videos";

// oEmbed: no key required; returns { title, thumbnail_url }
async function fetchOEmbed(videoId) {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${encodeURIComponent(
    videoId
  )}&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`oEmbed ${res.status}`);
  return res.json();
}

function VideoTile({ video }) {
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await fetchOEmbed(video.id);
        if (alive) setMeta(data);
      } catch {
        // noop: we'll just use a thumbnail fallback below
      }
    })();
    return () => { alive = false; };
  }, [video.id]);

  const href = `https://www.youtube.com/watch?v=${video.id}`;
  const title = meta?.title || video.title || "YouTube Video";
  const thumb =
    meta?.thumbnail_url ||
    `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;

  return (
    <a
      className="video-tile"
      href={href}
      target="_blank"
      rel="noreferrer"
      title={title}
    >
      <div className="video-thumb-wrap">
        <img className="video-thumb" loading="lazy" src={thumb} alt={title} />
        <div className="video-veil" />
        <div className="video-genre">{video.genre}</div>
      </div>
      <div className="video-meta">
        <div className="video-title">{title}</div>
      </div>
    </a>
  );
}

export default function Playlists() {
  return (
    <div className="videos-page">
      <h1 className="videos-title">Playlists</h1>
      <div className="videos-grid">
        {VIDEOS.map((v) => (
          <VideoTile key={v.id} video={v} />
        ))}
      </div>
    </div>
  );
}
