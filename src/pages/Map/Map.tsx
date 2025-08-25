import React, { useEffect, useMemo, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Polyline,
  Polygon,
  Marker,
  Popup,
  LayerGroup,
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

// KHU VỰC CÁC QUẦN ĐẢO CỦA VIỆT NAM
const HOANG_SA_AREA: [number, number][][] = [
  [
    [17.5, 111.0],  // Top-Left
    [17.5, 113.5],  // Top-Right
    [15.5, 113.5],  // Bottom-Right
    [15.5, 111.0],  // Bottom-Left
  ],
];

const TRUONG_SA_AREA: [number, number][][] = [
  [
    [12.5, 111.0], // Top-Left
    [12.5, 116.5], // Top-Right
    [6.0, 116.5],  // Bottom-Right
    [6.0, 111.0],  // Bottom-Left
  ],
];

// ===== TÂM VÙNG (đặt ngôi sao) =====
const HOANG_SA_CENTER: [number, number] = [16.5, 112.25];
const TRUONG_SA_CENTER: [number, number] = [9.25, 113.8];

// ===== ICON SAO VÀNG (SVG) =====
const STAR_ICON = L.divIcon({
  className: "vn-flag-star",
  html: `
    <svg width="36" height="36" viewBox="0 0 100 100" aria-label="Vietnam star">
      <polygon
        points="50,5 61,36 94,38 67,58 76,90 50,72 24,90 33,58 6,38 39,36"
        fill="#facc15"
      />
    </svg>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

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

// Các toạ độ tiện dùng
const COORDS = {
  HANOI: [21.0278, 105.8342] as [number, number],
  SAIGON: [10.7769, 106.7009] as [number, number],
  BEN_TRE: [10.1060, 106.3750] as [number, number],
  AP_BAC: [10.3581, 106.1200] as [number, number],
  TAY_NINH: [11.3591, 106.1417] as [number, number],
  TONKIN_GULF: [19.7, 106.8] as [number, number],
  GENEVA: [46.2044, 6.1432] as [number, number],
};

const EVENTS: EventPt[] = [
  {
    id: 'geneva-1954',
    title: 'Hiệp định Genève',
    year: 1954,
    summary: 'Đình chỉ chiến sự; giới tuyến quân sự tạm thời; dự kiến tổng tuyển cử thống nhất.',
    actors: ['North', 'South'],
    topic: 'diplomacy',
    coords: COORDS.GENEVA,
    importance: 'high',
  },
  {
    id: 'phase-1954-58',
    title: 'Tái thiết MB, củng cố MN',
    year: 1958, // Lấy năm cuối của giai đoạn
    summary: 'Miền Bắc củng cố hậu phương; Miền Nam thực hiện chính sách “tố cộng diệt cộng” và ban hành Luật 10-59 để đàn áp phong trào.',
    actors: ['North', 'South'],
    topic: 'politics',
    coords: COORDS.SAIGON, // Trung tâm chính quyền VNCH
    importance: 'high',
  },
  {
    id: 'election-1955-56',
    title: 'Bế tắc hiệp thương – tổng tuyển cử',
    year: 1956, // Lấy năm cuối của giai đoạn
    summary: 'VNCH và Mỹ từ chối hiệp thương tổng tuyển cử (1956) → tiến trình thống nhất đất nước bị bế tắc.',
    actors: ['South', 'US'],
    topic: 'legal',
    coords: COORDS.SAIGON,
    importance: 'high',
  },

  // 1959 – Nghị quyết 15 (Hà Nội)
  {
    id: 'resolution-15-1959',
    title: 'Nghị quyết 15 (1959)',
    year: 1959,
    summary:
      'Xác lập hai nhiệm vụ chiến lược: CNXH ở MB; CM dân tộc–dân chủ ở MN; mở đường cho phong trào Đồng khởi.',
    actors: ['North'],
    topic: 'politics',
    coords: [21.0278, 105.8342], // Hà Nội
    importance: 'high',
    source:
      'https://vi.wikipedia.org/wiki/Ngh%E1%BB%8B_quy%E1%BA%BFt_Trung_%C6%B0%C6%A1ng_15',
  },

  {
    id: 'shift-1959-60',
    title: 'Chuyển pha đấu tranh ở miền Nam',
    year: 1960, // Lấy năm Đồng khởi lan rộng
    summary: 'Triển khai Nghị quyết 15 (1959) → cơ sở cho Đồng khởi lan rộng tại miền Nam, khởi đầu từ Bến Tre.',
    actors: ['North', 'NLF'],
    topic: 'politics',
    coords: COORDS.BEN_TRE, // Nơi khởi phát Đồng khởi
    importance: 'high',
  },
  {
    id: 'nlf-1960-61',
    title: 'MTDTGPMN & Quân Giải phóng',
    year: 1961, // Lấy năm hình thành QGP
    summary: 'Tháng 12/1960 thành lập Mặt trận; tháng 2/1961 hình thành Quân Giải phóng MN, thống nhất lực lượng vũ trang.',
    actors: ['NLF'],
    topic: 'politics',
    coords: COORDS.TAY_NINH, // Căn cứ địa
    importance: 'high',
  },
  {
    id: 'specialwar-1961-64',
    title: '“Chiến tranh đặc biệt”',
    year: 1964, // Lấy năm cuối của giai đoạn
    summary: 'Mỹ và VNCH thực hiện chiến lược "Chiến tranh đặc biệt", sử dụng cố vấn, viện trợ và quân đội VNCH, kết hợp với chiến thuật ấp chiến lược.',
    actors: ['US', 'South', 'NLF'],
    topic: 'military',
    coords: COORDS.SAIGON, // Trung tâm đầu não chỉ huy
    importance: 'high',
  },
  {
    id: 'crisis-1963',
    title: 'Khủng hoảng 1963 & đảo chính',
    year: 1963,
    summary: 'Biến cố Phật giáo leo thang thành khủng hoảng chính trị, dẫn đến cuộc đảo chính lật đổ Ngô Đình Diệm vào tháng 11/1963.',
    actors: ['South', 'US'],
    topic: 'politics',
    coords: COORDS.SAIGON,
    importance: 'high',
  },
  {
    id: 'tonkin-1964',
    title: 'Sự kiện Vịnh Bắc Bộ',
    year: 1964,
    summary: 'Nghị quyết Vịnh Bắc Bộ được Quốc hội Mỹ thông qua, mở đường cho việc can dự quân sự trực tiếp và sâu rộng hơn của Hoa Kỳ.',
    actors: ['US', 'North'],
    topic: 'diplomacy',
    coords: COORDS.TONKIN_GULF,
    importance: 'high',
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

        {/* Lãnh thổ Việt Nam */}
        <LayerGroup>
          {/* Quần đảo Hoàng Sa */}
          <Polygon
            positions={HOANG_SA_AREA}
            pathOptions={{
              color: '#dc2626',      // viền đỏ
              weight: 2,
              fillColor: '#dc2626',  // nền đỏ
              fillOpacity: 0.35,
            }}
          >
            <Popup>
              <div>
                <h3 className="font-bold text-base">Quần đảo Hoàng Sa</h3>
                <p className="text-sm">Là một phần lãnh thổ không thể tách rời của Việt Nam.</p>
              </div>
            </Popup>
          </Polygon>
          <Marker position={HOANG_SA_CENTER} icon={STAR_ICON} />

          {/* Quần đảo Trường Sa */}
          <Polygon
            positions={TRUONG_SA_AREA}
            pathOptions={{
              color: '#dc2626',
              weight: 2,
              fillColor: '#dc2626',
              fillOpacity: 0.35,
            }}
          >
            <Popup>
              <div>
                <h3 className="font-bold text-base">Quần đảo Trường Sa</h3>
                <p className="text-sm">Là một phần lãnh thổ không thể tách rời của Việt Nam.</p>
              </div>
            </Popup>
          </Polygon>
          <Marker position={TRUONG_SA_CENTER} icon={STAR_ICON} />
        </LayerGroup>

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