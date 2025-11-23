import Hero from "./Hero";
import Features from "./Features";
import IASection from "./IASection";
import CTA from "./CTAA";
import Nav from "./Nav";

import Footer from "./Footer";

import "./landing.css";

const Landing = () => {
  return (
    <>
      <Nav />
      <Hero />
      <Features />
      <IASection />
      <CTA />
      <Footer />
    </>
  );
}

export default Landing;
