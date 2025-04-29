import { useEffect } from 'react';
import Hero from '../components/home/Hero';
import About from '../components/home/About';
import Services from '../components/home/Services';
import Projects from '../components/home/Projects';
import Testimonials from '../components/home/Testimonials';
import BlogPreview from '../components/home/BlogPreview';
import ContactCTA from '../components/home/ContactCTA';

const HomePage = () => {
  useEffect(() => {
    document.title = 'DOMUM Arquitectura | Estudio de Arquitectura';
  }, []);
  
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Projects />
      <Testimonials />
      <BlogPreview />
      <ContactCTA />
    </>
  );
};

export default HomePage;