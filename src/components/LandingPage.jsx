import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, BarChart3, Zap, Lock, Mail, Github, Twitter, Sun, Moon, Linkedin } from 'lucide-react';
import Logo from './Logo';

const LandingPage = ({ onJoin }) => {
  const [isDark, setIsDark] = useState(() => {
    // Check system preference or localStorage
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    // Update HTML element class
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const features = [
    {
      icon: BarChart3,
      title: 'Real-time Tracking',
      description: 'See every transaction as it happens. Categorize automatically and stay on top of your budget.'
    },
    {
      icon: Zap,
      title: 'Smart Insights',
      description: 'Our AI analyzes your spending patterns to suggest where you can save and how to reach your goals faster.'
    },
    {
      icon: Lock,
      title: 'Bank-level Security',
      description: 'Your data is encrypted with the same technology used by global banks. Your privacy is our priority.'
    }
  ];

  const techStack = [
    { name: 'React', color: 'from-blue-400 to-blue-600', icon: '⚛️' },
    { name: 'Vite', color: 'from-purple-400 to-purple-600', icon: '⚡' },
    { name: 'Firebase', color: 'from-yellow-400 to-orange-600', icon: '🔥' },
    { name: 'Tailwind CSS', color: 'from-cyan-400 to-blue-600', icon: '🎨' },
    { name: 'Framer Motion', color: 'from-pink-400 to-rose-600', icon: '✨' },
    { name: 'Chart.js', color: 'from-green-400 to-emerald-600', icon: '📊' }
  ];

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      {/* Navbar */}
      <nav className="fixed w-full z-50 top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Logo size="medium" showText={true} />
            <div className="flex items-center gap-4">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all transform hover:scale-110"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun size={20} className="text-yellow-400" />
                ) : (
                  <Moon size={20} className="text-slate-700" />
                )}
              </button>
              <button 
                onClick={onJoin}
                className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all transform hover:scale-105"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-9xl font-extrabold tracking-tight leading-none mb-8 text-slate-900 dark:text-white"
          >
            Your Financial Ally
          </motion.h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-3xl mx-auto">
            Financy helps you track expenses, providing you insights on spending habits effortlessly.
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={onJoin}
              className="px-10 py-4 bg-blue-600 text-white text-lg font-bold rounded-full shadow-xl shadow-blue-600/30 flex items-center gap-2 hover:bg-blue-700 transition-all"
            >
              Get Started <span>→</span>
            </button>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(37, 99, 235, 0.2)" }}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl text-center hover:border-blue-600 dark:hover:border-blue-500 transition-all duration-75 cursor-pointer"
              >
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ duration: 0.2, type: 'spring', stiffness: 300 }}
                  className="bg-blue-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"
                >
                  <Icon size={32} className="text-white" />
                </motion.div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Engineering Spotlight Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="space-y-16">
          {/* Developer Spotlight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 md:p-12 backdrop-blur-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Profile Image */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="md:col-span-1 flex justify-center"
              >
                <div className="relative w-40 h-40 md:w-48 md:h-48">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl opacity-20"></div>
                  <div className="relative w-full h-full bg-gradient-to-br from-blue-100 dark:from-slate-700 to-blue-200 dark:to-slate-800 rounded-2xl flex items-center justify-center border-2 border-blue-600 dark:border-blue-500">
                    <span className="text-6xl">👨‍💻</span>
                  </div>
                </div>
              </motion.div>

              {/* Developer Info */}
              <div className="md:col-span-2 text-center md:text-left">
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-4xl md:text-5xl font-bold mb-2 text-slate-900 dark:text-white"
                >
                  Sarthak Mohite
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-lg md:text-xl text-blue-600 dark:text-blue-400 font-semibold mb-4"
                >
                  Computer Engineering Student
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-base md:text-lg text-slate-600 dark:text-slate-400 mb-6"
                >
                  D.Y. Patil Institute of Technology, Pune
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed"
                >
                  Passionate about building intuitive financial solutions. Full-stack developer focused on creating seamless user experiences with modern web technologies.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
                >
                  <a
                    href="https://www.linkedin.com/in/sarthak-mohite-508408377/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full flex items-center justify-center gap-2 transition-all transform hover:scale-105"
                  >
                    <Linkedin size={20} />
                    Connect on LinkedIn
                  </a>
                  <a
                    href="https://github.com/Sarthzk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white font-semibold rounded-full flex items-center justify-center gap-2 transition-all transform hover:scale-105"
                  >
                    <Github size={20} />
                    View Portfolio
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Tech Stack Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">
              Built With Modern Technology
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {techStack.map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ y: -8, scale: 1.05 }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center gap-3 hover:shadow-lg transition-all duration-75 cursor-pointer"
                >
                  <div className={`text-4xl bg-gradient-to-br ${tech.color} bg-clip-text`}>
                    {tech.icon}
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 text-center">
                    {tech.name}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Project Highlights & Tech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-20"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Project Highlights */}
              <div>
                <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Project Highlights</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold text-lg">✓</span>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">5+ Advanced Features</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Category Analytics, Monthly Trends, Budget Alerts, CSV Import, Enhanced Graphs</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold text-lg">✓</span>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Real-time Synchronization</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Firestore integration for live data updates across devices</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold text-lg">✓</span>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Bank-level Security</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Environment variables, secure authentication, encrypted data</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold text-lg">✓</span>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Responsive Design</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Mobile-first approach with professional UI/UX patterns</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tech Stack Details */}
              <div>
                <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Tech Stack</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'React 18.3', desc: 'UI Framework' },
                    { name: 'Vite 5.4', desc: 'Build Tool' },
                    { name: 'Firebase 10.8', desc: 'Backend & Auth' },
                    { name: 'Tailwind CSS', desc: 'Styling' },
                    { name: 'Chart.js', desc: 'Visualization' },
                    { name: 'Framer Motion', desc: 'Animations' }
                  ].map((tech, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ y: -4, boxShadow: "0 10px 25px rgba(37, 99, 235, 0.15)" }}
                      transition={{ duration: 0.2, type: 'spring', stiffness: 300 }}
                      className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700 cursor-pointer transition-all duration-75"
                    >
                      <p className="font-semibold text-sm text-slate-900 dark:text-white">{tech.name}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{tech.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Professional Portfolio Footer */}
      <footer className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border-t border-slate-200 dark:border-slate-800 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Contact CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 mb-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-3">Interested in My Work?</h3>
            <p className="text-blue-100 mb-6">Let's connect! I'm always open to opportunities and collaborations.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:mohitesarthak74@gmail.com"
                className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition-all transform hover:scale-105"
              >
                <span className="flex items-center justify-center gap-2">
                  <Mail size={20} />
                  Contact Me
                </span>
              </a>
              <a
                href="https://www.linkedin.com/in/sarthak-mohite-508408377/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full transition-all transform hover:scale-105"
              >
                <span className="flex items-center justify-center gap-2">
                  <Linkedin size={20} />
                  Connect on LinkedIn
                </span>
              </a>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              {/* Left - Brand */}
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Wallet size={24} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Financy</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Financial Management App</p>
                </div>
              </div>

              {/* Right - Copyright & Social */}
              <div className="text-center sm:text-right">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">&copy; 2026 Sarthak Mohite. All Rights Reserved.</p>
                <div className="flex gap-4 justify-center sm:justify-end">
                  <a href="mailto:mohitesarthak74@gmail.com" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                    <Mail size={20} />
                  </a>
                  <a href="https://www.linkedin.com/in/sarthak-mohite-508408377/" target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                    <Linkedin size={20} />
                  </a>
                  <a href="https://github.com/Sarthzk" target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                    <Github size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;