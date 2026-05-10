import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSlider from "@/components/HeroSlider";
import BrandsShowcase from "@/components/BrandsShowcase";
import BannerSection from "@/components/BannerSection";
import StatsSection from "@/components/StatsSection";
import FeaturesSection from "@/components/FeaturesSection";
import ContactSection from "@/components/ContactSection";
import SEOHead from "@/components/SEOHead";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const Index = () => {
  return (
    <>
      <SEOHead />
      <Navbar />
      <main>
        <HeroSlider />
        <BrandsShowcase />
        <BannerSection />
        <StatsSection />
        <FeaturesSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
};

export default Index;
