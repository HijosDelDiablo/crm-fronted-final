import Hero from "./Hero";
import Features from "./Features";
import IASection from "./IASection";
import CTA from "./CTAA";
import Footer from "./Footer";

import "./landing.css";
import { useAuth } from "../../hooks/useAuth";

const Landing = ()=> {
  //test
 
  const { user, isLoggedIn } = useAuth();
  console.log("Landing user:", user);
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

export default Landing;
