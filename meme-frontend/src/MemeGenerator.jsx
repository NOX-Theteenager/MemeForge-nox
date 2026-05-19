import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import { generateCaption, removeBackground, saveMeme } from './api';
import {
  Wand2,
  Eraser,
  Download,
  ImagePlus,
  Save,
  Sparkles,
  Type,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyEnd,
  Settings2
} from 'lucide-react';
import Toast from './Toast';

export default function MemeGenerator() {
  const [image, setImage] = useState(null);
  const [rawFile, setRawFile] = useState(null);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [toasts, setToasts] = useState([]);

  const memeRef = useRef(null);
  const fileInputRef = useRef(null);

  // Toast system
  const addToast = useCallback((message, type = 'info', icon = '💬') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, icon }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  // Image upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      addToast('Ce fichier n\'est pas une image !', 'error', '🚫');
      return;
    }
    setRawFile(file);
    setImage(URL.createObjectURL(file));
    addToast('Image chargée avec succès !', 'success', '🖼️');
  };

  // Drag & Drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  // AI Caption Generation
  const handleAIGeneration = async () => {
    if (!rawFile) {
      addToast('Uploade une image d\'abord !', 'error', '⚠️');
      return;
    }
    setLoading(true);
    setLoadingAction('ai');
    try {
      const data = await generateCaption(rawFile);
      setTopText(data.top_text);
      setBottomText(data.bottom_text);
      addToast('Gemini a parlé ! 🧠', 'success', '✨');
    } catch (error) {
      console.error(error);
      addToast('Erreur de génération IA', 'error', '💥');
    }
    setLoading(false);
    setLoadingAction('');
  };

  // Background Removal
  const handleRemoveBg = async () => {
    if (!rawFile) {
      addToast('Uploade une image d\'abord !', 'error', '⚠️');
      return;
    }
    setLoading(true);
    setLoadingAction('bg');
    try {
      const transparentImageUrl = await removeBackground(rawFile);
      setImage(transparentImageUrl);
      const response = await fetch(transparentImageUrl);
      const blob = await response.blob();
      setRawFile(new File([blob], 'transparent.png', { type: 'image/png' }));
      addToast('Fond supprimé comme un pro !', 'success', '🪄');
    } catch (error) {
      console.error(error);
      addToast('Erreur de détourage', 'error', '💥');
    }
    setLoading(false);
    setLoadingAction('');
  };

  // Download
  const handleDownload = () => {
    if (!memeRef.current || !image) {
      addToast('Crée d\'abord ton mème !', 'error', '⚠️');
      return;
    }
    toPng(memeRef.current, { cacheBust: true, pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'meme-memeforge.png';
        link.href = dataUrl;
        link.click();
        addToast('Mème téléchargé ! 🎉', 'success', '📥');
      })
      .catch(() => addToast('Erreur d\'export', 'error', '💥'));
  };

  // Save to gallery
  const handleSave = async () => {
    if (!rawFile) {
      addToast('Rien à sauvegarder !', 'error', '⚠️');
      return;
    }
    setLoading(true);
    setLoadingAction('save');
    try {
      await saveMeme(topText, bottomText, rawFile);
      addToast('Mème sauvegardé dans la galerie !', 'success', '💾');
    } catch (error) {
      console.error(error);
      addToast('Erreur de sauvegarde', 'error', '💥');
    }
    setLoading(false);
    setLoadingAction('');
  };

  const getButtonContent = (action, defaultLabel, icon) => {
    if (loading && loadingAction === action) {
      return (
        <>
          {icon}
          <div className="loading-dots">
            <span></span><span></span><span></span>
          </div>
        </>
      );
    }
    return <>{icon} {defaultLabel}</>;
  };

  return (
    <>
      <div className="generator-layout">
        {/* Left Panel — Controls */}
        <motion.div
          className="control-panel"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Upload Card */}
          <div className="glass-card">
            <div className="card-header">
              <div className="card-header-icon">
                <ImagePlus size={18} />
              </div>
              <h2>Image Source</h2>
              {image && (
                <div className="status-indicator status-ready">
                  <span className="status-dot"></span>
                  Prêt
                </div>
              )}
            </div>

            <div
              className={`upload-zone ${isDragging ? 'dragging' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              id="upload-zone"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                ref={fileInputRef}
                id="file-upload"
              />
              <motion.span
                className="upload-icon"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                {isDragging ? '📥' : '🖼️'}
              </motion.span>
              <p className="upload-title">
                {isDragging ? 'Lâche ici !' : 'Glisse ton image'}
              </p>
              <p className="upload-hint">
                ou clique pour parcourir • PNG, JPG, WebP
              </p>
            </div>
          </div>

          {/* Text Controls */}
          <div className="glass-card">
            <div className="card-header">
              <div className="card-header-icon">
                <Type size={18} />
              </div>
              <h2>Textes du Mème</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="input-group">
                <label className="input-label" htmlFor="top-text-input">
                  <AlignVerticalJustifyStart size={14} className="label-icon" />
                  Texte du haut
                </label>
                <input
                  id="top-text-input"
                  type="text"
                  className="text-input"
                  placeholder="Ex: Quand le prof dit…"
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="bottom-text-input">
                  <AlignVerticalJustifyEnd size={14} className="label-icon" />
                  Texte du bas
                </label>
                <input
                  id="bottom-text-input"
                  type="text"
                  className="text-input"
                  placeholder="Ex: …que c'est facile"
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="glass-card">
            <div className="card-header">
              <div className="card-header-icon">
                <Settings2 size={18} />
              </div>
              <h2>Actions</h2>
              {loading && (
                <div className="status-indicator status-processing">
                  <span className="status-dot"></span>
                  Traitement
                </div>
              )}
            </div>

            <div className="actions-grid">
              <motion.button
                id="btn-ai-generate"
                className={`action-btn btn-ai ${loading && loadingAction === 'ai' ? 'loading' : ''}`}
                onClick={handleAIGeneration}
                disabled={loading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {getButtonContent('ai', 'Inspirer avec Gemini ✨', <Wand2 size={16} />)}
              </motion.button>

              <motion.button
                id="btn-remove-bg"
                className="action-btn btn-removebg"
                onClick={handleRemoveBg}
                disabled={loading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {getButtonContent('bg', 'Détourer', <Eraser size={16} />)}
              </motion.button>

              <motion.button
                id="btn-download"
                className="action-btn btn-download"
                onClick={handleDownload}
                disabled={loading || !image}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Download size={16} /> Télécharger
              </motion.button>

              <motion.button
                id="btn-save"
                className="action-btn btn-save"
                onClick={handleSave}
                disabled={loading || !image}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {getButtonContent('save', 'Galerie', <Save size={16} />)}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Right Panel — Preview */}
        <motion.div
          className="preview-panel"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="glass-card">
            <div className="card-header">
              <div className="card-header-icon">
                <Sparkles size={18} />
              </div>
              <h2>Aperçu Live</h2>
            </div>

            <div className="meme-canvas-wrapper">
              <AnimatePresence mode="wait">
                {image ? (
                  <motion.div
                    key="meme-preview"
                    className="meme-canvas"
                    ref={memeRef}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
                  >
                    <img src={image} alt="Base du mème" />

                    <AnimatePresence>
                      {topText && (
                        <motion.h2
                          className="meme-text meme-text-top"
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          {topText}
                        </motion.h2>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {bottomText && (
                        <motion.h2
                          className="meme-text meme-text-bottom"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.3 }}
                        >
                          {bottomText}
                        </motion.h2>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty-state"
                    className="empty-canvas"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.span
                      className="empty-canvas-emoji"
                      animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                    >
                      🎭
                    </motion.span>
                    <p className="empty-canvas-text">Ton mème apparaîtra ici</p>
                    <p className="empty-canvas-hint">
                      ↑ Uploade une image pour commencer la magie ↑
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Loading Overlay */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(10, 10, 26, 0.7)',
                    backdropFilter: 'blur(4px)',
                    borderRadius: 'var(--radius-lg)',
                    zIndex: 10
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className="speech-bubble"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <motion.span
                      style={{ fontSize: '36px', display: 'block', marginBottom: '8px' }}
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    >
                      {loadingAction === 'ai' ? '🧠' : loadingAction === 'bg' ? '✂️' : '💾'}
                    </motion.span>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '1px', color: 'var(--text-primary)' }}>
                      {loadingAction === 'ai' && 'Gemini réfléchit...'}
                      {loadingAction === 'bg' && 'Détourage en cours...'}
                      {loadingAction === 'save' && 'Sauvegarde en cours...'}
                    </p>
                    <div className="loading-dots" style={{ justifyContent: 'center', marginTop: '8px', color: 'var(--primary-light)' }}>
                      <span></span><span></span><span></span>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Toast Notifications */}
      <Toast toasts={toasts} />
    </>
  );
}