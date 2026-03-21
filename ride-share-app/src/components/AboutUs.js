import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Leaf, Heart, Eye } from 'lucide-react';

function useCounter(end, duration = 2, inView) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let startTime;
    let animationFrame;

    const updateCounter = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(ease * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCounter);
      }
    };

    animationFrame = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, inView]);

  return count;
}

const StatCard = ({ title, value, suffix = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const count = useCounter(value, 2.5, isInView);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-md border border-gray-100"
    >
      <div className="text-4xl md:text-5xl font-extrabold text-[#6366F1] mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm md:text-base font-medium text-[#111827] uppercase tracking-widest mt-2">
        {title}
      </div>
    </motion.div>
  );
};

const AboutUs = () => {
    return (
        <div className="bg-[#F3F5FB]">
            {/* Hero / Mission */}
            <section className="relative py-24 bg-gradient-to-b from-[#050B1C] to-[#0A1930] overflow-hidden text-center text-white min-h-[60vh] flex flex-col justify-center items-center">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542282088-fe8426682b8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80')] opacity-10 bg-cover bg-center"></div>
                <div className="relative z-10 max-w-4xl mx-auto px-6">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight"
                    >
                        Reimagining travel, <br/><span className="text-[#6366F1]">one shared ride at a time.</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
                    >
                        We believe that long-distance travel should be accessible, affordable, sustainable, and community-driven. By filling empty seats, we connect people and protect the planet.
                    </motion.p>
                </div>
            </section>

            {/* Story & Vision */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-[#111827] mb-8">Why We Started</h2>
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                        It began with a simple problem: millions of empty seats in cars traveling across the country, while millions of people were looking for affordable ways to reach the same destinations. The inefficiency was staggering, and the environmental impact was worse.
                    </p>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                        We built Smart Ride Share to bridge this gap. What started as a small community of commuters has grown into a nationwide movement.
                    </p>
                    <div className="p-8 bg-indigo-50 rounded-3xl border border-indigo-100">
                        <h3 className="text-xl font-bold text-[#6366F1] mb-2">Our Vision</h3>
                        <p className="text-lg text-[#111827] font-medium">To create the most trusted, sustainable, and connected shared mobility network in the world.</p>
                    </div>
                </div>
            </section>

            {/* Impact Stats */}
            <section className="py-24 bg-[#F3F5FB]">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-[#111827]">Our Impact So Far</h2>
                    <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg">Every shared ride takes a car off the road. Here is what we've achieved together.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Rides Shared" value={500000} suffix="+" />
                    <StatCard title="Tons CO₂ Saved" value={1200} />
                    <StatCard title="Cities Covered" value={150} suffix="+" />
                    <StatCard title={<>Community<br/>Rating</>} value={4.9} suffix="/5" />
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-[#111827]">Our Core Values</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: <Shield className="w-8 h-8 text-[#22C55E]" />, title: 'Safety First', desc: 'Rigorous verification and secure tech for complete peace of mind.' },
                            { icon: <Heart className="w-8 h-8 text-[#6366F1]" />, title: 'Community', desc: 'Connecting people through shared journeys and mutual respect.' },
                            { icon: <Leaf className="w-8 h-8 text-[#22C55E]" />, title: 'Sustainability', desc: 'Reducing emissions by optimizing empty seats on the road.' },
                            { icon: <Eye className="w-8 h-8 text-[#6366F1]" />, title: 'Transparency', desc: 'No hidden fees. Honest ratings. Clear policies for everyone.' }
                        ].map((val, i) => (
                            <motion.div 
                                key={i}
                                whileHover={{ y: -8 }}
                                className="p-8 bg-[#F3F5FB] rounded-2xl flex flex-col items-center text-center shadow-sm"
                            >
                                <div className="mb-4 bg-white p-3 rounded-full shadow-sm">{val.icon}</div>
                                <h3 className="text-xl font-bold text-[#111827] mb-3">{val.title}</h3>
                                <p className="text-gray-600">{val.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust & Policies */}
            <section className="py-16 bg-[#050B1C] text-center px-6">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-4">Committed to your Trust</h2>
                    <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                        We take your privacy and security seriously. Access our policies to learn more about how we protect your data and maintain community standards.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button className="px-6 py-3 bg-[#6366F1] text-white font-bold rounded-full hover:bg-indigo-500 transition-colors">
                            Trust & Safety Center
                        </button>
                        <button className="px-6 py-3 border border-gray-600 text-gray-300 font-bold rounded-full hover:text-white hover:border-white transition-colors">
                            Read our Policies
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;
