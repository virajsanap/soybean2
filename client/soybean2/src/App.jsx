import { useState } from 'react'
import './App.css'
import Header from './Header.jsx'
import Navigationbar from './Navigationbar.jsx'
import Content from './Content.jsx'
import Footer from './Footer.jsx'
import 'leaflet/dist/leaflet.css';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <Header />

      {/* Navigation Bar */}
      <Navigationbar />

      {/* Main Content Wrapper */}
      {/* <Content /> */}
      {/* Footer */}
      <Footer />
    </div>
    
  )
}

export default App
