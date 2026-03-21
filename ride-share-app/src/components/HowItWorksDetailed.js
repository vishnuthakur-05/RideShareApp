import React from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Car, CreditCard, Shield, Leaf, CheckCircle, Smartphone } from 'lucide-react';

const stepsData = [
    {
        id: '1',
        title: 'Create an Account',
        desc1: 'Join our trusted community by signing up as a passenger or a driver. It only takes a few seconds.',
        desc2: 'Verify your ID and phone number to help us keep the platform secure for everyone.',
        tag: 'Verified profiles for safety',
        Icon: Shield,
        img: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        reversed: true
    },
    {
        id: '2',
        title: 'Search or Post a Ride',
        desc1: 'Passengers: Simply enter your departure, destination, and travel date to find drivers going your way.',
        desc2: 'Drivers: Publish your ride in seconds. Set your route, price per seat, and how many passengers you can take. It\'s that easy.',
        tag: 'Smart matching technology',
        Icon: Search,
        img: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        reversed: false
    },
    {
        id: '3',
        title: 'Book or Accept a Ride',
        desc1: 'Once you find the perfect match, send a booking request. Drivers get notified instantly to confirm.',
        desc2: 'You\'ll receive all the details you need—pickup location, car details, and contact info—right in the app. Stay updated every step of the way.',
        tag: 'Instant notifications',
        Icon: CheckCircle,
        img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        reversed: true
    },
    {
        id: '4',
        title: 'Travel Together',
        desc1: 'Meet your co-travelers at the designated spot. Say hello, buckle up, and enjoy the ride!',
        desc2: 'Share stories, listen to music, or just relax. Traveling together isn\'t just about saving money; it\'s about making the journey more enjoyable and less lonely.',
        tag: 'Comfortable shared journeys',
        Icon: Car,
        img: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        reversed: false
    },
    {
        id: '5',
        title: 'Pay and Review',
        desc1: 'No need to fumble for cash. Payments are handled securely through the app after the trip.',
        desc2: 'Once you arrive, rate your experience. Your reviews help keep our community safe, reliable, and friendly for everyone.',
        tag: 'Secure cashless payments',
        Icon: CreditCard,
        img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        reversed: true
    }
];

const featuresData = [
    {
        title: 'Verified Users',
        desc: 'We verify every member to ensure a safe and trusted community.',
        Icon: Shield
    },
    {
        title: 'Eco-Friendly',
        desc: 'Reduce your carbon footprint by sharing a ride.',
        Icon: Leaf
    },
    {
        title: 'Seamless Booking',
        desc: 'Book in seconds and travel with ease.',
        Icon: Smartphone
    }
];

const HowItWorksDetailed = () => {
    return (
        <div className="bg-[#F3F5FB] min-h-screen py-24">
            {/* Header Title (optional since the wrapper page might have it, but good to ensure consistency) */}
            <div className="max-w-7xl mx-auto px-6 mb-24 text-center">
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#111827] mb-6 tracking-tight"
                >
                    Here's how we get you there
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-gray-500 max-w-2xl mx-auto font-medium"
                >
                    Five simple steps to connect, share costs, and make your journey better together.
                </motion.p>
            </div>

            <div className="max-w-7xl mx-auto px-6">
                
                {/* Alternating Steps Section */}
                <div className="space-y-32 mb-32">
                    {stepsData.map((step) => (
                        <motion.div 
                            key={step.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-24 ${step.reversed ? 'lg:flex-row-reverse' : ''}`}
                        >
                            {/* Image side */}
                            <div className="w-full lg:w-1/2">
                                <motion.div 
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.4 }}
                                    className="rounded-[2rem] overflow-hidden shadow-xl"
                                >
                                    <img 
                                        src={step.img} 
                                        alt={step.title} 
                                        className="w-full h-[350px] md:h-[450px] object-cover hover:scale-105 transition-transform duration-700"
                                    />
                                </motion.div>
                            </div>

                            {/* Text side */}
                            <div className="w-full lg:w-1/2 space-y-6">
                                <div className="flex items-center gap-6 mb-2">
                                    <div className="w-14 h-14 shrink-0 rounded-full bg-gray-200 text-[#111827] flex items-center justify-center text-xl font-bold shadow-sm">
                                        {step.id}
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] tracking-tight">{step.title}</h2>
                                </div>
                                
                                <p className="text-lg text-gray-600 leading-relaxed font-medium">
                                    {step.desc1}
                                </p>
                                <p className="text-lg text-gray-600 leading-relaxed font-medium">
                                    {step.desc2}
                                </p>
                                
                                <div className="pt-4 flex items-center gap-3">
                                    <step.Icon className="w-6 h-6 text-[#111827]" strokeWidth={2} />
                                    <span className="text-base font-bold text-[#111827]">{step.tag}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Trust Cards */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24"
                >
                    {featuresData.map((feature, idx) => (
                        <div key={idx} className="bg-[#0B132B] rounded-3xl p-10 flex flex-col items-center text-center shadow-lg hover:-translate-y-2 transition-transform duration-300 cursor-default">
                            <feature.Icon className="w-14 h-14 text-white mb-6" strokeWidth={1.5} />
                            <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                            <p className="text-gray-400 font-medium leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </motion.div>

                {/* CTA Section */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="text-center py-10"
                >
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] mb-8">Ready to hit the road?</h2>
                    <button className="bg-[#0B132B] hover:bg-gray-800 text-white font-bold py-4 px-10 rounded-full shadow-xl shadow-gray-400/30 transition-all hover:scale-105 active:scale-95 text-lg">
                        Start your journey today
                    </button>
                </motion.div>

            </div>
        </div>
    );
};

export default HowItWorksDetailed;
