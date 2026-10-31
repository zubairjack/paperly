import About from "@/components/landing/About";
import Features from "@/components/landing/Features";
import Hero from "@/components/landing/Hero";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Features />
        <About />
        <Footer />
      </main>
    </>
  );
}
