import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ExternalLink } from "lucide-react";

interface VideoCard {
  id: string;
  title: string;
  subject: string;
  duration: string;
  youtubeId: string | null; // null = placeholder/coming soon
  gradient: string;
  icon: string;
  accent: string;
}

const videoCards: VideoCard[] = [
  {
    id: "v1",
    title: "UPSC Polity - Constitution Basics",
    subject: "UPSC",
    duration: "45:12",
    youtubeId: "FJ4ltLZy3m4", // existing link
    gradient: "from-blue-800 via-indigo-900 to-purple-900",
    icon: "⚖️",
    accent: "#60a5fa",
  },
  {
    id: "v2",
    title: "NDA Mathematics - Trigonometry",
    subject: "NDA",
    duration: "38:55",
    youtubeId: null, // placeholder
    gradient: "from-orange-800 via-red-900 to-rose-900",
    icon: "🎖️",
    accent: "#fb923c",
  },
  {
    id: "v3",
    title: "GATE CSE - Data Structures",
    subject: "GATE",
    duration: "52:30",
    youtubeId: null, // placeholder
    gradient: "from-emerald-800 via-teal-900 to-cyan-900",
    icon: "💻",
    accent: "#34d399",
  },
  {
    id: "v4",
    title: "SSC CGL - Quantitative Aptitude",
    subject: "SSC",
    duration: "41:18",
    youtubeId: null, // placeholder
    gradient: "from-violet-800 via-purple-900 to-fuchsia-900",
    icon: "📊",
    accent: "#a78bfa",
  },
];

const VideoLightbox = ({ videoId, onClose }: { videoId: string; onClose: () => void }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", damping: 22 }}
        className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
        >
          <X size={18} />
        </button>
        <div className="aspect-video bg-black">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title="Demo Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

const DemoVideoSection = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const handlePlay = (card: VideoCard) => {
    if (card.youtubeId) {
      setActiveVideo(card.youtubeId);
    }
  };

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-medium tracking-wider uppercase">Demo Classes</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-2 mb-4">
            Watch How <span className="gradient-text">We Teach</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Experience our unique teaching methodology — watch free preview lectures before enrolling
          </p>
        </motion.div>

        {/* 2×2 Video Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {videoCards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="group cursor-pointer"
              onClick={() => handlePlay(card)}
            >
              <div className="glass-card overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                {/* Thumbnail */}
                <div
                  className={`relative aspect-video bg-gradient-to-br ${card.gradient} overflow-hidden`}
                >
                  {/* Grid lines */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
                      backgroundSize: "24px 24px",
                    }}
                  />
                  {/* Glow */}
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${card.accent}60 0%, transparent 70%)`,
                    }}
                  />
                  {/* Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                      className="text-4xl opacity-70"
                    >
                      {card.icon}
                    </motion.span>
                  </div>

                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      className="w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300"
                      style={{
                        background: card.youtubeId ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.25)",
                        border: card.youtubeId ? "none" : "2px solid rgba(255,255,255,0.4)",
                      }}
                    >
                      {card.youtubeId ? (
                        <Play
                          className="h-5 w-5 ml-0.5"
                          style={{ color: "#000" }}
                          fill="currentColor"
                        />
                      ) : (
                        <span className="text-white text-xs font-bold">Soon</span>
                      )}
                    </motion.div>
                  </div>

                  {/* Duration badge */}
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-xs font-mono">
                    {card.duration}
                  </div>

                  {/* Subject badge */}
                  <div
                    className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{
                      background: `${card.accent}25`,
                      color: card.accent,
                      border: `1px solid ${card.accent}40`,
                    }}
                  >
                    {card.subject}
                  </div>

                  {/* Coming soon overlay */}
                  {!card.youtubeId && (
                    <div className="absolute inset-0 bg-black/30 flex items-end p-2">
                      <span className="text-white/60 text-xs">📅 Coming Soon</span>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="p-4">
                  <h3 className="text-sm font-display font-semibold text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-2 mb-2">
                    {card.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Alifer Sir</span>
                    {card.youtubeId ? (
                      <motion.a
                        href={`https://youtube.com/watch?v=${card.youtubeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        YouTube
                      </motion.a>
                    ) : (
                      <span className="text-xs text-muted-foreground/50">Placeholder</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          🔗 More free lectures available on our{" "}
          <a
            href="https://youtube.com/@aliferacademy?si=lbb_DiDkJH2VVQuR"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            YouTube Channel
          </a>
        </motion.p>
      </div>

      {/* Lightbox */}
      {activeVideo && (
        <VideoLightbox videoId={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </section>
  );
};

export default DemoVideoSection;
