import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import DashboardPreview from "./components/DashboardPreview";
import Services from "./components/Services";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-ink">
      <Hero />
      <HowItWorks />
      <DashboardPreview />
      <Services />
      <Testimonials />
      {/* TODO: Pricing section */}
      <Footer />
    </main>
  );
}
