import About from "@/components/About";
import Approach from "@/components/Approach";
import Capabilities from "@/components/Capabilities";
import Contact from "@/components/Contact";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Products from "@/components/Products";
import SelectedWork from "@/components/SelectedWork";
import WhatWeBuild from "@/components/WhatWeBuild";
import WhyRAIQEN from "@/components/WhyRAIQEN";

export default function Home() {
  return (
    <main id="top" className="relative">
      <div className="grain" aria-hidden="true" />
      <Navbar />
      <Hero />
      <WhatWeBuild />
      <SelectedWork />
      <Capabilities />
      <Approach />
      <Products />
      <About />
      <WhyRAIQEN />
      <FAQ />
      <CTA />
      <Contact />
      <Footer />
    </main>
  );
}
