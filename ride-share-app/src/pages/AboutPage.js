import React from 'react';
import Navbar from '../components/Navbar';
import AboutUs from '../components/AboutUs';
import Footer from '../components/Footer';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-[#EBEDF5]">
            <Navbar />
            <div className="pt-16">
                <AboutUs />
            </div>
            <Footer />
        </div>
    );
};

export default AboutPage;
