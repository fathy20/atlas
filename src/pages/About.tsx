import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import CompanyTimeline from "@/components/CompanyTimeline";
import { companyInfo } from "@/data/products";
import { motion } from "framer-motion";

const About = () => {
  return (
    <>
      <SEOHead />
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              مسيرة عراقة.. ورؤية نحو المستقبل
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-primary-foreground/80 max-w-2xl mx-auto"
            >
              {companyInfo.fullName}
            </motion.p>
          </div>
        </section>

        {/* Company Timeline */}
        <CompanyTimeline />

        {/* Content - Vision & Mission */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-3"
              >
                <h2 className="text-2xl font-bold text-foreground">رؤيتنا ورسالتنا</h2>
                <p className="text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground">رؤيتنا:</span> أن نكون الوجهة الأولى والموثوقة في ليبيا
                  لتوريد الحلول الكهربائية والأجهزة المنزلية العالمية، مع الحفاظ على قيمنا الأصيلة في التعامل والخدمة.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground">رسالتنا:</span> تمكين عملائنا من الحصول على أفضل
                  المنتجات العالمية التي تجمع بين التكنولوجيا المتطورة والجودة العالية، وتوفيرها بأسعار تنافسية تناسب
                  كافة شرائح المجتمع.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-3"
              >
                <h2 className="text-2xl font-bold text-foreground">لماذا نحن؟ (التزامنا بالجودة)</h2>
                <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc pr-5">
                  <li>
                    <span className="font-semibold text-foreground">انتقاء الجودة:</span> نستورد منتجاتنا بعناية فائقة،
                    حيث نوفر خيارات تتراوح بين الجودة العالية والمتوسطة لنلبي احتياجات مختلف الميزانيات دون المساومة
                    على معايير الأمان والسلامة.
                  </li>
                  <li>
                    <span className="font-semibold text-foreground">الوكالة الرسمية:</span> بصفتنا وكلاء لماركات عالمية
                    مرموقة، نضمن لعملائنا الحصول على المنتجات الأصلية مباشرة من المصنع، مع كافة الضمانات الفنية
                    المطلوبة.
                  </li>
                  <li>
                    <span className="font-semibold text-foreground">فريقنا هو قوتنا:</span> يعمل لدينا فريق من الكفاءات
                    والخبراء المؤهلين الذين يسهرون على تقديم الاستشارات الفنية وخدمات ما بعد البيع لضمان رضاكم التام.
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-3"
              >
                <h2 className="text-2xl font-bold text-foreground">قيمنا الثابتة</h2>
                <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc pr-5">
                  <li>
                    <span className="font-semibold text-foreground">الأمانة:</span> نلتزم بالشفافية المطلقة في مواصفات
                    منتجاتنا.
                  </li>
                  <li>
                    <span className="font-semibold text-foreground">التطوير:</span> نسعى دائماً لجلب أحدث ما توصلت إليه
                    التكنولوجيا الكهربائية العالمية إلى السوق الليبي.
                  </li>
                  <li>
                    <span className="font-semibold text-foreground">الشراكة:</span> لا نعتبر زبائننا مجرد مشترين، بل
                    شركاء نجاح ننمو معهم وبهم.
                  </li>
                </ul>
              </motion.div>

              <motion.blockquote
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="border-r-4 border-primary pr-4 text-foreground font-medium leading-relaxed"
              >
                "منذ جيلين، ونحن نضيء بيوت ليبيا ومشاريعها.. ملتزمون بالأصل، ومتطلعون دائماً للأفضل."
              </motion.blockquote>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {companyInfo.stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center"
                >
                  <p className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-primary-foreground/70">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default About;
