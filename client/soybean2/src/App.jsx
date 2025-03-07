// App.jsx
import { useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import './App.css';
import Header from './Header.jsx';
import Navigationbar from './Navigationbar.jsx';
import Footer from './Footer.jsx';
import 'leaflet/dist/leaflet.css';
import { TrackUsers } from './TrackUsers.js';

// Import the views (pages)
import Region from "./Region";
import PDOptimizer from "./PDOptimizer";
import MGOptimizer from "./MGOptimizer";
import PHarvestDate from "./PHarvestDate";
import About from "./About";
import Tutorial from "./Tutorial";

function App() {
  useEffect(() => {
    TrackUsers(); // Call the function to track visits
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <Navigationbar />
      <main className="flex-grow-1 p-2">
        <Routes>
          <Route path="/" element={<Region />} />
          <Route path="/pd-optimizer" element={<PDOptimizer />} />
          <Route path="/mg-optimizer" element={<MGOptimizer />} />
          <Route path="/harvest-dates" element={<PHarvestDate />} />
          <Route path="/about" element={<About />} />
          <Route path="/tutorial" element={<Tutorial />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
