import { useState,useEffect } from 'react'
import './App.css'
import Header from './Header.jsx'
import Navigationbar from './Navigationbar.jsx'
import Content from './Content.jsx'
import Footer from './Footer.jsx'
import 'leaflet/dist/leaflet.css';
import { RegionProvider } from "./RegionContext";
import { TrackUsers } from './TrackUsers.js'

function App() {
  // const [count, setCount] = useState(0)
  useEffect(() => {
    TrackUsers();  // Call the function to track visits
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <RegionProvider>
      <Header />

      {/* Navigation Bar */}
      <Navigationbar />

      {/* Main Content Wrapper */}
      {/* <Content /> */}
      {/* Footer */}
      <Footer />
      </RegionProvider>
    </div>
    
  )
}

export default App
