import { motion } from "framer-motion";
import { Youtube, Send, Instagram, Heart } from "lucide-react";
import logoImg from "@/assets/alifer-logo.jpeg";

const FooterSection = () => (
  <footer id="footer" className="relative border-t border-border/30 py-12 px-4 overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-32 bg-primary/5 rounded-full blur-3xl" />

    <div className="container mx-auto relative z-10">
      <div className="grid md:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src={logoImg} alt="Alifer Academy" className="h-8 w-8 rounded-full object-cover" />
            <span className="font-display font-bold gradient-text">Alifer Academy</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Empowering students to achieve their dreams through quality education.
          </p>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground mb-3">Quick Links</h4>
          <div className="flex flex-col gap-2">
            {["Courses", "About", "Success Stories", "Contact"].map((l) => (
              <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">{l}</a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground mb-3">Exams</h4>
          <div className="flex flex-col gap-2">
            {["UPSC", "NDA", "GATE", "SSC CGL"].map((e) => (
              <span key={e} className="text-sm text-muted-foreground">{e}</span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground mb-3">Connect</h4>
          <div className="flex gap-3">
            {[
              { icon: Youtube, href: "https://youtube.com/@aliferacademy?si=lbb_DiDkJH2VVQuR", hoverColor: "hover:text-red-500 hover:border-red-500/30" },
              { icon: Send, href: "https://t.me/AliferAcademy", hoverColor: "hover:text-blue-400 hover:border-blue-400/30" },
              { icon: Instagram, href: "https://www.instagram.com/alifer_academy?igsh=enJpOWJ5Nmc2eWVx", hoverColor: "hover:text-pink-500 hover:border-pink-500/30" },
            ].map(({ icon: Icon, href, hoverColor }) => (
              <motion.a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                className={`w-10 h-10 rounded-xl bg-muted/50 border border-border/30 flex items-center justify-center text-muted-foreground transition-colors ${hoverColor}`}
              >
                <Icon className="h-5 w-5" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-border/30 pt-6 text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Alifer Academy. Made with <Heart className="inline h-3 w-3 text-red-500" /> for learners everywhere.
        </p>
      </div>
    </div>
  </footer>
);

export default FooterSection;
