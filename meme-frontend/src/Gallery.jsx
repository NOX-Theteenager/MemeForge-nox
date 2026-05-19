import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMemes } from './api';
import { RefreshCw } from 'lucide-react';

const API_URL = 'http://noxmeme.duckdns.org';

export default function Gallery() {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeme, setSelectedMeme] = useState(null);

  const fetchMemes = async () => {
    setLoading(true);
    try {
      const data = await getMemes();
      setMemes(data || []);
    } catch (error) {
      console.error('Erreur chargement galerie:', error);
      setMemes([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMemes();
  }, []);

  return (
    <div>
      {/* Refresh Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
        <motion.button
          className="action-btn btn-ai"
          onClick={fetchMemes}
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ padding: '8px 16px', fontSize: '13px' }}
          id="btn-refresh-gallery"
        >
          <motion.span
            animate={loading ? { rotate: 360 } : {}}
            transition={loading ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
          >
            <RefreshCw size={16} />
          </motion.span>
          {loading ? 'Chargement...' : 'Rafraîchir'}
        </motion.button>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="gallery-grid">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="skeleton"
              style={{ aspectRatio: '1', borderRadius: 'var(--radius-lg)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            />
          ))}
        </div>
      ) : memes.length === 0 ? (
        <div className="gallery-empty">
          <motion.span
            className="gallery-empty-emoji"
            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            🏜️
          </motion.span>
          <p className="gallery-empty-title">Aucun mème sauvegardé</p>
          <p className="gallery-empty-hint">
            Crée ton premier mème et sauvegarde-le ici !
          </p>
        </div>
      ) : (
        <div className="gallery-grid">
          <AnimatePresence>
            {memes.map((meme, index) => (
              <motion.div
                key={meme.id || index}
                className="gallery-item"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.06, type: 'spring', stiffness: 200 }}
                onClick={() => setSelectedMeme(meme)}
                whileHover={{ y: -8 }}
                id={`gallery-item-${meme.id || index}`}
              >
                <img
                  src={`${API_URL}${meme.image_url}`}
                  alt={meme.top_text || 'Mème'}
                  loading="lazy"
                />
                <div className="gallery-item-overlay">
                  {meme.top_text && (
                    <p className="gallery-item-text">{meme.top_text}</p>
                  )}
                  {meme.bottom_text && (
                    <p className="gallery-item-text" style={{ fontSize: '13px', opacity: 0.8 }}>
                      {meme.bottom_text}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedMeme && (
          <motion.div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(10, 10, 26, 0.9)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '24px',
              cursor: 'pointer'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMeme(null)}
            id="gallery-lightbox"
          >
            <motion.div
              style={{
                position: 'relative',
                maxWidth: '90vw',
                maxHeight: '85vh',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: '2px solid var(--border-medium)',
                boxShadow: 'var(--shadow-lg), var(--shadow-glow)'
              }}
              initial={{ scale: 0.5, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`${API_URL}${selectedMeme.image_url}`}
                alt={selectedMeme.top_text || 'Mème'}
                style={{
                  display: 'block',
                  maxWidth: '90vw',
                  maxHeight: '85vh',
                  objectFit: 'contain'
                }}
              />
              {selectedMeme.top_text && (
                <h2 className="meme-text meme-text-top">{selectedMeme.top_text}</h2>
              )}
              {selectedMeme.bottom_text && (
                <h2 className="meme-text meme-text-bottom">{selectedMeme.bottom_text}</h2>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
