import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle, Mail } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const faqData = [
    {
        category: "Getting Started",
        items: [
            { q: "How do I create an account?", a: "Click on the 'Sign Up' button. You can register as a Passenger or a Driver by providing your email, setting a password, and completing a quick profile verification." },
            { q: "How does the platform work?", a: "We connect drivers with empty seats to passengers heading the same way. Simply search for a route, book your seat securely, and enjoy an affordable, eco-friendly ride." }
        ]
    },
    {
        category: "Rides & Bookings",
        items: [
            { q: "How do I book a ride?", a: "Enter your destination and date in the search bar. Browse available drivers, check their ratings and car details, and tap 'Book' to secure your seat." },
            { q: "Can I cancel my ride?", a: "Yes, you can cancel up to 24 hours before departure for a full refund. Cancellations made within 24 hours may incur a small fee to compensate the driver." },
            { q: "Are there rules for luggage or pets?", a: "Drivers specify their luggage capacity and pet policies on their ride listing. If you have oversized items, we recommend messaging the driver before booking." }
        ]
    },
    {
        category: "Payments & Pricing",
        items: [
            { q: "Are payment methods secure?", a: "Absolutely. We use industry-standard encryption for all transactions. You can pay via credit/debit card or digital wallets." },
            { q: "When do drivers get paid?", a: "Payments are held securely in escrow and automatically released to the driver's linked bank account once the trip is successfully completed." },
            { q: "How is pricing calculated?", a: "Drivers set the price per seat based on distance and fuel costs. We provide a recommended range to ensure fairness, plus a small service fee to maintain the platform." }
        ]
    },
    {
        category: "Safety & Verification",
        items: [
            { q: "How do you ensure safety?", a: "Safety is our priority. Every profile is verified via government ID, email, and phone number checks. Plus, our community rating system ensures accountability." },
            { q: "What should I do during an emergency?", a: "If you face an immediate emergency, always call local authorities (e.g., 911) first. For non-emergencies, you can reach our 24/7 dedicated support team through the app." },
            { q: "How do ratings work?", a: "After every trip, both passengers and drivers rate their experience out of 5 stars and leave a written review to build transparency in the community." }
        ]
    }
];

const FaqAccordion = ({ q, a, index }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`bg-white rounded-2xl mb-4 overflow-hidden transition-all duration-300 border ${isOpen ? 'border-[#6366F1] shadow-md ring-1 ring-indigo-500/10' : 'border-gray-100 hover:border-indigo-100 shadow-sm'}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-5 flex items-center justify-between focus:outline-none"
            >
                <div className="flex items-center text-left pr-4">
                    <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 transition-colors ${isOpen ? 'bg-[#6366F1] text-white' : 'bg-indigo-50 text-[#6366F1]'}`}>
                        {index + 1}
                    </span>
                    <span className={`text-lg font-bold transition-colors ${isOpen ? 'text-[#111827]' : 'text-gray-700'}`}>
                        {q}
                    </span>
                </div>
                <motion.div 
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-indigo-50' : 'bg-gray-50'}`}
                >
                    <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-[#6366F1]' : 'text-gray-400'}`} />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="px-6 pb-6 pt-0 ml-[3.25rem]">
                            <p className="text-gray-600 leading-relaxed">{a}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FaqPage = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const filters = ['All', 'Getting Started', 'Rides & Bookings', 'Payments & Pricing', 'Safety & Verification'];
    
    // Reference for the FAQ list container to enable smooth scroll on pill click
    const faqSectionRef = useRef(null);

    const handlePillClick = (filter) => {
        setActiveFilter(filter);
        if (faqSectionRef.current) {
            const yOffset = -100; // Account for fixed navbar
            const element = faqSectionRef.current;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({top: y, behavior: 'smooth'});
        }
    };

    return (
        <div className="min-h-screen bg-[#F3F5FB] flex flex-col">
            <Navbar />
            <main className="flex-grow pt-16">
                
                {/* Compact Glassmorphism Hero without Search Bar */}
                <section className="bg-[#050B1C] min-h-[50vh] md:min-h-[60vh] flex flex-col items-center justify-center relative overflow-hidden py-16 px-4 w-full">
                    {/* Ambient Background Glow Blobs */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <motion.div 
                            animate={{ 
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.5, 0.3],
                                x: [0, 50, 0],
                                y: [0, -50, 0]
                            }}
                            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-600/30 rounded-full blur-[120px]"
                        />
                        <motion.div 
                            animate={{ 
                                scale: [1, 1.5, 1],
                                opacity: [0.2, 0.4, 0.2],
                                x: [0, -50, 0],
                                y: [0, 50, 0]
                            }}
                            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute bottom-[-20%] right-[-10%] w-[35rem] h-[35rem] bg-violet-600/20 rounded-full blur-[100px]"
                        />
                    </div>

                    {/* Rich Glassmorphism Wrapper */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="relative z-10 w-full max-w-4xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 md:p-14 shadow-[0_0_50px_rgba(0,0,0,0.4)] shadow-indigo-500/20 flex flex-col items-center text-center mt-8"
                    >
                        {/* Heading */}
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-white drop-shadow-[0_0_20px_rgba(99,102,241,0.6)]"
                        >
                            Frequently Asked Questions
                        </motion.h1>
                        
                        {/* Subheading */}
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                            className="text-lg md:text-xl text-indigo-100/90 mb-12 max-w-2xl mx-auto font-medium"
                        >
                            Got questions? We've got answers to help you navigate your Smart Ride Share journey.
                        </motion.p>

                        {/* Animated Filter Pills Row */}
                        <motion.div 
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } }
                            }}
                            className="flex flex-wrap justify-center gap-3 w-full"
                        >
                            {filters.map((filter) => {
                                const isActive = activeFilter === filter;
                                return (
                                    <motion.button
                                        key={filter}
                                        variants={{
                                            hidden: { opacity: 0, y: 15 },
                                            visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
                                        }}
                                        whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)" }}
                                        whileTap={{ scale: 0.95 }}
                                        animate={{
                                            boxShadow: isActive ? [
                                                "0 0 15px rgba(99,102,241,0.6)",
                                                "0 0 25px rgba(99,102,241,0.8)",
                                                "0 0 15px rgba(99,102,241,0.6)"
                                            ] : "none"
                                        }}
                                        transition={{ boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
                                        onClick={() => handlePillClick(filter)}
                                        className={`px-6 py-3 rounded-full text-sm font-semibold transition-all border ${
                                            isActive 
                                            ? 'bg-[#6366F1] text-white border-indigo-500' 
                                            : 'bg-white/10 border-white/10 text-indigo-100 hover:bg-white/20 hover:text-white hover:border-white/20'
                                        }`}
                                    >
                                        {filter}
                                    </motion.button>
                                );
                            })}
                        </motion.div>
                    </motion.div>
                </section>

                {/* FAQ Accordions Section */}
                <section ref={faqSectionRef} className="py-20 px-6 max-w-4xl mx-auto scroll-mt-24">
                    {faqData
                        .filter(cat => activeFilter === 'All' || cat.category === activeFilter)
                        .map((categoryGroup, index) => (
                        <motion.div 
                            key={categoryGroup.category} 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5 }}
                            className="mb-12"
                        >
                            <h2 className="text-2xl font-extrabold text-[#111827] mb-6 inline-flex items-center gap-3">
                                <span className="w-8 h-1 bg-[#6366F1] rounded-full"></span>
                                {categoryGroup.category}
                            </h2>
                            <div>
                                {categoryGroup.items.map((item, idx) => (
                                    <FaqAccordion key={idx} q={item.q} a={item.a} index={idx} />
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </section>

                {/* Support CTA */}
                <section className="py-16 px-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto bg-white rounded-3xl p-10 md:p-16 text-center shadow-lg border border-gray-100 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 opacity-60"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-50 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2 opacity-60"></div>
                        
                        <h3 className="text-3xl font-extrabold text-[#111827] mb-4">Can't find what you're looking for?</h3>
                        <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
                            Our friendly support team is available 24/7 to help you resolve any issues.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button className="flex items-center justify-center px-8 py-4 bg-[#6366F1] hover:bg-indigo-500 text-white font-bold rounded-full shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5">
                                <MessageCircle className="w-5 h-5 mr-3" />
                                Contact Support
                            </button>
                            <button className="flex items-center justify-center px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-full hover:border-[#6366F1] hover:text-[#6366F1] transition-all hover:-translate-y-0.5">
                                <Mail className="w-5 h-5 mr-3" />
                                Email Help Center
                            </button>
                        </div>
                    </motion.div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default FaqPage;
