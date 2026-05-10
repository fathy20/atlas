import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import bannerVideo from "../../video.mp4";

const BannerSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Video */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="bg-muted rounded-lg aspect-[4/3] flex items-center justify-center overflow-hidden"
          >
            <video
              src={bannerVideo}
              className="w-full h-full object-cover rounded-lg"
              controls
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            >
              متصفحك لا يدعم تشغيل الفيديو.
            </video>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              من نخدم؟
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              نقدّم حلولًا ومنتجاتٍ متكاملة تلبي احتياجات الشركات والمصانع والمتاجر بكفاءة واحترافية.
              <br />
              <br />
              بدءًا من أنظمة الإضاءة الاحترافية وصولًا إلى الأجهزة المنزلية عالية الجودة، نوفّر كل ما تحتاجه لتطوير بيئتك التجارية والارتقاء بمساحات العمل والمعيشة بأعلى معايير الجودة.
            </p>
            <Button asChild variant="default">
              <Link to="/about">معرفه المزيد</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
