import React from 'react';
import Banner from '../components/Banner';
import Services from '../components/Services';
import FeaturedProducts from '../components/FeaturedProducts';
import AboutSection from '../components/AboutSection';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <Banner />
      <Services />
      <FeaturedProducts />
      <AboutSection />
    </div>
  );
};

export default Home; 