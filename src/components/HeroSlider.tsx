import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { heroSlides } from "@/data/products";

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {heroSlides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-primary/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/45 to-primary/20" />

          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-2xl pt-20 md:pt-28 text-center md:text-right md:mr-8 lg:mr-20">
                <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-4 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-3xl text-primary-foreground/80 mb-10">
                  {slide.subtitle}
                </p>
                <Button asChild size="lg" variant="secondary" className="text-lg px-10 py-6 rounded-xl">
                  <Link to="/products">منتجاتنا</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default HeroSlider;
