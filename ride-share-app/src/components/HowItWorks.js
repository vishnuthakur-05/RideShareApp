import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, CheckCircle, Car, Users, Wallet } from 'lucide-react';

// Data strictly matching the requested copy + pill tags
const flows = {
  passenger: [
    {
      id: 1,
      step: "Step 1",
      title: "Find the perfect ride",
      desc: "Enter your destination and browse trusted drivers heading your exact way.",
      tag: "Route-based matching",
      icon: Search,
      color: "indigo"
    },
    {
      id: 2,
      step: "Step 2",
      title: "Book securely instantly",
      desc: "Review driver profiles, choose your perfect seat, and pay securely in-app.",
      tag: "Instant confirmation",
      icon: CheckCircle,
      color: "indigo"
    },
    {
      id: 3,
      step: "Step 3",
      title: "Enjoy the journey",
      desc: "Meet your driver at the pickup point, sit back, relax, and save money!",
      tag: "Verified Safety",
      icon: MapPin,
      color: "indigo"
    }
  ],
  driver: [
    {
      id: 1,
      step: "Step 1",
      title: "Publish your empty seats",
      desc: "Going somewhere? Share your route, preferences, and price per seat in seconds.",
      tag: "Smart pricing",
      icon: Car,
      color: "violet"
    },
    {
      id: 2,
      step: "Step 2",
      title: "Review and accept",
      desc: "Get booking requests. Review passenger profiles and ratings before accepting.",
      tag: "Vetted community",
      icon: Users,
      color: "violet"
    },
    {
      id: 3,
      step: "Step 3",
      title: "Drive and get paid",
      desc: "Drop off your passengers and receive your payout directly to your bank account.",
      tag: "Zero cash hassle",
      icon: Wallet,
      color: "green"
    }
  ]
};

const HowItWorksCard = ({ step, title, desc, tag, Icon, color, index }) => {
  // Mapping color configurations based on the flow
  const colorMap = {
    indigo: {
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      border: "hover:border-indigo-400",
      shadow: "hover:shadow-[0_20px_40px_-10px_rgba(99,102,241,0.2)]",
      tagBg: "bg-indigo-100",
      tagText: "text-indigo-800"
    },
    violet: {
      bg: "bg-violet-50",
      text: "text-violet-600",
      border: "hover:border-violet-400",
      shadow: "hover:shadow-[0_20px_40px_-10px_rgba(139,92,246,0.2)]",
      tagBg: "bg-violet-100",
      tagText: "text-violet-800"
    },
    green: {
      bg: "bg-green-50",
      text: "text-green-600",
      border: "hover:border-green-400",
      shadow: "hover:shadow-[0_20px_40px_-10px_rgba(34,197,94,0.2)]",
      tagBg: "bg-green-100",
      tagText: "text-green-800"
    }
  };

  const scheme = colorMap[color];

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
      }}
      whileHover={{ y: -8 }}
      className={`relative bg-white rounded-3xl p-8 md:p-10 shadow-sm transition-all duration-300 border border-gray-100 flex flex-col items-center text-center group ${scheme.border} ${scheme.shadow}`}
    >
      {/* Icon Container with interactive animation */}
      <motion.div 
        className={`w-20 h-20 rounded-2xl ${scheme.bg} ${scheme.text} flex items-center justify-center mb-8 shadow-inner`}
        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
        transition={{ duration: 0.4 }}
      >
        <Icon className="w-10 h-10" />
      </motion.div>

      {/* Text Content */}
      <span className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-3">{step}</span>
      <h3 className="text-2xl font-extrabold text-[#111827] mb-4">{title}</h3>
      <p className="text-gray-500 font-medium leading-relaxed mb-8 flex-grow">{desc}</p>

      {/* Feature Pill */}
      <div className="mt-auto">
        <span className={`inline-block px-4 py-2 rounded-full text-xs font-bold font-mono tracking-tight ${scheme.tagBg} ${scheme.tagText}`}>
          {tag}
        </span>
      </div>
    </motion.div>
  );
};

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState('passenger');

  return (
    <section className="py-24 bg-gradient-to-b from-[#F3F5FB] to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-extrabold text-[#111827] sm:text-5xl mb-6 tracking-tight"
          >
            How Smart Ride Share Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-500"
          >
            Seamless journeys, whether you're behind the wheel or enjoying the view.
          </motion.p>
        </div>

        {/* Passenger/Driver Toggle Switch */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-16"
        >
          <div className="bg-gray-100 p-1.5 rounded-full flex shadow-inner relative items-center">
            {/* The sliding active background */}
            <motion.div 
              className="absolute top-1.5 bottom-1.5 w-40 bg-white rounded-full shadow-md z-0"
              animate={{ left: activeTab === 'passenger' ? '6px' : 'calc(100% - 160px - 6px)' }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
            
            <button
              onClick={() => setActiveTab('passenger')}
              className={`w-40 py-3 rounded-full text-sm font-bold z-10 transition-colors ${
                activeTab === 'passenger' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Passenger Focus
            </button>
            <button
              onClick={() => setActiveTab('driver')}
              className={`w-40 py-3 rounded-full text-sm font-bold z-10 transition-colors ${
                activeTab === 'driver' ? 'text-violet-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Driver Focus
            </button>
          </div>
        </motion.div>

        {/* Animated Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab} // Using key prevents React from keeping the elements instantly, forcing exit/enter animations
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { 
                opacity: 1, x: 0, 
                transition: { staggerChildren: 0.15, duration: 0.4 } 
              },
              exit: { opacity: 0, x: 20, transition: { duration: 0.2 } }
            }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {flows[activeTab].map((item, index) => (
              <HowItWorksCard 
                key={item.id}
                step={item.step}
                title={item.title}
                desc={item.desc}
                tag={item.tag}
                Icon={item.icon}
                color={item.color}
                index={index}
              />
            ))}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};

export default HowItWorks;
