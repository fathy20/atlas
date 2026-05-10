import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { companyInfo } from "@/data/products";
import { motion } from "framer-motion";

const ContactSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">تواصل معنا</h2>
          <p className="text-muted-foreground">نحن هنا لخدمتك</p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <motion.a 
              href={`tel:${companyInfo.phone}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="flex items-center gap-4 p-5 bg-card rounded-lg border border-border hover:shadow-sm transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">هاتف</p>
                <p className="font-semibold text-foreground" dir="ltr">{companyInfo.phone}</p>
              </div>
            </motion.a>

            <motion.a 
              href={`mailto:${companyInfo.email}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="flex items-center gap-4 p-5 bg-card rounded-lg border border-border hover:shadow-sm transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">إيميل</p>
                <p className="font-semibold text-foreground">{companyInfo.email}</p>
              </div>
            </motion.a>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center gap-4 p-5 bg-card rounded-lg border border-border sm:col-span-2"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">العنوان</p>
                <p className="font-semibold text-foreground">{companyInfo.address}</p>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center"
          >
            <Button asChild size="lg" className="gap-2">
              <a href={`https://wa.me/${companyInfo.whatsapp}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={20} />
                تواصل عبر واتساب
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
