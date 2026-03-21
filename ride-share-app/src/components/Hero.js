import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import RoleSelectionModal from './RoleSelectionModal';

const Hero = () => {
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
      setIsRoleModalOpen(false);
      navigate(`/signup?role=${role}`);
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <>
      <div className="relative w-full min-h-[90vh] flex items-center justify-center bg-[#050B1C] overflow-hidden pt-16">
      {/* Background Image & Gradient */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1421&q=80)' }}
        animate={{ scale: 1.05 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050B1C] via-[#050B1C]/70 to-transparent" />

      {/* Content */}
      <motion.div 
        className="relative z-10 max-w-4xl mx-auto px-6 text-center text-[#F9FAFB]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Share the Journey. <br/><span className="text-[#6366F1]">Save the Planet.</span>
        </motion.h1>
        <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Connect with verified drivers and passengers for affordable, secure, and eco-friendly long-distance travel.
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <motion.button 
            onClick={() => setIsRoleModalOpen(true)}
            whileHover={{ scale: 1.05, boxShadow: '0px 0px 15px rgba(99, 102, 241, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto px-8 py-4 bg-[#6366F1] hover:bg-indigo-500 text-white font-semibold rounded-full transition-colors shadow-lg shadow-indigo-500/20"
          >
            Start your journey
          </motion.button>
          <motion.button 
            onClick={() => navigate('/how-it-works')}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white/30 hover:border-white text-white font-semibold rounded-full transition-all"
          >
            How it works
          </motion.button>
        </motion.div>

        <motion.div variants={itemVariants} className="flex items-center justify-center gap-2 text-sm text-gray-400 font-medium tracking-wide">
          <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
          Trusted by 10,000+ riders • <span className="text-[#22C55E]">4.9/5 safety score</span>
        </motion.div>
      </motion.div>
      </div>
      <RoleSelectionModal
          isOpen={isRoleModalOpen}
          onClose={() => setIsRoleModalOpen(false)}
          onSelectRole={handleRoleSelect}
      />
    </>
  );
};

export default Hero;
