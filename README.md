# 🎬 StreamFlix — Netflix-Style Streaming Web App

StreamFlix is a premium, fully responsive streaming platform designed and built using **React + Vite**, client-side routing, local storage watchlists, and Vanilla CSS. It features a modern, dark cinematic theme with fluid animations, dynamic search, and a dual-mode API service.

---

## 🚀 Live Demo & Launch

Follow these steps to run the application locally:

### 1. Installation
Bypass certificate limitations and install dependencies:
```bash
npm config set strict-ssl false
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

---

## 🌟 Key Features

* **Cinematic Hero Banner**: Showcases featured trending movies with titles, ratings, synopses, and quick navigation actions.
* **Horizontal Row Sliders**: Netflix-style content rows (Trending, Popular, Top Rated, Action, Sci-Fi, Horror, Animation, Recently Added) with smooth horizontal mouse-scroll and arrow controllers.
* **Pop-Out Movie Cards**: Movie posters expand into detailed cards on hover, showing rating, genres, year, descriptions, and quick buttons.
* **Robust YouTube Player**: Integrates official movie trailers in responsive 16:9 overlays, including full-screen controls and loading overlays.
* **Persistent My List**: Add or remove titles from your watchlist, saved to `localStorage` and synchronized across pages in real time.
* **Dynamic Search & Debouncing**: Type in the navigation bar search bar to get instant redirected results with built-in input debouncing.
* **Genre Filter Catalog**: Browse movies and series categorized under specific genres.
* **Failover Safety**: If a trailer fails to resolve, a clean fallback UI with a **"Trailer unavailable"** notice and a **"Back to Movies"** link is rendered to protect the user experience.

---

## 🛠️ Tech Stack & Libraries

* **Framework**: React 19 (Vite bundler)
* **Styling**: Vanilla CSS (Fluid layouts & transitions)
* **Icons**: `lucide-react`
* **Routing**: `react-router-dom`
* **API Service**: TMDB (The Movie Database) API with automatic local mock fallbacks.

---

## 📡 Dynamic TMDB Dual-Mode

StreamFlix is built to work immediately out-of-the-box, even without an internet connection or API keys:

1. **TMDB Mode (Active)**: If you provide a TMDB API Key in your environment variable:
   * Create a `.env` file in the root directory.
   * Add: `VITE_TMDB_API_KEY=YOUR_TMDB_API_KEY`.
   * The app will fetch live movie posters, credits, casts, dynamic categories, and trailer keys from TMDB.
2. **Local Fallback Mode (Offline)**: If the `.env` file is missing or API limits are hit, the service automatically redirects query requests to the pre-seeded [`src/data/movies.js`](src/data/movies.js) database. This contains 12 cinematic blockbusters with fully configured poster backdrops and working trailer IDs.

---

## 📂 Project Architecture

```
netflix_clone/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable presentational components
│   │   ├── Navbar.jsx      # Fixed header with search and responsive collapse
│   │   ├── HeroBanner.jsx  # Billboard showcase
│   │   ├── MovieRow.jsx    # Horizontal row container
│   │   ├── MovieCard.jsx   # Hover cards with pop-out details
│   │   ├── MoviePlayer.jsx # YouTube iframe player wrapper
│   │   ├── LoadingSpinner.jsx
│   │   └── ErrorMessage.jsx
│   ├── pages/              # Router view screens
│   │   ├── Home.jsx        # Landing dashboard rows
│   │   ├── Movies.jsx      # Genre filtering grid
│   │   ├── Search.jsx      # Query-driven results
│   │   ├── MyList.jsx      # LocalStorage watchlist grid
│   │   └── Watch.jsx       # Player layout and credits sidebar
│   ├── data/
│   │   └── movies.js       # Fallback movies database
│   ├── services/
│   │   └── tmdb.js         # Fetch coordinator
│   ├── App.jsx             # Routes wrapper
│   ├── main.jsx            # React root
│   └── index.css           # Cinematic CSS rules
├── package.json
└── vite.config.js
```

---

## 📤 Push StreamFlix to Your GitHub

To upload this project to your personal GitHub account, execute the following commands in your terminal:

```bash
# 1. Stage and commit files locally
git add .
git commit -m "Initial commit: Complete StreamFlix streaming application"

# 2. Add your GitHub repository link as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git

# 3. Rename branch to main (if not already main)
git branch -M main

# 4. Push to GitHub
git push -u origin main
```
