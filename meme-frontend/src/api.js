import axios from 'axios';

// L'adresse de ton serveur AWS hébergeant l'API
const API_URL = 'http://noxmeme.duckdns.org';

// Utilité : Envoie l'image à Gemini pour générer des textes drôles
export const generateCaption = async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    
    const response = await axios.post(`${API_URL}/ai/generate-caption`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

// Utilité : Envoie l'image au modèle U2Net (Rembg) pour retirer le fond
export const removeBackground = async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    
    const response = await axios.post(`${API_URL}/ai/remove-bg`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob' // Important car on reçoit un fichier image (PNG), pas du JSON
    });
    
    // Convertit le blob binaire reçu en URL lisible par une balise <img> HTML
    return URL.createObjectURL(response.data);
};

// Utilité : Sauvegarde le mème finalisé dans la base de données PostgreSQL
export const saveMeme = async (topText, bottomText, imageFile) => {
    const formData = new FormData();
    formData.append('top_text', topText);
    formData.append('bottom_text', bottomText);
    formData.append('file', imageFile);
    
    const response = await axios.post(`${API_URL}/memes`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

// Utilité : Récupère l'historique complet pour la page Galerie
export const getMemes = async () => {
    const response = await axios.get(`${API_URL}/memes`);
    return response.data.memes;
};