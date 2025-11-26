// src/components/landing/Landing.jsx
import Nav from "./Nav";
import Hero from "./Hero";
import SolutionsSection from "./Soluciones";
import ModulesSection from "./Modulos";
import PricingSection from "./Precios";
import SupportSection from "./Soporte";
import CTA from "./CTAA"; // tu CTA
import Footer from "./Footer";
import "./landing.css";
import Carros from "./Carros";

export default function Landing() {
  return (
    <>
      <Nav />
      <Hero />
      <SolutionsSection />
      <ModulesSection />
      <PricingSection />
      <SupportSection />
      <Carros />
      <CTA />
      <Footer />
    </>
  );
}
