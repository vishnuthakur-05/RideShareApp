import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HowItWorksDetailed from '../components/HowItWorksDetailed';

const HowItWorksPage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-16">
                <HowItWorksDetailed />
            </main>
            <Footer />
        </div>
    );
};

export default HowItWorksPage;
