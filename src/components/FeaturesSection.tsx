import { Shield, Truck, Headphones, LayoutGrid } from "lucide-react";
import { companyInfo } from "@/data/products";
import { motion } from "framer-motion";

const iconMap: Record<string, React.ElementType> = {
  shield: Shield,
  truck: Truck,
  headphones: Headphones,
  grid: LayoutGrid,
};

const FeaturesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">مميزاتنا</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">لماذا أطلس ؟</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {companyInfo.features.map((feature, i) => {
            const Icon = iconMap[feature.icon] || Shield;
            return (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-card rounded-lg p-6 text-center shadow-sm border border-border"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 + 0.2, type: "spring", stiffness: 200 }}
                  className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center"
                >
                  <Icon className="w-7 h-7 text-primary" />
                </motion.div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
