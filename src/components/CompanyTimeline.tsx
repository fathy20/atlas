import { motion } from "framer-motion";
import { Building2, Zap, Users, TrendingUp, Award, Store } from "lucide-react";

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const timelineEvents: TimelineEvent[] = [
  {
    year: "1988",
    title: "تأسيس الشركة",
    description:
      "تأسست الشركة على يد الحاج علي الشبو وأبناءه، حيث بدأت نشاطها في مجال بيع المستلزمات المنزلية والكهربائية.",
    icon: <Building2 size={22} />,
  },
  {
    year: "1990s",
    title: "التوسع والنمو",
    description:
      "واصلت الشركة مسيرة التطور والتوسع في السوق الليبي، وبناء سمعة قوية في مجال المستلزمات المنزلية والكهربائية.",
    icon: <TrendingUp size={22} />,
  },
  {
    year: "2003",
    title: "إطلاق النشاط الكهربائي",
    description:
      "تم إطلاق النشاط المتخصص في المستلزمات الكهربائية، ضمن خطة تطويرية تهدف إلى توسيع نطاق العمل وتلبية احتياجات السوق بشكل أفضل.",
    icon: <Zap size={22} />,
  },
  {
    year: "2010s",
    title: "بناء فريق الكفاءات",
    description:
      "تم بناء فريق من الكفاءات المؤهلة، الذين يسهمون في تقديم خدمات متميزة والحفاظ على جودة العمل والاستشارات الفنية.",
    icon: <Users size={22} />,
  },
  {
    year: "2020s",
    title: "التوسع إلى تسعة فروع",
    description:
      "أصبحت الشركة تضم اليوم تسعة فروع متخصصة في المجالين المنزلي والكهربائي، مع استيراد منتجات ذات جودة عالية ومتوسطة تناسب كافة شرائح العملاء.",
    icon: <Store size={22} />,
  },
  {
    year: "اليوم",
    title: "ريادة وجودة",
    description:
      "تعتمد الشركة على استيراد منتجات ذات جودة عالية ومتوسطة بما يتناسب مع متطلبات السوق، مع الالتزام بتقديم أفضل الخيارات التي تجمع بين الجودة والسعر المناسب.",
    icon: <Award size={22} />,
  },
];

const CompanyTimeline = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-semibold text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4">
            مسيرتنا
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            رحلة عراقة منذ <span className="text-primary">1988</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            من نشاط عائلي متواضع إلى صرح اقتصادي يضم تسعة فروع.. مسيرة بُنيت على الثقة والجودة
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Center Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary to-primary/20 hidden md:block" style={{ transform: 'translateX(-50%)' }} />
          {/* Mobile Line */}
          <div className="absolute right-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary to-primary/20 md:hidden" />

          <div className="space-y-8 md:space-y-12">
            {timelineEvents.map((event, index) => {
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: isLeft ? 60 : -60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="relative"
                >
                  {/* Desktop Layout */}
                  <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:gap-6 items-start">
                    {/* Left content or spacer */}
                    {isLeft ? (
                      <div className="text-left pt-2">
                        <TimelineCard event={event} align="left" />
                      </div>
                    ) : (
                      <div />
                    )}

                    {/* Center dot */}
                    <div className="relative z-10 flex items-start justify-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 ring-4 ring-background"
                      >
                        {event.icon}
                      </motion.div>
                    </div>

                    {/* Right content or spacer */}
                    {!isLeft ? (
                      <div className="text-right pt-2">
                        <TimelineCard event={event} align="right" />
                      </div>
                    ) : (
                      <div />
                    )}
                  </div>

                  {/* Mobile Layout */}
                  <div className="md:hidden flex gap-4 items-start pr-2">
                    {/* Mobile dot */}
                    <div className="relative z-10 flex-shrink-0">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.1, type: "spring", stiffness: 200 }}
                        className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 ring-4 ring-background"
                      >
                        {event.icon}
                      </motion.div>
                    </div>

                    {/* Mobile card */}
                    <div className="flex-1 pb-2">
                      <TimelineCard event={event} align="right" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* End dot */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: "spring" }}
            className="hidden md:flex absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary/20 items-center justify-center"
          >
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const TimelineCard = ({
  event,
  align,
}: {
  event: TimelineEvent;
  align: "left" | "right";
}) => (
  <motion.div
    whileHover={{ y: -3 }}
    transition={{ duration: 0.2 }}
    className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 group"
  >
    <div
      className={`flex items-center gap-2 mb-2 ${
        align === "right" ? "flex-row" : "flex-row-reverse"
      }`}
    >
      <span className="inline-block text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
        {event.year}
      </span>
    </div>
    <h3
      className={`text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {event.title}
    </h3>
    <p
      className={`text-sm text-muted-foreground leading-relaxed ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {event.description}
    </p>
  </motion.div>
);

export default CompanyTimeline;
