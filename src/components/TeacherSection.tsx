import { motion } from "framer-motion";
import { Youtube, Send, Instagram, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import teacherImg from "@/assets/teacher-profile.jpg";

const socials = [
  { icon: Youtube, label: "YouTube", color: "hover:text-red-500", href: "https://youtube.com/@aliferacademy?si=lbb_DiDkJH2VVQuR" },
  { icon: Send, label: "Telegram", color: "hover:text-blue-400", href: "https://t.me/AliferAcademy" },
  { icon: Instagram, label: "Instagram", color: "hover:text-pink-500", href: "https://www.instagram.com/alifer_academy?igsh=enJpOWJ5Nmc2eWVx" },
];

const TeacherSection = () => (
  <section id="teacher" className="section-padding relative overflow-hidden">
    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
    <div className="container mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 animate-blob" />
            <img
              src={teacherImg}
              alt="Alifer Sir"
              className="relative z-10 w-full h-full object-cover rounded-full border-4 border-primary/20"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-primary text-sm font-medium tracking-wider uppercase">Featured Faculty</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-2 mb-4">
            Meet <span className="gradient-text">Alifer Sir</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Renowned educator at <strong className="text-foreground">DBUU Dehradun</strong> and <strong className="text-foreground">Sunya IAS</strong>. 
            With years of experience in competitive exam preparation, Alifer Sir has guided thousands of students 
            to crack UPSC, NDA, GATE and more with his unique teaching methodology.
          </p>

          <div className="flex flex-wrap gap-3">
            {socials.map((s) => (
              <Button
                key={s.label}
                variant="outline"
                className={`border-border text-muted-foreground ${s.color} transition-colors gap-2`}
                asChild
              >
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  <s.icon className="h-4 w-4" />
                  {s.label}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default TeacherSection;
