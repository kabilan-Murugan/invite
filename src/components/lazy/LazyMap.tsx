import React, { useState, useEffect, useRef } from 'react';
import { Layers } from 'lucide-react';
import { weddingData } from '../../data/wedding';

interface LazyMapProps {
  lat: number;
  lng: number;
  venueName: string;
  address: string;
}

const LazyMap: React.FC<LazyMapProps> = ({ lat, lng, venueName, address }) => {
  const [mapEngine, setMapEngine] = useState<'google' | 'leaflet'>('google');
  const leafletContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<any>(null);

  const googleEmbedUrl =
    import.meta.env.VITE_MAPS_EMBED_URL ||
    weddingData.venue.embedMapUrl ||
    `https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=15&output=embed`;

  useEffect(() => {
    if (mapEngine !== 'leaflet') return;
    if (!leafletContainerRef.current) return;

    let isMounted = true;

    // Dynamically import Leaflet
    import('leaflet').then((L) => {
      if (!isMounted || !leafletContainerRef.current) return;

      // Import Leaflet CSS dynamically if not already loaded
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
      }

      const map = L.map(leafletContainerRef.current).setView([lat, lng], 15);
      leafletMapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Custom gold wedding marker icon
      const goldIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="display:flex;align-items:center;justify-content:center;width:42px;height:42px;background:#6B1E2E;border:2.5px solid #C9A227;border-radius:50%;box-shadow:0 4px 14px rgba(0,0,0,0.4);animation:bounce 2s infinite;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFDF78" stroke-width="2.5">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5" fill="#FFDF78"/>
            </svg>
          </div>
        `,
        iconSize: [42, 42],
        iconAnchor: [21, 42],
        popupAnchor: [0, -42],
      });

      const marker = L.marker([lat, lng], { icon: goldIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family:sans-serif;font-size:13px;line-height:1.4;color:#2D2424;padding:4px;">
          <strong style="color:#6B1E2E;font-size:14px;">${venueName}</strong><br/>
          <span>${address}</span>
        </div>
      `).openPopup();
    });

    return () => {
      isMounted = false;
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [mapEngine, lat, lng, venueName, address]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-[#C9A227]/30 bg-stone-100">
      {/* Switch Map Engine Toggle */}
      <div className="absolute top-3 right-3 z-10">
        <button
          type="button"
          onClick={() => setMapEngine(mapEngine === 'google' ? 'leaflet' : 'google')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[#6B1E2E] text-xs font-semibold shadow-md hover:bg-white active:scale-95 transition-all border border-[#C9A227]/40 cursor-pointer"
        >
          <Layers className="w-3.5 h-3.5 text-[#C9A227]" />
          <span>{mapEngine === 'google' ? 'OpenStreetMap' : 'Google Maps'}</span>
        </button>
      </div>

      {mapEngine === 'google' ? (
        <iframe
          title={`Map location of ${venueName}`}
          src={googleEmbedUrl}
          width="100%"
          height="380"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-[320px] sm:h-[380px]"
        />
      ) : (
        <div
          ref={leafletContainerRef}
          className="w-full h-[320px] sm:h-[380px] z-0"
        />
      )}
    </div>
  );
};

export default LazyMap;
