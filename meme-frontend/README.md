# ⚡ MèmeForge Client — Frontend App (Vite + React)

> L'interface web de la plateforme MèmeForge. Un design professionnel, ludique et hautement interactif inspiré des univers **Comic-book et Cyberpunk**, conçu avec des typographies percutantes, des micro-animations fluides et une manipulation ultra-intuitive.

---

## 🎨 Caractéristiques Design & UX

L'application a été entièrement repensée pour offrir une expérience utilisateur (UX) haut de gamme et mémorable :
*   **Aesthetic Comic Premium** : Un thème sombre profond enrichi de textures en grilles de points (*half-tones*), de bordures néon en dégradés dynamiques et de cartes en effet verre givré (*glass-morphic cards*).
*   **Polices de Caractère Uniques** :
    *   `Bangers` (Google Fonts) : Une police grasse et explosive de type bande dessinée pour les titres principaux.
    *   `Space Grotesk` (Google Fonts) : Une police de corps épurée et géométrique pour une lisibilité parfaite.
    *   `Caveat` (Google Fonts) : Une police cursive type écriture manuscrite pour apporter une note ludique aux descriptions.
*   **Transitions & Mouvements Physiques** : Gestion poussée des états de survol, de clic et de transition de page grâce à `framer-motion` avec des effets de ressort physique (*spring dynamics*).
*   **Toast Notifications** : Système de notifications non intrusives, élégantes et animées en bas à droite de l'écran pour confirmer l'état de chaque action (upload réussi, détourage terminé, génération IA...).
*   **Comic Speech Bubble** : Pendant les temps de calculs de l'IA (Gemini / U2Net), une bulle de bande dessinée animée s'affiche pour faire patienter l'utilisateur avec humour.

---

## 🛠️ Stack Technique

*   **Framework** : [React 19](https://react.dev/)
*   **Build Tool** : [Vite 8](https://vite.dev/)
*   **Moteur d'Animation** : [Framer Motion](https://www.framer.com/motion/)
*   **Librairie de Capturation** : [html-to-image](https://github.com/bubkoo/html-to-image) (Génère des images PNG haute définition à partir d'éléments HTML)
*   **Icônes** : [Lucide React](https://lucide.dev/)
*   **Client HTTP** : [Axios](https://axios-http.com/)

---

## 📂 Structure du Code Source

```bash
meme-frontend/
├── public/                 # Assets publics (Favicon personnalisé, icons)
├── src/
│   ├── assets/             # Images locales et logos SVG
│   ├── App.jsx             # Composant racine avec gestion de la navigation & animations Framer Motion
│   ├── App.css             # Styles CSS spécifiques aux composants de l'application
│   ├── index.css           # Design System global (Variables CSS, thèmes, polices, resets)
│   ├── main.jsx            # Point d'entrée de React
│   ├── api.js              # Configuration et appels Axios vers l'API AWS noxmeme.duckdns.org
│   ├── MemeGenerator.jsx   # Le module principal du créateur (Upload, Inputs, Actions IA)
│   ├── Gallery.jsx         # La galerie de mèmes avec skeleton loader et visionneuse lightbox
│   └── Toast.jsx           # Composant gérant les toasts d'information/success/erreur
├── package.json            # Scripts de build et dépendances
└── vite.config.js          # Configuration de Vite
```

---

## 🚀 Installation et Démarrage en Local

### 📋 Prérequis
*   [Node.js](https://nodejs.org/) (version 18 ou supérieure recommandée)
*   [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)

### 🔧 Étapes d'installation

1. Installez les paquets de dépendances :
   ```bash
   npm install
   ```

2. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

3. Accédez à l'application locale :
   ```bash
   http://localhost:5173/   # (ou le port alternatif indiqué par Vite)
   ```

### 📦 Construction pour la Production

Pour compiler l'application de façon optimisée pour la mise en ligne (production) :
```bash
npm run build
```
Les fichiers statiques seront générés dans le dossier `/dist`.

---

## 📡 Connexion API (Intégration Backend)

Les appels vers l'infrastructure AWS hébergée sur `noxmeme.duckdns.org` sont centralisés dans le fichier [`src/api.js`](file:///home/noxtheteenager/Documents/Projets/noxmemesupinfo/meme-frontend/src/api.js) :

*   `generateCaption(imageFile)` : Envoie l'image brute à Gemini pour analyser son contenu et recevoir un objet JSON `{top_text: "...", bottom_text: "..."}`.
*   `removeBackground(imageFile)` : Envoie l'image à U2Net/Rembg et renvoie une URL blob de l'image détourée prête à être affichée.
*   `saveMeme(topText, bottomText, imageFile)` : Sauvegarde l'image et ses métadonnées de légendes associées dans la base de données.
*   `getMemes()` : Récupère la liste historique de tous les mèmes enregistrés pour peupler la Galerie.
