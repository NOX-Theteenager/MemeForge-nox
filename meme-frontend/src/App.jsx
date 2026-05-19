import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Image as ImageIcon } from 'lucide-react';
import MemeGenerator from './MemeGenerator';
import Gallery from './Gallery';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('generator');

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="navbar" id="main-nav">
        <div className="navbar-brand">
          <span className="navbar-logo">⚡ MèmeForge</span>
          <span className="navbar-badge">v2.0</span>
        </div>

        <div className="navbar-tabs">
          <button
            id="tab-generator"
            className={`navbar-tab ${activeTab === 'generator' ? 'active' : ''}`}
            onClick={() => setActiveTab('generator')}
          >
            <Sparkles size={16} />
            <span>Créateur</span>
          </button>
          <button
            id="tab-gallery"
            className={`navbar-tab ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            <ImageIcon size={16} />
            <span>Galerie</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <AnimatePresence mode="wait">
        {activeTab === 'generator' && (
          <motion.section
            key="hero"
            className="hero-section"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <span className="hero-emoji">🎨</span>
            <span className="hero-emoji">✨</span>
            <span className="hero-emoji">🤖</span>
            <span className="hero-emoji">🔥</span>
            <span className="hero-emoji">💜</span>
            <span className="hero-emoji">⚡</span>

            <motion.h1
              className="hero-title"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
            >
              <span className="hero-title-text">Crée ton Mème</span>
            </motion.h1>

            <motion.p
              className="hero-subtitle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              Propulsé par l'IA Gemini ✦ Détourage intelligent ✦ Export HD
            </motion.p>

            <motion.p
              className="hero-tagline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              Uploade ton image, laisse l'IA générer des textes hilarants, et télécharge ton chef-d'œuvre.
            </motion.p>
          </motion.section>
        )}

        {activeTab === 'gallery' && (
          <motion.section
            key="gallery-hero"
            className="hero-section"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <span className="hero-emoji">🖼️</span>
            <span className="hero-emoji">🏆</span>
            <span className="hero-emoji">😂</span>
            <span className="hero-emoji">🎭</span>
            <span className="hero-emoji">💎</span>
            <span className="hero-emoji">🌟</span>

            <motion.h1
              className="hero-title"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
            >
              <span className="hero-title-text">La Galerie</span>
            </motion.h1>

            <motion.p
              className="hero-subtitle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              Tes créations sauvegardées ✦ Revois tes chefs-d'œuvre
            </motion.p>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          {activeTab === 'generator' && (
            <motion.div
              key="generator"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <MemeGenerator />
            </motion.div>
          )}
          {activeTab === 'gallery' && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <Gallery />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        Fabriqué avec 💜 par <span>MèmeForge</span> — Projet Admission SUPINFO
      </footer>
    </div>
  );
}

export default App;