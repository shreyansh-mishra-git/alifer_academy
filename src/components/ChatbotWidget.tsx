import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Bot, User, RefreshCw } from "lucide-react";

interface Msg { role: "bot" | "user"; text: string }

const flow = [
  {
    id: "exam",
    question: "Hi! 👋 I'm Alifer Bot, your personal course advisor.\n\nWhat exam are you preparing for?",
    options: ["UPSC", "NDA", "GATE", "SSC", "Not sure yet"],
  },
  {
    id: "level",
    question: "Great choice! What's your current preparation level?",
    options: ["Beginner", "Intermediate", "Advanced", "Just exploring"],
  },
  {
    id: "budget",
    question: "What's your budget range for a course?",
    options: ["Under ₹2,000", "₹2,000 – ₹4,000", "₹4,000+", "Flexible"],
  },
  {
    id: "time",
    question: "How many hours can you dedicate daily?",
    options: ["1–2 hours", "3–4 hours", "5+ hours", "Weekends only"],
  },
];

type UserAnswers = {
  exam: string;
  level: string;
  budget: string;
  time: string;
};

const VALID_OPTIONS = new Set(flow.flatMap((f) => f.options));

function getRecommendation(answers: UserAnswers): string {
  const { exam, level, budget } = answers;

  const isLowBudget = budget === "Under ₹2,000";
  const isMedBudget = budget === "₹2,000 – ₹4,000";
  const isHighBudget = budget === "₹4,000+" || budget === "Flexible";

  if (exam === "UPSC") {
    if (isLowBudget)
      return "💡 For UPSC on a tight budget, start with our **UPSC Foundation** at ₹1,999 — the best value for complete prelims + mains coverage. We also offer EMI options!";
    if (isHighBudget || isMedBudget)
      return "🎯 Perfect match! Our **UPSC Foundation** at ₹4,999 (44% off ₹8,999) covers full prelims, mains & current affairs with live sessions.";
    return "🎯 I recommend our **UPSC Foundation** at ₹4,999 (44% off). Covers prelims, mains & current affairs!";
  }

  if (exam === "NDA") {
    if (level === "Beginner")
      return "🎖️ For NDA beginners, our **NDA Crash Course** at ₹1,999 is perfect — clear concept-building for Math & GAT, plus SSB interview prep.";
    if (level === "Advanced")
      return "🎖️ Since you're advanced, try our **NDA Crash Course** at ₹4,999 — focused revision with previous year papers and full mock test analysis.";
    return "🎖️ Great fit: **NDA Crash Course** at ₹4,999 (45% off). Full Math & GAT syllabus with mock tests!";
  }

  if (exam === "GATE") {
    if (level === "Beginner")
      return "💻 For GATE beginners: **GATE CSE Mastery** at ₹1,499 — starts from fundamentals with 10K+ practice problems and live doubt sessions.";
    if (level === "Advanced")
      return "💻 For GATE advanced learners: **GATE CSE Mastery** at ₹5,499 — intensive PYQ solving, topic-wise deep dive, and rank prediction tests.";
    return "💻 I recommend **GATE CSE Mastery** at ₹5,499 (45% off). Complete CS curriculum with PYQ solutions!";
  }

  if (exam === "SSC") {
    if (isLowBudget)
      return "📊 Amazing value: **SSC CGL Complete** at just ₹1,999 (50% off)! Covers Tier I & II — Quant, Reasoning & English.";
    return "📊 Great choice! **SSC CGL Complete** at ₹1,999 (50% off). Full Tier I & II prep with weekly mock tests!";
  }

  if (exam === "Not sure yet") {
    return "🤔 No worries! Our **UPSC Foundation** is our most popular course. But explore all our courses below and choose whatever fits your goal. We're here to help!";
  }

  return "🎯 Based on your profile, I'd suggest exploring our courses section below. Our team can help you pick the right one!";
}

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<UserAnswers>({ exam: "", level: "", budget: "", time: "" });
  const [messages, setMessages] = useState<Msg[]>([{ role: "bot", text: flow[0].question }]);
  const [typing, setTyping] = useState(false);
  const [done, setDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, typing]);

  const addBotMsg = (text: string, delay = 800): Promise<void> =>
    new Promise((resolve) => {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMessages((prev) => [...prev, { role: "bot", text }]);
        resolve();
      }, delay);
    });

  const handleOption = async (opt: string) => {
    // Guard: ensure option is valid
    if (!VALID_OPTIONS.has(opt)) {
      addBotMsg("⚠️ Please select a valid option from the choices above.");
      return;
    }

    // Record user message immediately
    setMessages((prev) => [...prev, { role: "user", text: opt }]);

    // Build updated answers synchronously (don't rely on stale state)
    const flowId = flow[step]?.id;
    const newAnswers: UserAnswers = {
      ...answers,
      [flowId]: opt,
    };
    setAnswers(newAnswers);

    const nextStep = step + 1;

    if (nextStep < flow.length) {
      await addBotMsg(flow[nextStep].question);
      setStep(nextStep);
    } else {
      // All questions answered — generate recommendation
      const rec = getRecommendation(newAnswers);
      await addBotMsg(rec);
      setTimeout(() => {
        addBotMsg("📚 Scroll to our Courses section to enroll, or click **Get Started** in the nav. Good luck! 🚀");
      }, 1200);
      setDone(true);
      setStep(nextStep);
    }
  };

  const reset = () => {
    setStep(0);
    setDone(false);
    setAnswers({ exam: "", level: "", budget: "", time: "" });
    setMessages([{ role: "bot", text: flow[0].question }]);
  };

  const currentOptions = !done && step < flow.length ? flow[step].options : [];

  return (
    <>
      {/* Floating button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        aria-label="Open course advisor chatbot"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl shadow-primary/30"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle size={22} />
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
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            className="fixed bottom-24 right-6 z-50 w-[22rem] flex flex-col overflow-hidden rounded-2xl border border-border/50 shadow-2xl shadow-background/50"
            style={{ maxHeight: "30rem", background: "var(--background)" }}
          >
            {/* Header */}
            <div
              className="p-4 border-b border-white/10 flex-shrink-0"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.7) 100%)" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-display font-semibold text-white text-sm">Alifer Bot</div>
                    <div className="text-xs text-white/70 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Online · Course Advisor
                    </div>
                  </div>
                </div>
                <button
                  onClick={reset}
                  title="Restart conversation"
                  className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <RefreshCw size={13} className="text-white" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-3"
              style={{ scrollbarWidth: "thin" }}
            >
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} items-end gap-2`}
                >
                  {m.role === "bot" && (
                    <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mb-0.5">
                      <Bot className="h-3.5 w-3.5 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] text-sm px-3.5 py-2.5 rounded-2xl leading-relaxed whitespace-pre-line ${m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                      }`}
                  >
                    {m.text}
                  </div>
                  {m.role === "user" && (
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mb-0.5">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2 items-end"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5">
                    {[0, 1, 2].map((d) => (
                      <motion.div
                        key={d}
                        className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.55, repeat: Infinity, delay: d * 0.15 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Option buttons */}
              {currentOptions.length > 0 && !typing && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-wrap gap-2 pl-8 pt-1"
                >
                  {currentOptions.map((opt) => (
                    <motion.button
                      key={opt}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleOption(opt)}
                      className="text-xs px-3 py-1.5 rounded-full border border-primary/35 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-150 font-medium"
                    >
                      {opt}
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {/* Restart button after completion */}
              {done && !typing && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pl-8 pt-1"
                >
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={reset}
                    className="text-xs px-4 py-1.5 rounded-full border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all duration-150 font-medium"
                  >
                    🔄 Start Over
                  </motion.button>
                </motion.div>
              )}
            </div>

            {/* Footer progress */}
            <div className="px-4 py-2.5 border-t border-border/30 flex-shrink-0 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {done ? "✅ Recommendation ready" : `Step ${Math.min(step + 1, flow.length)} of ${flow.length}`}
              </span>
              <div className="flex gap-1">
                {flow.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-300 ${i < step ? "w-4 bg-primary" : i === step && !done ? "w-4 bg-primary/50" : "w-2 bg-border"
                      }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;
