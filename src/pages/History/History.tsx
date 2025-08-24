// History.tsx — Timeline + Actors + Debate + Conclusion + Sources (1954–1964)
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { askGemini } from '../../app/modules/chatbot';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom'; // NEW: đọc hash để cuộn và quay lại

// ========= Types =========
type SourceRef = { label: string; url: string };
type Actor = { id: string; name: string; role: string; summary: string; highlights: string[] };
type EventItem = {
  id: string;
  year?: number;
  startYear?: number;
  endYear?: number;
  title: string;
  description: string;
  details?: React.ReactNode | string;
  color: string;
};

const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.9 3.8-3.8 1.9 3.8 1.9L12 14.4l1.9-3.8 3.8-1.9-3.8-1.9z" />
    <path d="M5 12h.01" />
    <path d="M19 12h.01" />
    <path d="M12 5v.01" />
    <path d="M12 19v.01" />
  </svg>
);

const formatEventYear = (e: EventItem) => {
  const s = e.startYear, t = e.endYear;
  if (s && t) return (
    <span className="flex items-center gap-1">
      <span>{s}</span>
      <span className="text-white/70 font-normal">–</span>
      <span>{t}</span>
    </span>
  );
  if (s && !t) return (
    <span className="flex items-center gap-1">
      <span>{s}</span>
      <span className="text-white/70 font-normal">–</span>
    </span>
  );
  if (!s && t) return (
    <span className="flex items-center gap-1">
      <span className="text-white/70 font-normal">–</span>
      <span>{t}</span>
    </span>
  );
  return <span>{e.year ?? ''}</span>;
};

const History: React.FC = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeEvent, setActiveEvent] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // NEW: cuộn tới phần theo hash (#debate, #conclusion, ...)
  const location = useLocation();
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace('#', '');
    // chờ DOM vẽ xong
    const t = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    return () => clearTimeout(t);
  }, [location.hash]);

  const handleSubmit = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      // Prompt hệ thống để AI trả lời đúng chủ đề lịch sử 1954–1964
      const systemPrompt = `Bạn là trợ lý AI lịch sử Việt Nam giai đoạn 1954–1964. Chỉ trả lời dựa trên kiến thức lịch sử, không bịa đặt. Nếu không đủ dữ kiện, hãy trả lời "Tôi chưa có thông tin về vấn đề này."`;
      const ans = await askGemini(question, systemPrompt);
      setResponse(ans);
    } catch (err: unknown) {
      let msg = 'Không xác định';
      if (err && typeof err === 'object' && 'message' in err && typeof (err as { message?: unknown }).message === 'string') {
        msg = (err as { message: string }).message;
      }
      setResponse('❌ Lỗi AI: ' + msg);
    }
    setLoading(false);
  };

  // ========= Data =========
  const sources: SourceRef[] = useMemo(
    () => [
      { label: 'Loigiaihay – Đường lối 1954–1964', url: 'https://loigiaihay.com/duong-loi-trong-giai-doan-1954-1964-c125a20120.html' },
      { label: 'Studocu – Tranh luận “nội chiến” (SV)', url: 'https://www.studocu.vn/vn/document/dai-hoc-kinh-te-quoc-dan/e-learning-lich-su-dang-cong-san-viet-nam/y-kien-giai-doan-1954-1975-o-viet-nam-la-noi-chien-dung-hay-sai/88590624' },
      { label: 'Studocu – Câu hỏi Lịch sử Đảng', url: 'https://www.studocu.vn/vn/document/dai-hoc-thuy-loi/lich-su-dang-cong-san/cau-hoi-lich-su-dang/87378877' },
      { label: 'Wikipedia – Chiến tranh Việt Nam (1954–1959…)', url: 'https://vi.wikipedia.org/wiki/Chi%E1%BA%BFn_tranh_Vi%E1%BB%87t_Nam#Giai_%C4%91o%E1%BA%A1n_1954-1959' },
    ],
    []
  );

  // ========= Timeline Events  =========
  const timelineEvents: EventItem[] = useMemo(
    () => [
      {
        id: 'geneva-1954',
        year: 1954,
        title: 'Hiệp định Genève',
        description: 'Đình chỉ chiến sự; giới tuyến quân sự tạm thời; dự kiến tổng tuyển cử thống nhất.',
        details: (
          <ul className="list-disc pl-5 space-y-1">
            <li>Thiết lập giới tuyến quân sự tạm thời ở vĩ tuyến 17; lực lượng hai bên tập kết.</li>
            <li>Dự kiến hiệp thương tổng tuyển cử trong năm 1956 để thống nhất đất nước.</li>
            <li>Quốc tế công nhận tính tạm thời của ranh giới; không phải chia cắt vĩnh viễn.</li>
          </ul>
        ),
        color: 'from-blue-500 ',
      },

      {
        id: 'phase-1954-58',
        startYear: 1954,
        endYear: 1958,
        title: 'Tái thiết MB, củng cố MN',
        description: 'MB: củng cố hậu phương; MN: “tố cộng diệt cộng”, Luật 10-59 (1957–1959) đàn áp phong trào.',
        details: (
          <ul className="list-disc pl-5 space-y-1">
            <li>Trung ương 6 (7/1954), Bộ Chính trị 9/1954, TƯ 7 & 8 (1955): ưu tiên củng cố miền Bắc, đấu tranh thống nhất.</li>
            <li>Miền Nam: chính quyền Ngô Đình Diệm bình định, chiến dịch “tố cộng diệt cộng”.</li>
            <li>Luật 10–59 lập toà án quân sự đặc biệt, mức án nặng; ảnh hưởng lớn đến phong trào cách mạng ở MN.</li>
          </ul>
        ),
        color: 'from-blue-500',
      },

      {
        id: 'election-1955-56',
        startYear: 1955,
        endYear: 1956,
        title: 'Bế tắc hiệp thương – tổng tuyển cử',
        description: 'VNCH/Mỹ không hiệp thương tổng tuyển cử (1956) → bế tắc thống nhất.',
        details: (
          <ul className="list-disc pl-5 space-y-1">
            <li>Hai miền không đạt đồng thuận về tổ chức tổng tuyển cử theo tinh thần Genève.</li>
            <li>Bế tắc chính trị tạo nền cho chuyển pha đấu tranh tại MN giai đoạn sau.</li>
          </ul>
        ),
        color: 'from-blue-500',
      },

      {
        id: 'shift-1959-60',
        startYear: 1959,
        endYear: 1960,
        title: 'Chuyển pha đấu tranh ở miền Nam',
        description: 'Triển khai Nghị quyết 15 (1959) → cơ sở cho Đồng khởi lan rộng 1959–1960.',
        details: (
          <ul className="list-disc pl-5 space-y-1">
            <li>NQ 15 xác lập hai nhiệm vụ chiến lược: CNXH ở MB; CM dân tộc–dân chủ ở MN.</li>
            <li>Con đường cơ bản ở MN: khởi nghĩa giành chính quyền khi có điều kiện.</li>
            <li>Đồng khởi bùng nổ từ Bến Tre lan rộng, làm tan rã một mảng chính quyền cơ sở VNCH ở nông thôn.</li>
          </ul>
        ),
        color: 'from-blue-500',
      },

      {
        id: 'nlf-1960-61',
        startYear: 1960,
        endYear: 1961,
        title: 'MTDTGPMN & Quân Giải phóng',
        description: '12/1960 thành lập Mặt trận; 2/1961 hình thành Quân Giải phóng MN.',
        details: (
          <ul className="list-disc pl-5 space-y-1">
            <li>Mặt trận là liên minh chính trị rộng rãi của các lực lượng ở MN.</li>
            <li>QGP MN ra đời 2/1961, thống nhất lực lượng vũ trang cách mạng tại chỗ.</li>
            <li>Tạo thế đối trọng chính trị – quân sự với bộ máy VNCH ở nông thôn.</li>
          </ul>
        ),
        color: 'from-blue-500',
      },

      {
        id: 'specialwar-1961-64',
        startYear: 1961,
        endYear: 1964,
        title: '“Chiến tranh đặc biệt”',
        description: 'Cố vấn–viện trợ Mỹ, quân VNCH tác chiến; ấp chiến lược, trực thăng vận.',
        details: (
          <ul className="list-disc pl-5 space-y-1">
            <li>Kế hoạch Staley–Taylor: Mỹ cung cấp cố vấn, vũ khí, hậu cần; VNCH tác chiến chủ lực.</li>
            <li>“Ấp chiến lược” nhằm cô lập lực lượng cách mạng ở nông thôn.</li>
            <li>Thích ứng chiến thuật của phía cách mạng: điển hình trận Ấp Bắc (1/1963).</li>
            <li>Khủng hoảng chính trị dẫn đến đảo chính 11/1963, làm suy yếu VNCH.</li>
          </ul>
        ),
        color: 'from-blue-500',
      },

      {
        id: 'crisis-1963',
        year: 1963,
        title: 'Khủng hoảng 1963 & đảo chính',
        description: 'Biến cố Phật giáo; lật đổ Ngô Đình Diệm (11/1963).',
        details: (
          <ul className="list-disc pl-5 space-y-1">
            <li>Khủng hoảng Phật giáo bùng nổ sau các sự kiện đàn áp.</li>
            <li>Đảo chính 11/1963: chế độ Ngô Đình Diệm sụp đổ, tình trạng bất ổn kéo dài.</li>
          </ul>
        ),
        color: 'from-blue-500',
      },

      {
        id: 'tonkin-1964',
        year: 1964,
        title: 'Sự kiện Vịnh Bắc Bộ',
        description: '8/1964: Nghị quyết Vịnh Bắc Bộ → mở đường cho can dự trực tiếp của Hoa Kỳ.',
        details: (
          <ul className="list-disc pl-5 space-y-1">
            <li>Quốc hội Mỹ trao quyền rộng cho hành pháp (Gulf of Tonkin Resolution).</li>
            <li>Sau đó Mỹ oanh kích miền Bắc (Pierce Arrow) và chuẩn bị đưa quân (sang 1965).</li>
            <li>“Chiến tranh đặc biệt” bộc lộ thất bại; chuyển sang “chiến tranh cục bộ”.</li>
          </ul>
        ),
        color: 'from-blue-500',
      },
    ],
    []
  );

  const actors: Actor[] = useMemo(
    () => [
      {
        id: 'party-line',
        name: 'Đường lối của Đảng',
        role: 'Tóm lược mốc chính',
        summary: 'Đặc điểm: một Đảng lãnh đạo hai cuộc cách mạng Bắc–Nam; cơ sở định ra chiến lược chung.',
        highlights: [
          'NQ 15 (1959): hợp thức hóa đấu tranh vũ trang ở MN',
          'ĐH III (1960): hoàn chỉnh đường lối chiến lược chung',
          'Ý nghĩa: sức mạnh tổng hợp chống Mỹ'
        ]
      },
      {
        id: 'north-meaning',
        name: 'Vai trò Miền Bắc',
        role: 'Hậu phương lớn',
        summary: 'Xây dựng CNXH; chủ trương công–nông nghiệp; chuẩn bị lực lượng cho kháng chiến lâu dài.',
        highlights: [
          'Hậu phương quyết định',
          'Nghị quyết 1961–1964',
          'Cơ sở vững chắc cho đấu tranh'
        ]
      },
      {
        id: 'south-meaning',
        name: 'Vai trò Miền Nam',
        role: 'Tiền tuyến lớn',
        summary: 'Đồng khởi thay đổi tương quan lực lượng; MTDTGPMN ra đời tạo chính trị–quân sự hợp pháp.',
        highlights: [
          'Đồng khởi 1959–1960',
          'MTDTGPMN 1960',
          'Quân Giải phóng 1961'
        ]
      },
      {
        id: 'strategic',
        name: 'Tầm vóc chiến lược',
        role: 'Hai nhiệm vụ chiến lược',
        summary: 'Huy động sức mạnh cả nước và quốc tế; đặt nền cho thắng lợi trước “chiến tranh đặc biệt”.',
        highlights: [
          'Sức mạnh toàn dân',
          'Ủng hộ quốc tế',
          'Bước chuẩn bị cho 1965–1975'
        ]
      },
    ],
    []
  );

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 12 } } };

  return (
    <motion.div ref={containerRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative min-h-screen overflow-hidden">
      {/* Back Button */}
      <motion.button
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2 rounded-full shadow-lg backdrop-blur-md border border-white/20 transition-all duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeftIcon className="w-5 h-5" />
        Quay lại
      </motion.button>
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://vnanet.vn/Data/Articles/2020/01/10/4365851/vna_potal_90_nam_dcs_viet_nam_dang_lanh_dao_ca_nuoc_truc_tiep_chien_dau_chong_de_quoc_my_xam_luoc_1965_%E2%80%93_1973__151902709_stand.jpg')",
            zIndex: 0,
            filter: 'brightness(0.55)'
          }}
        />
        {/* Overlay gradient and effects */}
        <div className="absolute inset-0 bg-gradient-to-br  via-black-900 to-red-900 opacity-80" style={{ zIndex: 1 }} />
        <motion.div className="absolute top-20 left-20 w-32 h-32 bg-blue-500 rounded-full opacity-10" animate={{ scale: [1, 1.5, 1], rotate: [0, 180, 360] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} style={{ zIndex: 2 }} />
        <motion.div className="absolute bottom-20 right-20 w-24 h-24 bg-purple-500 rounded-lg opacity-10" animate={{ scale: [1, 1.3, 1], rotate: [0, -180, -360] }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }} style={{ zIndex: 2 }} />
      </div>

      {/* Header */}
      <motion.div style={{ y, opacity }} className="relative z-10 pt-20 pb-10 text-center text-white">
        <motion.h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-blue-400 via-blue-500  bg-clip-text text-transparent" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}>
          Dòng thời gian 1954–1964
        </motion.h1>
        <motion.p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto px-4" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
          Các mốc chính trị–quân sự – nền cho mô-đun tranh luận “có phải nội chiến?”.
        </motion.p>
      </motion.div>

      {/* Ask AI */}
      <motion.div className="relative z-10 max-w-2xl mx-auto px-4 mb-16" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}>
        <motion.div className="backdrop-blur-lg bg-white/10 rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl" whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
            <SparklesIcon className="w-7 h-7 text-purple-300" /> Hỏi nhanh AI </h2>
          <div className="relative">
            <motion.input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              // placeholder="Hỏi về Genève 1954, Mặt trận 1960, Vịnh Bắc Bộ 1964, hay 'có phải nội chiến?'…"
              className="w-full p-4 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
              whileFocus={{ scale: 1.01 }}
            />
            <motion.button onClick={handleSubmit} className="absolute right-2 top-2 bottom-2 px-6 bg-gradient-to-r from-blue-600  text-white rounded-xl font-semibold shadow-lg" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }} disabled={loading}>
              {loading ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : 'Trả lời'}
            </motion.button>
          </div>
        </motion.div>

        {response && (
          <motion.div initial={{ opacity: 0, y: 30, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="mt-8 backdrop-blur-lg bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-3"> Kết quả:</h3>
            <p className="text-lg text-gray-100 leading-relaxed">{response}</p>
          </motion.div>
        )}
      </motion.div>

      {/* Timeline */}
      <motion.div id="timeline" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="relative z-10 max-w-6xl mx-auto px-4 pb-10">
        <motion.h2 className="text-4xl font-bold text-white text-center mb-12" variants={itemVariants}> Dòng thời gian</motion.h2>
        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full" />
          {timelineEvents.map((event, index) => (
            <TimelineEvent key={event.id} event={event} index={index} isActive={activeEvent === index} onHover={() => setActiveEvent(index)} onLeave={() => setActiveEvent(null)} />
          ))}
        </div>
      </motion.div>

      {/* Actors */}
      <motion.div className="relative z-10 max-w-6xl mx-auto px-4 pb-20" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <motion.h2 className="text-4xl font-bold text-white text-center mb-12" variants={itemVariants}>Đường lối & Vai trò các bên</motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {actors.map((a) => (
            <motion.div key={a.id} variants={itemVariants} className="backdrop-blur-lg bg-white/10 rounded-3xl p-6 border border-white/20 text-white flex flex-col" whileHover={{ y: -8, scale: 1.03 }} transition={{ type: 'spring', stiffness: 200 }}>
              <div className="flex-grow">
                <span className="inline-block bg-blue-900/50 text-blue-200 text-xs font-medium px-2.5 py-1 rounded-full mb-3">{a.role}</span>
                <h3 className="text-xl font-semibold mb-2">{a.name}</h3>
                <p className="text-white/80 text-sm mb-4 leading-relaxed">{a.summary}</p>
              </div>
              <ul className="text-sm space-y-2 text-white/90">
                {a.highlights.map((h) => <li key={h} className="flex items-start gap-2"><span className="text-blue-300 mt-1">✓</span>{h}</li>)}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Debate */}
<motion.div id="debate" className="relative z-10 max-w-5xl mx-auto px-4 pb-20" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <motion.h2 className="text-4xl font-bold text-white text-center mb-12" variants={itemVariants}>
          Phản biện: "Nội chiến" hay "Kháng chiến"?
        </motion.h2>
        <motion.div className="backdrop-blur-lg bg-white/10 rounded-3xl border border-white/20 text-white p-6 md:p-10 space-y-6" variants={itemVariants}>
          <DebatePoint title="Yếu tố quốc tế & quy chế pháp lý sau Genève">
            <li>Genève xác định chia cắt chỉ là <b className="text-blue-300">tạm thời</b>, hướng tới tổng tuyển cử 7/1956; không phải hai quốc gia độc lập.</li>
          </DebatePoint>
          <DebatePoint title="Sự can dự quyết định của Hoa Kỳ">
            <li>VNCH từ chối tổng tuyển cử dưới sự bảo trợ của Mỹ.</li>
            <li>Mỹ tài trợ <b className="text-blue-300">~80% ngân sách quân sự VNCH</b> thời kỳ đầu; nâng cấp thành “chiến tranh đặc biệt”.</li>
          </DebatePoint>
          <DebatePoint title="Bản chất đường lối cách mạng">
            <li>NQ 15 và ĐH III xác định MN là cách mạng dân tộc–dân chủ <b className="text-blue-300">chống đế quốc và tay sai</b>.</li>
            <li>Mục tiêu: thống nhất đất nước → đấu tranh giải phóng dân tộc, không phải “nội chiến” điển hình.</li>
          </DebatePoint>
          <DebatePoint title="Biện pháp đàn áp & nấc thang 1964">
            <li>Luật 10–59, hệ thống ấp chiến lược, cố vấn Mỹ → mô hình “thuộc địa kiểu mới”.</li>
            <li>Sự kiện Vịnh Bắc Bộ (8/1964) → cớ pháp lý Mỹ mở rộng chiến tranh, <b className="text-blue-300">quốc tế hóa sâu sắc</b>.</li>
          </DebatePoint>
        </motion.div>
      </motion.div>

      {/* NEW: Conclusion */}
      {/* Conclusion */}
      <motion.div
        id="conclusion"
        className="relative z-10 max-w-5xl mx-auto px-4 pb-24"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="backdrop-blur-lg bg-gradient-to-br from-white/15 to-white/5 rounded-3xl p-8 border border-white/20 text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-5">Kết luận</h2>
          <p className="text-white/95 leading-relaxed text-lg p-4 bg-black/20 rounded-xl border border-white/10">
            <b>Kết luận phản biện:</b> Giai đoạn 1954–1964 <b className="text-blue-300">không thể quy giản thành “nội chiến”</b>.
            Đây là một <b className="text-blue-300">cuộc đấu tranh giải phóng dân tộc</b> trong bối cảnh Chiến tranh Lạnh,
            nơi Hoa Kỳ đóng vai trò can thiệp quyết định ở miền Nam.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <ConclusionPoint title="Cơ sở pháp–chính trị sau Genève">
              Việt Nam là một quốc gia tạm thời chia cắt chờ tổng tuyển cử. Việc VNCH/Mỹ từ chối hiệp thương (1956) khiến tranh chấp kéo dài, không phải hai quốc gia độc lập quyết chiến.
            </ConclusionPoint>
            <ConclusionPoint title="Yếu tố quốc tế hóa quyết định">
              Viện trợ, cố vấn, “chiến tranh đặc biệt”, rồi sự kiện Vịnh Bắc Bộ 1964 mở đường cho Mỹ trực tiếp can thiệp, vượt xa mô hình “xung đột nội bộ thuần túy”.
            </ConclusionPoint>
          </div>
           <p className="mt-6 text-white/90 text-lg p-4 bg-black/20 rounded-xl">
            <b>→ Tóm lại:</b> Giai đoạn 1954–1964 là một <i className="font-semibold text-blue-300">xung đột chính trị–quân sự có thành tố nội bộ, nhưng được quốc tế hóa sâu sắc</i>, trong bối cảnh một quốc gia bị chia cắt tạm thời và đấu tranh hướng tới thống nhất.
          </p>
          <div className="mt-6 text-sm text-white/70">
            <span className="opacity-80">Nguồn tham chiếu: </span>
            <a className="underline decoration-dotted hover:text-white transition-colors" href={sources[0].url} target="_blank" rel="noreferrer">Loigiaihay</a>,{' '}
            <a className="underline decoration-dotted hover:text-white transition-colors" href={sources[3].url} target="_blank" rel="noreferrer">Wikipedia</a>,{' '}
            <a className="underline decoration-dotted hover:text-white transition-colors" href={sources[1].url} target="_blank" rel="noreferrer">Studocu</a>.
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const DebatePoint: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h3 className="text-xl font-semibold mb-3 tracking-tight text-blue-200">{title}</h3>
    <ul className="space-y-2 text-white/90 text-base">
      {children}
    </ul>
    <div className="mt-6 border-t border-white/10" />
  </div>
);

const ConclusionPoint: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-black/20 p-4 rounded-xl border border-white/10">
        <h4 className="font-semibold text-blue-300 mb-2">{title}</h4>
        <p className="text-white/80 text-sm leading-relaxed">{children}</p>
    </div>
);

// ========= Timeline Event =========
const TimelineEvent: React.FC<{
  event: EventItem; index: number; isActive: boolean; onHover: () => void; onLeave: () => void;
}> = ({ event, index, isActive, onHover, onLeave }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const isLeft = index % 2 === 0;

  const [expanded, setExpanded] = useState(false);
  const toggle = () => setExpanded((v) => !v);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -100 : 100 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      className={`relative mb-16 flex ${isLeft ? 'justify-end' : 'justify-start'} items-center`}
      onHoverStart={onHover}
      onHoverEnd={onLeave}
    >
      <motion.div className={`w-full max-w-md ${isLeft ? 'mr-8' : 'ml-8'}`} whileHover={{ scale: 1.03, y: -6 }}>
        <div className={`backdrop-blur-lg bg-gradient-to-br ${event.color} p-6 rounded-3xl shadow-2xl border border-white/20 relative overflow-hidden`}>
          <motion.div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl opacity-0" animate={{ opacity: isActive ? 1 : 0 }} transition={{ duration: 0.25 }} />
          <div className="relative z-10">
            {/* Header clickable */}
            <button
              onClick={toggle}
              aria-expanded={expanded}
              aria-controls={`${event.id}-details`}
              className="w-full text-left focus:outline-none focus:ring-2 focus:ring-white/60 rounded-xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-white whitespace-nowrap tabular-nums tracking-tight leading-none">
                  {formatEventYear(event)}
                </h3>
              </div>
              <h4 className="text-lg font-semibold text-white mb-1">{event.title}</h4>
              <p className="text-white/95 text-sm leading-relaxed">{event.description}</p>
            </button>

            {/* Collapsible details */}
            {event.details && (
              <div
                id={`${event.id}-details`}
                className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-[1000px] opacity-100 mt-3' : 'max-h-0 opacity-0'}`}
              >
                <div className="pt-2 border-t border-white/10 text-white/90 text-sm">
                  {typeof event.details === 'string' ? <p>{event.details}</p> : event.details}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full border-4 border-purple-500 shadow-lg z-20"
        animate={{ scale: isActive ? 1.4 : 1, boxShadow: isActive ? '0 0 22px rgba(147, 51, 234, 0.8)' : '0 0 0px rgba(147, 51, 234, 0)' }}
        transition={{ type: 'spring', stiffness: 300 }}
      />
    </motion.div>
  );
};

export default History;