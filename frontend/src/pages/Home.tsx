import HomeHeader from '../components/home/HomeHeader';
import HeroSection from '../components/home/HeroSection';
import CryptoHighlights from '../components/home/CryptoHighlights';
import FeaturesSection from '../components/home/FeaturesSection';
import AboutSection from '../components/home/AboutSection';
import AuthPreviewSection from '../components/home/AuthPreviewSection';
import FAQSection from '../components/home/FAQSection';
import HomeFooter from '../components/home/HomeFooter';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-950 overflow-x-hidden">
      <HomeHeader />
      <HeroSection />
      <CryptoHighlights />
      <FeaturesSection />
      <AboutSection />
      <AuthPreviewSection />
      <FAQSection />
      <HomeFooter />
    </div>
  );
};

export default Home;
