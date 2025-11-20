import Hero from "./Hero";
import Features from "./Features";
import IASection from "./IASection";
import CTA from "./CTAA";
import Footer from "./Footer";

import "./landing.css";

export default function Landing() {
  //test
  // No se como obtener el user desde aqui
  return (
    <>
      <Hero />
      <Features />
      <IASection />
      <CTA />
      <Footer />
    </>
  );
}
