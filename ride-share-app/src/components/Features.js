import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Wallet, Leaf, Shield, Zap, CheckCircle2 } from 'lucide-react';
import RoleSelectionModal from './RoleSelectionModal';

const Features = () => {
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
      setIsRoleModalOpen(false);
      navigate(`/signup?role=${role}`);
  };
  const benefits = [
    { icon: <Wallet className="w-8 h-8 text-[#6366F1]" />, title: 'Save Money', desc: 'Split costs and travel for a fraction of the price.' },
    { icon: <Leaf className="w-8 h-8 text-[#22C55E]" />, title: 'Eco-Friendly', desc: 'Reduce your carbon footprint by sharing rides.' },
    { icon: <Shield className="w-8 h-8 text-[#22C55E]" />, title: 'Verified Users', desc: 'All profiles and IDs are strictly verified.' },
    { icon: <Zap className="w-8 h-8 text-[#6366F1]" />, title: 'Seamless Booking', desc: 'Find and book your ride in just a few taps.' }
  ];

  return (
    <div className="bg-[#F3F5FB]">
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-[#111827]">Why Travel With Us</h2>
            </div>
            <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={{
                visible: { transition: { staggerChildren: 0.2 } },
                hidden: {}
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
                {benefits.map((benefit, idx) => (
                    <motion.div
                    key={idx}
                    variants={{
                        hidden: { opacity: 0, y: 30 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                    }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all border border-gray-100 flex flex-col items-center text-center group"
                    >
                        <div className="p-4 rounded-full bg-slate-50 mb-6 group-hover:scale-110 transition-transform">
                            {benefit.icon}
                        </div>
                        <h3 className="text-xl font-bold text-[#111827] mb-2">{benefit.title}</h3>
                        <p className="text-gray-500">{benefit.desc}</p>
                    </motion.div>
                ))}
            </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="lg:w-1/2">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-6">Safety & Trust First</h2>
                    <p className="text-lg text-gray-600 mb-8">
                        We prioritize your security above everything else. With verified profiles, secure payments, and active community monitoring, every journey is a safe journey.
                    </p>
                    <ul className="space-y-4 mb-8">
                        {['Verified Profiles & IDs', 'Secure In-App Payments', 'Community Reviews & Ratings', '24/7 Support'].map((item, i) => (
                            <motion.li 
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center space-x-3"
                            >
                                <CheckCircle2 className="w-6 h-6 text-[#22C55E]" />
                                <span className="text-[#111827] font-medium">{item}</span>
                            </motion.li>
                        ))}
                    </ul>
                </div>
                <div className="lg:w-1/2 relative">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-[#050B1C] rounded-3xl p-8 text-white shadow-2xl relative z-10"
                    >
                        <div className="absolute -top-6 -right-6 bg-[#22C55E] text-white px-6 py-3 rounded-full font-bold shadow-xl animate-bounce">
                            4.9/5 Safety Score
                        </div>
                        <p className="text-xl italic mb-6 text-gray-300">"The safest and most reliable carpooling app I've ever used. The verified profiles give me complete peace of mind."</p>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-600 rounded-full bg-cover" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80)'}} />
                            <div>
                                <h4 className="font-bold">Sarah Jenkins</h4>
                                <p className="text-sm text-gray-400">142 rides shared</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-[#050B1C] to-indigo-950 text-center text-white">
        <div className="max-w-4xl mx-auto px-4">
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl font-bold mb-6"
            >
                Ready to hit the road?
            </motion.h2>
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-xl text-gray-300 mb-10"
            >
                Sign up in minutes. It's free.
            </motion.p>
            <motion.button 
                onClick={() => setIsRoleModalOpen(true)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#6366F1] hover:bg-indigo-500 text-white px-10 py-4 rounded-full font-bold text-lg shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all animate-pulse"
            >
                Start your journey today
            </motion.button>
        </div>
      </section>
      <RoleSelectionModal
          isOpen={isRoleModalOpen}
          onClose={() => setIsRoleModalOpen(false)}
          onSelectRole={handleRoleSelect}
      />
    </div>
  );
};

export default Features;
