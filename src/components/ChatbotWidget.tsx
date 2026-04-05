import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Bot, User } from "lucide-react";

interface Msg { role: "bot" | "user"; text: string }

const flow = [
  { question: "Hi! 👋 I'm Alifer Bot, your personal course advisor. What exam are you preparing for?", options: ["UPSC", "NDA", "GATE", "SSC", "Not sure yet"] },
  { question: "What's your current preparation level?", options: ["Beginner", "Intermediate", "Advanced", "Just exploring"] },
  { question: "What's your budget range?", options: ["Under ₹2,000", "₹2,000 - ₹4,000", "₹4,000 - ₹6,000", "Flexible"] },
  { question: "How much time can you dedicate daily?", options: ["1-2 hours", "3-4 hours", "5+ hours", "Weekends only"] },
];

const recommendations: Record<string, string> = {
  UPSC: "🎯 Based on your profile, I recommend our **UPSC Foundation** course at ₹4,999 (44% off). It covers prelims, mains & current affairs!",
  NDA: "🎯 Perfect fit: **NDA Crash Course** at ₹2,999 (45% off). Full Math & GAT syllabus with mock tests!",
  GATE: "🎯 I recommend our **GATE CSE Mastery** at ₹5,499 (45% off). Complete CS curriculum with PYQ solutions!",
  SSC: "🎯 Great choice! **SSC CGL Complete** at ₹1,999 (50% off). Covers Tier I & II with quant, reasoning & English!",
};

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [exam, setExam] = useState("");
  const [messages, setMessages] = useState<Msg[]>([{ role: "bot", text: flow[0].question }]);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const addBotMsg = (text: string) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { role: "bot", text }]);
    }, 800);
  };

  const handleOption = (opt: string) => {
    if (step === 0) setExam(opt);
    const next = step + 1;
    setMessages((prev) => [...prev, { role: "user", text: opt }]);

    if (next < flow.length) {
      addBotMsg(flow[next].question);
      setStep(next);
    } else {
      const rec = recommendations[exam] || recommendations["UPSC"];
      addBotMsg(rec!);
      setTimeout(() => {
        addBotMsg("Scroll down to our courses section to enroll, or click Get Started for more info. Good luck! 🚀");
      }, 1800);
      setStep(next);
    }
  };

  const reset = () => {
    setStep(0);
    setExam("");
    setMessages([{ role: "bot", text: flow[0].question }]);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl shadow-primary/30"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle size={24} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse ring */}
        {!open && (
          <span className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-30" />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-80 max-h-[28rem] flex flex-col overflow-hidden rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl shadow-background/50"
          >
            {/* Header */}
            <div className="p-4 border-b border-border/30" style={{ background: "var(--gradient-primary)", opacity: 0.95 }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="font-display font-semibold text-primary-foreground text-sm">Alifer Bot</div>
                  <div className="text-xs text-primary-foreground/70 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online • Course Advisor
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} gap-2`}
                >
                  {m.role === "bot" && (
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="h-3.5 w-3.5 text-primary" />
                    </div>
                  )}
                  <div className={`max-w-[75%] text-sm px-3 py-2 rounded-2xl ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}>
                    {m.text}
                  </div>
                  {m.role === "user" && (
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 items-end">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="bg-muted px-4 py-2.5 rounded-2xl rounded-bl-sm flex gap-1">
                    {[0, 1, 2].map((d) => (
                      <motion.div
                        key={d}
                        className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: d * 0.15 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Options */}
              {step < flow.length && !typing && (
                <div className="flex flex-wrap gap-2 pl-8">
                  {flow[step].options.map((opt) => (
                    <motion.button
                      key={opt}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleOption(opt)}
                      className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      {opt}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Reset */}
              {step >= flow.length && !typing && (
                <div className="pl-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={reset}
                    className="text-xs px-3 py-1.5 rounded-full border border-accent/30 text-accent hover:bg-accent hover:text-accent-foreground transition-all"
                  >
                    Start over
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;
