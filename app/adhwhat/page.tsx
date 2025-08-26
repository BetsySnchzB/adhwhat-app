'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Navigation from './components/Navigation';
import Footer from './components/Footer';

export default function LandingPage() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -50]);

  useEffect(() => {
    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navigation />
      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16 overflow-hidden">
        {/* Dynamic Floating Background Elements - Fresco Style */}
        
        {/* Large Morphing Blob */}
        <motion.div 
          className="absolute top-10 right-10 w-32 h-32 opacity-25"
          style={{ backgroundColor: '#87CEEB' }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            borderRadius: ['30%', '50%', '30%']
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Floating Gradient Orb */}
        <motion.div 
          className="absolute top-1/4 left-10 w-24 h-24 rounded-full opacity-35"
          style={{ 
            background: 'linear-gradient(45deg, #90EE90, #87CEEB)'
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        
        {/* Morphing Square to Circle */}
        <motion.div 
          className="absolute top-1/2 left-1/3 w-14 h-14 opacity-30"
          style={{ backgroundColor: '#FFFACD' }}
          animate={{
            borderRadius: ['0%', '50%', '0%'],
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 0.8, 1.2, 1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full opacity-60"
            style={{ 
              backgroundColor: i % 2 === 0 ? '#87CEEB' : '#90EE90',
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2
            }}
          />
        ))}
        
        {/* Gradient Wave Background */}
        <motion.div 
          className="absolute inset-0 opacity-15"
          style={{
            background: 'linear-gradient(45deg, #87CEEB, #90EE90, #DDA0DD, #FFFACD)',
            backgroundSize: '400% 400%'
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <div className="max-w-4xl mx-auto text-center z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1.2,
              type: "spring",
              stiffness: 100,
              damping: 10
            }}
            className="text-4xl sm:text-5xl lg:text-7xl font-black text-gray-900 leading-tight mb-6"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Finally… An ADHD-Friendly App That Helps You{' '}
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400"
              style={{
                background: 'linear-gradient(45deg, #87CEEB, #90EE90)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}
            >
              Stay On Track
            </motion.span>{' '}
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              (Without Stress!)
            </motion.span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 1.2,
              type: "spring",
              stiffness: 80
            }}
            className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            A fun, science-backed way to organize your tasks, boost your focus, and feel better every day.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.8, 
              delay: 1.5,
              type: "spring",
              stiffness: 120
            }}
          >
            <Link href="/auth">
              <motion.button 
                className="text-white text-xl font-bold py-4 px-8 rounded-full shadow-lg relative overflow-hidden"
                style={{
                  background: 'linear-gradient(45deg, #87CEEB, #90EE90)'
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 20px 40px rgba(135, 206, 235, 0.3)'
                }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    '0 10px 30px rgba(135, 206, 235, 0.2)',
                    '0 15px 40px rgba(144, 238, 144, 0.3)',
                    '0 10px 30px rgba(135, 206, 235, 0.2)'
                  ]
                }}
                transition={{
                  boxShadow: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                <motion.span
                  className="relative z-10"
                  animate={{
                    textShadow: [
                      '0 0 0px rgba(255,255,255,0)',
                      '0 0 10px rgba(255,255,255,0.5)',
                      '0 0 0px rgba(255,255,255,0)'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Start Organizing Now
                </motion.span>
                
                {/* Animated background overlay */}
                <motion.div
                  className="absolute inset-0 opacity-0"
                  style={{
                    background: 'linear-gradient(45deg, #90EE90, #DDA0DD)'
                  }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Benefit Snapshot Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F0F0F0' }}>
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-black text-center text-gray-900 mb-16"
          >
            Why Students Love A-D-H-WHAT?
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Visual Task View",
                description: "Daily planning tools that make sense to your ADHD brain",
                color: "#87CEEB"
              },
              {
                title: "Hormone Hacks",
                description: "Science-backed tips that actually work to boost your mood",
                color: "#90EE90"
              },
              {
                title: "Gentle Reminders",
                description: "Custom alerts that motivate instead of overwhelming",
                color: "#DDA0DD"
              },
              {
                title: "Study Buddy",
                description: "Your personal companion, not another boring to-do list",
                color: "#FFFACD"
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div 
                  className="w-16 h-16 rounded-full mb-4 flex items-center justify-center"
                  style={{ backgroundColor: benefit.color }}
                >
                  <div className="w-8 h-8 bg-white rounded-full opacity-80"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Happiness Hormone Section */}
      <section id="science" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-black text-center text-gray-900 mb-16"
          >
            The Science Behind Your Happiness
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                hormone: "Dopamine",
                description: "Complete a small task or organize your space",
                tip: "The reward chemical that keeps you motivated",
                color: "#87CEEB"
              },
              {
                hormone: "Serotonin", 
                description: "Get 10 minutes of sunlight or practice gratitude",
                tip: "The happiness chemical that stabilizes your mood",
                color: "#90EE90"
              },
              {
                hormone: "Oxytocin",
                description: "Text a friend or give someone a compliment",
                tip: "The love chemical that builds connections",
                color: "#DDA0DD"
              },
              {
                hormone: "Endorphins",
                description: "Watch something funny or dance to music",
                tip: "The natural high that reduces stress",
                color: "#FFFACD"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div 
                  className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: item.color }}
                >
                  <div className="text-2xl font-black text-gray-800">{item.hormone[0]}</div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.hormone}</h3>
                <p className="text-sm text-gray-500 mb-3">{item.tip}</p>
                <p className="text-gray-700 font-medium">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F0F0F0' }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-black text-gray-900 mb-16"
          >
            Real Students, Real Results
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <p className="text-lg text-gray-700 mb-6 italic">
                "I actually use this app every day – it helps me reset my brain without guilt. The hormone tips are game-changers!"
              </p>
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 rounded-full mr-4" style={{ backgroundColor: '#87CEEB' }}></div>
                <div>
                  <p className="font-bold text-gray-900">Sarah M.</p>
                  <p className="text-gray-500">Psychology Major</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <p className="text-lg text-gray-700 mb-6 italic">
                "Finally, an app that gets how my ADHD brain works. The visual planning and gentle reminders are perfect."
              </p>
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 rounded-full mr-4" style={{ backgroundColor: '#90EE90' }}></div>
                <div>
                  <p className="font-bold text-gray-900">Alex T.</p>
                  <p className="text-gray-500">Engineering Student</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Demo Section */}
      <section id="demo" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-black text-center text-gray-900 mb-16"
          >
            See A-D-H-WHAT? In Action
          </motion.h2>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Your ADHD-Friendly Dashboard</h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <div className="w-6 h-6 rounded-full mr-3" style={{ backgroundColor: '#87CEEB' }}></div>
                  <span className="text-lg text-gray-700">Visual task organizer with priority levels</span>
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-6 rounded-full mr-3" style={{ backgroundColor: '#90EE90' }}></div>
                  <span className="text-lg text-gray-700">Daily mood and energy check-ins</span>
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-6 rounded-full mr-3" style={{ backgroundColor: '#DDA0DD' }}></div>
                  <span className="text-lg text-gray-700">Personalized hormone-boosting tips</span>
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-6 rounded-full mr-3" style={{ backgroundColor: '#FFFACD' }}></div>
                  <span className="text-lg text-gray-700">Gentle progress tracking</span>
                </li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-100 to-green-100 p-8 rounded-3xl shadow-2xl">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-bold text-gray-900">Today's Tasks</h4>
                    <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#87CEEB' }}></div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: '#90EE90' }}></div>
                      <span className="text-gray-700">Review psychology notes</span>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: '#DDA0DD' }}></div>
                      <span className="text-gray-700">Submit assignment draft</span>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: '#FFFACD' }}></div>
                      <span className="text-gray-700">Call study group</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-6xl font-black text-gray-900 mb-8"
          >
            Ready to Feel Less Scattered and More in Control?
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 mb-8"
          >
            Join thousands of students who've transformed their ADHD experience
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href="/auth">
              <button 
                className="bg-gradient-to-r from-blue-400 to-green-400 text-white text-2xl font-bold py-6 px-12 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Start Free – No Credit Card Needed
              </button>
            </Link>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-gray-500 mt-6"
          >
            Science-backed • Student-tested • ADHD-approved
          </motion.p>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
