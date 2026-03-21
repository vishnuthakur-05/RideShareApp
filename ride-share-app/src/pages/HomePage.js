import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import Footer from '../components/Footer';

const HomePage = () => {
    return (
        <div className="min-h-screen bg-[#EBEDF5]">
            <Navbar />
            <Hero />
            <HowItWorks />
            <Features />
            <Footer />
        </div>
    );
};

export default HomePage;
