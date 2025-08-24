// History.tsx — Timeline + Actors + Debate + Conclusion + Sources (1954–1964)
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { askGemini } from '../../app/modules/chatbot';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom'; // NEW: đọc hash để cuộn và quay lại

// ========= Types =========
type SourceRef = { label: string; url: string };
type Actor = { id: string; name: string; role: string; summary: string; highlights: string[] };
type EventItem = {
  id: string; year: number; title: string; description: string; color: string; sources?: SourceRef[];
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

  const timelineEvents: EventItem[] = useMemo(
    () => [
      { id: 'geneva-1954', year: 1954, title: 'Hiệp định Genève', description: 'Đình chỉ chiến sự; giới tuyến quân sự tạm thời; dự kiến tổng tuyển cử thống nhất.', color: 'from-blue-500 ', sources: [sources[3]] },
      { id: 'election-1956', year: 1956, title: 'Bế tắc hiệp thương – tổng tuyển cử', description: 'VNCH/Mỹ không hiệp thương tổng tuyển cử (1956) → bế tắc thống nhất.', color: 'from-blue-500', sources: [sources[3]] },
      { id: 'shift-1959', year: 1959, title: 'Chuyển pha đấu tranh ở miền Nam', description: 'Chuẩn bị tổ chức lực lượng chính trị–quân sự ở MN.', color: 'from-blue-500', sources: [sources[2]] },
      { id: 'nlf-1960', year: 1960, title: 'Thành lập Mặt trận DTGP MN', description: '12/1960 thành lập; 1961 hình thành Quân Giải phóng MN.', color: 'from-blue-500', sources: [sources[3]] },
      { id: 'specialwar-1961-64', year: 1961, title: '“Chiến tranh đặc biệt”', description: 'Khung tác chiến: cố vấn–viện trợ Mỹ, quân VNCH; ấp chiến lược.', color: 'from-blue-500', sources: [sources[3]] },
      { id: 'crisis-1963', year: 1963, title: 'Khủng hoảng 1963 & đảo chính', description: 'Biến cố Phật giáo; lật đổ Ngô Đình Diệm.', color: 'from-blue-500', sources: [sources[3]] },
      { id: 'tonkin-1964', year: 1964, title: 'Sự kiện Vịnh Bắc Bộ', description: '8/1964: Nghị quyết Vịnh Bắc Bộ → mở đường cho can dự trực tiếp của Hoa Kỳ.', color: 'from-blue-500', sources: [sources[3]] },
    ],
    [sources]
  );

  const actors: Actor[] = useMemo(
    () => [
      { id: 'north', name: 'Miền Bắc (VNDCCH)', role: 'Hậu phương chiến lược', summary: 'Xây dựng CNXH ở MB; chi viện MN; mục tiêu thống nhất.', highlights: ['Hai nhiệm vụ chiến lược (ĐH III, 1960)', 'Hậu phương quyết định', 'Mục tiêu độc lập–thống nhất'] },
      { id: 'south', name: 'Miền Nam (VNCH)', role: 'Chính thể tại MN', summary: 'Nhà nước tại MN, nhận viện trợ/cố vấn Mỹ; bình định; khủng hoảng 1963.', highlights: ['Cố vấn/viện trợ Hoa Kỳ', 'Ấp chiến lược', 'Khủng hoảng 1963'] },
      { id: 'nlf', name: 'Mặt trận DTGP MN / QGP', role: 'Tổ chức chính trị–quân sự ở MN', summary: 'Thành lập 1960; QGP 1961; lực lượng đấu tranh tại MN.', highlights: ['MTDTGP 1960', 'QGP 1961', 'Hoạt động chính trị–quân sự'] },
      { id: 'us', name: 'Hoa Kỳ', role: 'Tác nhân quốc tế', summary: 'Từ viện trợ–cố vấn đến “chiến tranh đặc biệt”, rồi bước ngoặt 1964.', highlights: ['Cố vấn/viện trợ', 'Chiến tranh đặc biệt', 'Vịnh Bắc Bộ 1964'] },
    ],
    []
  );

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 12 } } };

  return (
    <motion.div ref={containerRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative min-h-screen overflow-hidden">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-20 bg-white/20 hover:bg-white/30 text-white font-semibold px-5 py-2 rounded-xl shadow-lg backdrop-blur border border-white/30 transition-all duration-200"
        style={{ backdropFilter: 'blur(6px)' }}
      >
        ← Quay lại
      </button>
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
        <motion.div className="backdrop-blur-lg bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl" whileHover={{ scale: 1.02 }}>
          <h2 className="text-2xl font-bold text-white mb-6 text-center"> Hỏi nhanh AI </h2>
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
      <motion.div className="relative z-10 max-w-6xl mx-auto px-4 pb-10" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <motion.h2 className="text-4xl font-bold text-white text-center mb-8" variants={itemVariants}> Tác nhân chính</motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {actors.map((a, i) => (
            <motion.div key={a.id} variants={itemVariants} className="backdrop-blur-lg bg-white/10 rounded-3xl p-6 border border-white/20 text-white" whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 200 }}>
              <h3 className="text-xl font-semibold mb-1">{a.name}</h3>
              <p className="text-sm text-blue-200 mb-3">{a.role}</p>
              <p className="text-white/90 text-sm mb-3">{a.summary}</p>
              <ul className="text-sm space-y-1 list-disc list-inside text-white/80">
                {a.highlights.map((h) => <li key={h}>{h}</li>)}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Debate */}
      <motion.div id="debate" className="relative z-10 max-w-6xl mx-auto px-4 pb-16" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <motion.h2 className="text-4xl font-bold text-white text-center mb-8" variants={itemVariants}> Tranh luận: 1954–1964 có phải “nội chiến”?</motion.h2>
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div className="backdrop-blur-lg bg-white/10 rounded-3xl p-6 border border-white/20 text-white" variants={itemVariants}>
            <h3 className="text-xl font-semibold mb-2">Khung định nghĩa (tóm lược)</h3>
            <p className="text-white/90 text-sm">“Nội chiến”: xung đột vũ trang giữa các lực lượng có tổ chức trong cùng một quốc gia để tranh chấp quyền lực nhà nước; có thể có can thiệp ngoài, nhưng nếu mức độ can thiệp quyết định cục diện thì bản chất vượt ra ngoài “nội chiến thuần túy”.</p>
            <h4 className="mt-4 font-semibold">Dữ kiện đối chiếu</h4>
            <ul className="list-disc list-inside text-white/90 text-sm space-y-1">
              <li>Genève 1954: chia cắt <i>tạm thời</i>, dự kiến tổng tuyển cử thống nhất.</li>
              <li>VNCH/Mỹ không hiệp thương 1956 → bế tắc thống nhất.</li>
              <li>MTDTGP 1960; QGP 1961 (thành tố nội bộ ở MN).</li>
              <li>“Chiến tranh đặc biệt” & Vịnh Bắc Bộ 1964 → quốc tế hóa sâu sắc.</li>
            </ul>
          </motion.div>
          <motion.div className="backdrop-blur-lg bg-white/10 rounded-3xl p-6 border border-white/20 text-white" variants={itemVariants}>
            <h3 className="text-xl font-semibold mb-2">Kết luận biện luận (ngắn gọn)</h3>
            <p className="text-white/90 text-sm leading-relaxed">
              Gọi 1954–1964 là “nội chiến” là phiến diện. Hợp lý hơn: xung đột chính trị–quân sự có thành tố nội bộ ở miền Nam, nhưng quốc tế hóa sâu — trong bối cảnh một quốc gia tạm bị chia cắt và mục tiêu thống nhất được xác lập rõ trong đường lối chính thức.
            </p>
            <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
              <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                <div className="font-semibold">Phía ủng hộ “nội chiến”</div>
                <ul className="list-disc list-inside text-white/80">
                  <li>Hai chính thể & lực lượng vũ trang người Việt đối đầu tại MN.</li>
                  <li>Giao tranh chủ yếu trên lãnh thổ miền Nam.</li>
                </ul>
              </div>
              <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                <div className="font-semibold">Phản biện “không thuần nội chiến”</div>
                <ul className="list-disc list-inside text-white/80">
                  <li>Genève: một quốc gia tạm chia, chờ tổng tuyển cử.</li>
                  <li>Can dự quốc tế mang tính quyết định (1961–1964, 1964).</li>
                  <li>Mục tiêu thống nhất toàn quốc trong đường lối chính thức.</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* NEW: Conclusion */}
      <motion.div id="conclusion" className="relative z-10 max-w-5xl mx-auto px-4 pb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-8 border border-white/20 text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-3"> Kết luận</h2>
          <p className="text-white/90 leading-relaxed text-lg">
            Dựa trên các dữ kiện cốt lõi, <b>giai đoạn 1954–1964 không phải “nội chiến” theo nghĩa hẹp</b>. Lý do:
          </p>
          <ul className="list-disc list-inside mt-3 space-y-2 text-white/90">
            <li><b>Cơ sở pháp–chính trị sau Genève:</b> Việt Nam là <i>một quốc gia tạm thời chia cắt</i> chờ tổng tuyển cử thống nhất; việc phía VNCH/Mỹ không hiệp thương (1956) làm bế tắc tiến trình thống nhất.</li>
            <li><b>Quốc tế hóa quyết định:</b> Vai trò cố vấn/viện trợ của Hoa Kỳ trong khuôn khổ “chiến tranh đặc biệt” (1961–1964) và bước ngoặt <i>Vịnh Bắc Bộ 1964</i> vượt khỏi mô hình “xung đột nội bộ thuần túy”.</li>
            <li><b>Đường lối chính thức:</b> Xác định mục tiêu độc lập–thống nhất của <i>toàn quốc</i>, miền Bắc là hậu phương quyết định, miền Nam quyết định trực tiếp.</li>
          </ul>
          <p className="mt-4 text-white/80">
            Vì vậy, mô tả phù hợp hơn là: <i>xung đột chính trị–quân sự có thành tố nội bộ ở miền Nam, nhưng được quốc tế hóa sâu sắc</i>.
          </p>
          <div className="mt-5 text-sm text-white/80">
            <span className="opacity-80">Nguồn tham chiếu nhanh: </span>
            <a className="underline decoration-dotted hover:opacity-90" href={sources[0].url} target="_blank" rel="noreferrer">Loigiaihay (Đường lối 1954–1964)</a>,{' '}
            <a className="underline decoration-dotted hover:opacity-90" href={sources[3].url} target="_blank" rel="noreferrer">Wikipedia (1954–1959…)</a>,{' '}
            <a className="underline decoration-dotted hover:opacity-90" href={sources[1].url} target="_blank" rel="noreferrer">Studocu (tranh luận)</a>.
          </div>
        </div>
      </motion.div>

      {/* Sources */}
      <motion.div className="relative z-10 max-w-6xl mx-auto px-4 pb-24" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <motion.h2 className="text-3xl font-bold text-white text-center mb-6" variants={itemVariants}> Nguồn tham khảo (Version 1)</motion.h2>
        <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-6 border border-white/20 text-white">
          <ul className="list-disc list-inside space-y-2 text-white/90">
            {sources.map((s) => (
              <li key={s.url}><a href={s.url} className="underline decoration-dotted hover:opacity-90" target="_blank" rel="noreferrer">{s.label}</a></li>
            ))}
          </ul>
          <p className="text-xs text-white/70 mt-4">Gợi ý nâng cấp: bổ sung tài liệu ngoại giao gốc, báo cáo học thuật, niên giám quân sự để tăng độ tin cậy.</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ========= Timeline Event =========
const TimelineEvent: React.FC<{
  event: EventItem; index: number; isActive: boolean; onHover: () => void; onLeave: () => void;
}> = ({ event, index, isActive, onHover, onLeave }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const isLeft = index % 2 === 0;

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
            <div className="flex items-center gap-3 mb-2">
              {/* <span className="text-2xl">{event.icon}</span> */}
              <h3 className="text-2xl font-bold text-white">{event.year}</h3>
            </div>
            <h4 className="text-lg font-semibold text-white mb-1">{event.title}</h4>
            <p className="text-white/95 text-sm leading-relaxed">{event.description}</p>
            {event.sources && event.sources.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {event.sources.map((s) => (
                  <a key={s.url} href={s.url} target="_blank" rel="noreferrer" className="text-xs px-2 py-1 rounded-full bg-white/20 border border-white/30 hover:bg-white/30">Nguồn</a>
                ))}
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
