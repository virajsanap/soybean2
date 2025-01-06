import React from "react";
import dsalogo from './assets/dsa.png'
import ncprod_association from './assets/NCSPA_LOGO_2c_PMS363+450_CHECK.jpg'
import nc_plant_science from './assets/PSI.png'

function Footer(){
    return(
        // <div>
        //     Hi this is footer
        // </div>
        <footer className="bg-danger text-white py-3">
            <div className="container">
                <div className="row align-items-center text-center text-lg-start">
                {/* Funded by Section */}
                <div className="col-12 col-lg-4 mb-3 mb-lg-0 d-flex align-items-center justify-content-center justify-content-lg-start">
                    <span className="me-3">Funded by</span>
                    <img
                    src={ncprod_association}
                    alt="NC Soybean Producers Association"
                    className="img-fluid"
                    style={{ height: "50px" }}
                    />
                </div>

                {/* Collaboration Text */}
                <div className="col-12 col-lg-4 mb-3 mb-lg-0 text-center">
                    <span>In collaboration with</span>
                </div>

                {/* Collaboration Logos */}
                <div className="col-12 col-lg-4 d-flex justify-content-center">
                    <div className="text-center me-3">
                    <img
                        src={nc_plant_science}
                        alt="N.C. Plant Sciences Initiative"
                        className="img-fluid"
                        style={{ height: "50px" }}
                    />
                    <p className="m-0 small">N.C. Plant Sciences Initiative</p>
                    </div>
                    <div className="text-center">
                    <img
                        src={dsalogo}
                        alt="NC State Data Science Academy"
                        className="img-fluid"
                        style={{ height: "50px" }}
                    />
                    <p className="m-0 small">Data Science Academy</p>
                    </div>
                </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;