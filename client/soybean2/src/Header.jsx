import React from "react"
import logo from './assets/NC-State-Extension_Color-logos-1024x341-v.png'

function Header(){
    return(
        // <h1>BeanPACK</h1>
        <header className="bg-white border-bottom py-2 py-md-4 w-100" style={{ top: 0, zIndex: 1000 }}>
            <div className="container-fluid position-relative">
                {/* Logo Section - Absolutely positioned */}
                <div className="d-none d-md-block position-absolute start-0 ps-5" style={{ top: '50%', transform: 'translateY(-50%)' }}>
                <img 
                    src={logo} 
                    alt="NC State Extension" 
                    style={{ height: '150px' }} 
                />
                </div>

                {/* Mobile Logo - Shows only on mobile */}
                <div className="d-md-none text-center">
                <img 
                    src={logo} 
                    alt="NC State Extension" 
                    style={{ height: '50px' }} 
                />
                </div>

                {/* Title Section - Always centered */}
                <div className="text-center text-danger">
                <h1 className="m-0 fw-bold">
                    BeanPACK
                </h1>
                <div className="small fw-bold">
                    (SoyBEAN Planting Analytics and Customized Knowledge)
                </div>
                </div>
            </div>
        </header>
    );
    
}

export default Header;