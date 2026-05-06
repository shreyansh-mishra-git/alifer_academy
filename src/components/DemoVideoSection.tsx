import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ExternalLink, Clock, Youtube } from "lucide-react";

interface DemoVideo {
  id: string;
  title: string;
  subject: string;
  duration: string;
  videoId: string;
  accent: string;
  badge: string;
}

// ── Real YouTube video IDs ──────────────────────────────────────────────────
// Thumbnail URL pattern: https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg
const demoVideos: DemoVideo[] = [
  {
    id: "dv1",
    title: "UPS-IAS-L-0-Introduction to Syllabus of Mathematics Optional For UPSC IAS&IFoS",
    subject: "UPSC",
    duration: "24 min",
    videoId: "Hl8L_hElCgo",
    accent: "#60a5fa",
    badge: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  },
  {
    id: "dv2",
    title: "Complex Analysis UPSC 2020",
    subject: "UPSC",
    duration: "18 min",
    videoId: "DZ1P0bPjZEc",
    accent: "#fb923c",
    badge: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  },
  {
    id: "dv3",
    title: "Linear Algebra UPSC PYQ 2014",
    subject: "UPSC PYQ",
    duration: "28 min",
    videoId: "UXmGpjIq6HE",
    accent: "#34d399",
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  {
    id: "dv4",
    title: "Calculus L 1 Syllabus Introduction (Part 1)",
    subject: "Engineering",
    duration: "21 min",
    videoId: "LZE7GusKF6c",
    accent: "#a78bfa",
    badge: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  },
];

// ── Lightbox / Modal ─────────────────────────────────────────────────────────
const VideoModal = ({
  video,
  onClose,
}: {
  video: DemoVideo;
  onClose: () => void;
}) => (
  <AnimatePresence>
    <motion.div
      key="backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

      {/* Modal panel */}
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 24 }}
        transition={{ type: "spring", damping: 22, stiffness: 260 }}
        className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
        >
          <X size={18} />
        </button>

        {/* Video title bar */}
        <div className="absolute top-0 left-0 right-0 z-10 px-4 py-3 bg-gradient-to-b from-black/80 to-transparent">
          <p className="text-white text-sm font-semibold pr-10 leading-tight">
            {video.title}
          </p>
        </div>

        {/* Embedded player */}
        <div className="aspect-video bg-black">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

// ── Video Card ───────────────────────────────────────────────────────────────
const VideoCard = ({
  video,
  index,
  onPlay,
}: {
  video: DemoVideo;
  index: number;
  onPlay: () => void;
}) => {
  const thumbnailUrl = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;

  return (
    <motion.div
      key={video.id}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6, transition: { duration: 0.22 } }}
      className="group cursor-pointer"
      onClick={onPlay}
    >
      <div
        className="glass-card overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
        style={{ borderTop: `2px solid ${video.accent}30` }}
      >
        {/* ── Thumbnail ── */}
        <div className="relative aspect-video overflow-hidden bg-black">
          {/* Real YouTube thumbnail */}
          <img
            src={thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Dark gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

          {/* Subject badge – top-left */}
          <div className="absolute top-2.5 left-2.5">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full border ${video.badge}`}
            >
              {video.subject}
            </span>
          </div>

          {/* Duration badge – bottom-right */}
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded bg-black/75 text-white text-xs font-mono">
            <Clock className="h-3 w-3 opacity-70" />
            {video.duration}
          </div>

          {/* Centred play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.18 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
              style={{
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(8px)",
                boxShadow: `0 0 28px ${video.accent}60`,
              }}
            >
              <Play
                className="h-6 w-6 ml-0.5"
                style={{ color: "#111" }}
                fill="currentColor"
              />
            </motion.div>
          </div>
        </div>

        {/* ── Card Footer ── */}
        <div className="p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-display font-semibold text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-2 mb-2 sm:mb-3">
            {video.title}
          </h3>

          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] sm:text-xs text-muted-foreground truncate">Alifer Sir</span>

            <motion.a
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              whileHover={{ scale: 1.06 }}
              className="flex items-center gap-1 text-[10px] sm:text-xs text-red-500 font-medium hover:text-red-400 transition-colors flex-shrink-0"
            >
              <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              YouTube
            </motion.a>
          </div>

          {/* Accent underline on hover */}
          <div
            className="mt-3 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-full"
            style={{ background: video.accent }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// ── Section ──────────────────────────────────────────────────────────────────
const DemoVideoSection = () => {
  const [activeVideo, setActiveVideo] = useState<DemoVideo | null>(null);

  return (
    <section id="demo" className="section-padding relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto">
        {/* ── Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-medium tracking-wider uppercase">
            Demo Classes
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-2 mb-4">
            Watch How <span className="gradient-text">We Teach</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Experience our unique teaching methodology — watch free preview
            lectures before enrolling.
          </p>
        </motion.div>

        {/* ── 4-column Grid ── */}
        {/* Desktop: 4 columns | Tablet: 2 | Mobile: 1 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {demoVideos.map((video, i) => (
            <VideoCard
              key={video.id}
              video={video}
              index={i}
              onPlay={() => setActiveVideo(video)}
            />
          ))}
        </div>

        {/* ── Bottom CTA note ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2 mt-10 text-sm text-muted-foreground"
        >
          <Youtube className="h-4 w-4 text-red-500" />
          More free lectures on our{" "}
          <a
            href="https://youtube.com/@aliferacademy?si=lbb_DiDkJH2VVQuR"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            YouTube Channel
          </a>
        </motion.div>
      </div>

      {/* ── Video Modal ── */}
      {activeVideo && (
        <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </section>
  );
};

export default DemoVideoSection;
