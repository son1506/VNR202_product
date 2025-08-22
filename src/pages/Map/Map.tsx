import React, { useEffect, useMemo, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Polyline,
  Polygon,
  Marker,
  Popup,
  LayerGroup,
  CircleMarker,
} from 'react-leaflet';
import L from 'leaflet';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';

// Fix icon đường dẫn khi build Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom icons cho các tác nhân
const createCustomIcon = (color: string, symbol: string) => {
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color}; 
        width: 30px; 
        height: 30px; 
        border-radius: 50%; 
        border: 2px solid white; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-size: 16px; 
        color: white; 
        font-weight: bold;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      ">
        ${symbol}
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// ====== Types ======
type ActorKey = 'North' | 'South' | 'NLF' | 'US';
type EventPt = {
  id: string;
  title: string;
  year: number;
  summary: string;
  actors: ActorKey[];
  topic: 'politics' | 'military' | 'diplomacy' | 'legal';
  coords: [number, number];
  source?: string;
  importance: 'high' | 'medium' | 'low';
};

// ====== Data ======
const DMZ_LINE: [number, number][] = [
  [17.0, 105.7],
  [17.0, 108.6],
];

const DMZ_BAND: [number, number][][] = [
  [
    [17.15, 105.9],
    [16.85, 105.9],
    [16.85, 107.5],
    [17.15, 107.5],
  ],
];

const HCM_TRAIL: [number, number][] = [
  [18.2, 105.2],
  [17.6, 105.8],
  [16.7, 106.5],
  [15.9, 107.3],
  [15.2, 107.7],
  [14.5, 107.8],
  [13.8, 108.1],
  [13.0, 108.3],
  [12.2, 108.5],
  [11.5, 108.2],
  [10.8, 107.8],
];

const EVENTS: EventPt[] = [
  {
    id: 'geneva-context-1954',
    title: 'Hiệp định Genève 1954',
    year: 1954,
    summary: 'Đình chỉ chiến sự; giới tuyến quân sự tạm thời tại vĩ tuyến 17°; dự kiến tổng tuyển cử thống nhất năm 1956.',
    actors: ['North'],
    topic: 'diplomacy',
    coords: [21.0278, 105.8342],
    importance: 'high',
    source: 'https://vi.wikipedia.org/wiki/Hiệp_định_Genève_1954',
  },
  {
    id: 'no-election-1956',
    title: 'Từ chối tổng tuyển cử (1956)',
    year: 1956,
    summary: 'VNCH và Mỹ từ chối hiệp thương tổng tuyển cử → tiến trình thống nhất bế tắc.',
    actors: ['South', 'US'],
    topic: 'legal',
    coords: [10.8231, 106.6297],
    importance: 'high',
    source: 'https://vi.wikipedia.org/wiki/Chiến_tranh_Việt_Nam',
  },
  {
    id: 'nlf-1960',
    title: 'Thành lập MTDTGP MN (1960)',
    year: 1960,
    summary: 'Mặt trận Dân tộc Giải phóng miền Nam ra đời (12/1960); 1961 hình thành Quân Giải phóng.',
    actors: ['NLF'],
    topic: 'politics',
    coords: [11.32, 106.10],
    importance: 'high',
    source: 'https://vi.wikipedia.org/wiki/Mặt_trận_Dân_tộc_Giải_phóng_miền_Nam_Việt_Nam',
  },
  {
    id: 'special-war-1961',
    title: 'Chiến tranh đặc biệt (1961-1964)',
    year: 1962,
    summary: 'Khung tác chiến: cố vấn/viện trợ Mỹ + quân VNCH; bình định, ấp chiến lược tại MN.',
    actors: ['US', 'South'],
    topic: 'military',
    coords: [12.5, 107.5],
    importance: 'medium',
    source: 'https://vi.wikipedia.org/wiki/Chiến_tranh_Việt_Nam',
  },
  {
    id: 'buddhist-1963',
    title: 'Khủng hoảng Phật giáo (1963)',
    year: 1963,
    summary: 'Khủng hoảng chính trị-xã hội trầm trọng ở miền Nam, dẫn tới đảo chính 11/1963.',
    actors: ['South'],
    topic: 'politics',
    coords: [16.4637, 107.5909],
    importance: 'high',
    source: 'https://vi.wikipedia.org/wiki/Cuộc_khủng_hoảng_Phật_giáo_1963',
  },
  {
    id: 'tonkin-1964',
    title: 'Sự kiện Vịnh Bắc Bộ (1964)',
    year: 1964,
    summary: 'Nghị quyết Vịnh Bắc Bộ của QH Hoa Kỳ mở đường cho mở rộng can dự quân sự trực tiếp.',
    actors: ['US'],
    topic: 'diplomacy',
    coords: [19.5, 107.3],
    importance: 'high',
    source: 'https://vi.wikipedia.org/wiki/Sự_kiện_Vịnh_Bắc_Bộ',
  },
  // Thêm các sự kiện khác
  {
    id: 'dong-khoi-1960',
    title: 'Phong trào Đồng Khởi (1960)',
    year: 1960,
    summary: 'Phong trào nổi dậy lớn ở Bến Tre và các tỉnh ĐBSCL, đánh dấu chuyển pha đấu tranh.',
    actors: ['NLF'],
    topic: 'politics',
    coords: [10.2435, 106.3757],
    importance: 'medium',
    source: 'https://vi.wikipedia.org/wiki/Phong_trào_Đồng_Khởi',
  },
];

// ====== Helpers ======
const ACTOR_CONFIG: Record<ActorKey, { label: string; color: string; symbol: string }> = {
  North: { label: 'Miền Bắc (VNDCCH)', color: '#ef4444', symbol: '🟥' },
  South: { label: 'Miền Nam (VNCH)', color: '#3b82f6', symbol: '🟦' },
  NLF: { label: 'MTDTGP MN / QGP', color: '#10b981', symbol: '⭐' },
  US: { label: 'Hoa Kỳ', color: '#8b5cf6', symbol: '🇺🇸' },
};

const TOPIC_CONFIG: Record<string, { color: string; label: string }> = {
  politics: { color: '#f59e0b', label: 'Chính trị' },
  military: { color: '#dc2626', label: 'Quân sự' },
  diplomacy: { color: '#059669', label: 'Ngoại giao' },
  legal: { color: '#7c3aed', label: 'Pháp lý' },
};

function useQueryDefaults() {
  const [sp] = useSearchParams();
  const yearQ = Number(sp.get('year'));
  const actorsQ = sp.get('actors')?.split(',').filter(Boolean) as ActorKey[] | undefined;

  return {
    year: !isNaN(yearQ) ? Math.min(Math.max(yearQ, 1954), 1964) : 1964,
    actors: actorsQ?.length ? new Set(actorsQ) : new Set<ActorKey>(['North', 'South', 'NLF', 'US']),
  };
}

const MapPage: React.FC = () => {
  const defaults = useQueryDefaults();
  const [year, setYear] = useState<number>(defaults.year);
  const [showDMZ, setShowDMZ] = useState(true);
  const [showTrail, setShowTrail] = useState(true);
  const [actors, setActors] = useState<Set<ActorKey>>(defaults.actors);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [showPanel, setShowPanel] = useState(true);

  const center: L.LatLngExpression = [15.5, 107.0];

  const filteredEvents = useMemo(() => {
    return EVENTS.filter((e) => 
      e.year <= year && 
      e.actors.some((a) => actors.has(a)) &&
      (selectedTopic === 'all' || e.topic === selectedTopic)
    );
  }, [year, actors, selectedTopic]);

  const toggleActor = (a: ActorKey) =>
    setActors((prev) => {
      const next = new Set(prev);
      if (next.has(a)) {
        next.delete(a);
      } else {
        next.add(a);
      }
      return next;
    });

  return (
    <div className="relative min-h-screen">
      {/* Toggle button for panel */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="absolute z-[1001] top-4 right-4 p-3 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 text-white hover:bg-white/30 transition-colors"
      >
        {showPanel ? '✕' : '☰'}
      </button>

      {/* Control Panel */}
      <motion.div
        initial={{ x: -400 }}
        animate={{ x: showPanel ? 0 : -380 }}
        className="absolute z-[1000] top-4 left-4 p-6 rounded-3xl border border-white/20 backdrop-blur-xl bg-gradient-to-br from-indigo-900/80 to-purple-900/80 text-white w-[400px] shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="text-2xl">🗺️</div>
          <h2 className="text-xl font-bold">Bản đồ Việt Nam 1954-1964</h2>
        </div>

        {/* Year Slider */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm opacity-80">Năm hiển thị ≤</span>
            <span className="font-bold text-xl text-yellow-300">{year}</span>
          </div>
          <input
            type="range"
            min={1954}
            max={1964}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((year - 1954) / 10) * 100}%, rgba(255,255,255,0.2) ${((year - 1954) / 10) * 100}%, rgba(255,255,255,0.2) 100%)`
            }}
          />
          <div className="flex justify-between text-xs opacity-70 mt-1">
            <span>1954 (Genève)</span>
            <span>1964 (Vịnh Bắc Bộ)</span>
          </div>
        </div>

        {/* Layer Controls */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3 text-cyan-300">🗂️ Lớp hiển thị</h3>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={showDMZ} 
                onChange={() => setShowDMZ(v => !v)}
                className="w-4 h-4"
              />
              <span className="text-sm">🚧 DMZ / Vĩ tuyến 17°</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={showTrail} 
                onChange={() => setShowTrail(v => !v)}
                className="w-4 h-4"
              />
              <span className="text-sm">🛤️ Đường mòn HCM</span>
            </label>
          </div>
        </div>

        {/* Actor Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3 text-yellow-300">👥 Lọc theo tác nhân</h3>
          <div className="space-y-2">
            {(Object.keys(ACTOR_CONFIG) as ActorKey[]).map((a) => (
              <label key={a} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={actors.has(a)}
                  onChange={() => toggleActor(a)}
                  className="w-4 h-4"
                />
                <span className="text-xl">{ACTOR_CONFIG[a].symbol}</span>
                <span className="text-sm flex-1">{ACTOR_CONFIG[a].label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Topic Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3 text-pink-300">🏷️ Lọc theo chủ đề</h3>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full p-2 rounded-lg bg-white/20 border border-white/30 text-white text-sm"
          >
            <option value="all" className="text-black">Tất cả chủ đề</option>
            {Object.entries(TOPIC_CONFIG).map(([key, config]) => (
              <option key={key} value={key} className="text-black">
                {config.label}
              </option>
            ))}
          </select>
        </div>

        {/* Statistics */}
        <div className="bg-white/10 rounded-xl p-4">
          <h3 className="text-sm font-semibold mb-2 text-green-300">📊 Thống kê</h3>
          <div className="text-xs space-y-1 opacity-90">
            <div>Sự kiện hiển thị: <strong>{filteredEvents.length}</strong></div>
            <div>Tổng sự kiện: <strong>{EVENTS.length}</strong></div>
            <div>Giai đoạn: <strong>1954-{year}</strong></div>
          </div>
        </div>
      </motion.div>

      {/* Map Container */}
      <MapContainer
        center={center}
        zoom={6}
        minZoom={5}
        maxZoom={10}
        style={{ height: '100vh', width: '100%' }}
        className="z-0"
      >
        {/* Base Map */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        />

        {/* DMZ Layer */}
        {showDMZ && (
          <LayerGroup>
            <Polyline 
              positions={DMZ_LINE} 
              pathOptions={{ 
                color: '#ef4444', 
                weight: 4, 
                dashArray: '10 5',
                opacity: 0.8
              }} 
            />
            <Polygon 
              positions={DMZ_BAND} 
              pathOptions={{ 
                color: '#7c3aed', 
                weight: 2, 
                fillColor: '#7c3aed', 
                fillOpacity: 0.15,
                dashArray: '5 5'
              }} 
            />
          </LayerGroup>
        )}

        {/* Ho Chi Minh Trail */}
        {showTrail && (
          <Polyline
            positions={HCM_TRAIL}
            pathOptions={{ 
              color: '#10b981', 
              weight: 5, 
              opacity: 0.7,
              dashArray: '15 10'
            }}
          />
        )}

        {/* Events as Custom Markers */}
        {filteredEvents.map((event) => {
          const primaryActor = event.actors[0];
          const config = ACTOR_CONFIG[primaryActor];
          
          return (
            <Marker 
              key={event.id} 
              position={event.coords}
              icon={createCustomIcon(config.color, config.symbol)}
            >
              <Popup className="custom-popup">
                <div className="space-y-3 min-w-[280px]">
                  <div className="border-b border-gray-200 pb-2">
                    <h3 className="font-bold text-lg text-gray-800">{event.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <span>📅 {event.year}</span>
                      <span 
                        className="px-2 py-1 rounded-full text-white text-xs"
                        style={{ backgroundColor: TOPIC_CONFIG[event.topic].color }}
                      >
                        {TOPIC_CONFIG[event.topic].label}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {event.summary}
                  </p>
                  
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Tác nhân liên quan:</div>
                    <div className="flex gap-2 flex-wrap">
                      {event.actors.map(actor => (
                        <span 
                          key={actor}
                          className="text-xs px-2 py-1 rounded-full text-white"
                          style={{ backgroundColor: ACTOR_CONFIG[actor].color }}
                        >
                          {ACTOR_CONFIG[actor].symbol} {ACTOR_CONFIG[actor].label}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {event.source && (
                    <a 
                      href={event.source} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-block text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      📖 Xem nguồn tham khảo
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <style>{`
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          background: #fbbf24;
          border-radius: 50%;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default MapPage;