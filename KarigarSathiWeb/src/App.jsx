import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Professions from './components/Professions';
import HowItWorks from './components/HowItWorks';
import Screenshots from './components/Screenshots';
import Installation from './components/Installation';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      <Professions />
      <HowItWorks />
      <Screenshots />
      <Installation />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}