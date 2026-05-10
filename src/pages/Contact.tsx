import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import SEOHead from "@/components/SEOHead";

const Contact = () => {
  return (
    <>
      <SEOHead />
      <Navbar />
      <main className="min-h-screen bg-background">
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">تواصل معنا</h1>
            <p className="text-primary-foreground/80">نحن هنا لخدمتك على مدار الساعة</p>
          </div>
        </section>
        <ContactSection />
      </main>
      <Footer />
    </>
  );
};

export default Contact;
