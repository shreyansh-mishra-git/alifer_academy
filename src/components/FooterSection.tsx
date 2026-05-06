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
              { 
                icon: () => (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                ), 
                href: "https://wa.me/919760293095", 
                hoverColor: "hover:text-green-500 hover:border-green-500/30" 
              },
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
