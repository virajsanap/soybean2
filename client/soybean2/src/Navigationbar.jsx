import React, { useState,useEffect } from "react";
import Content from "./Content";

function Navigationbar(){

    const [activeTab, setActiveTab] = useState("Select Region");
    
    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
        closeNavbar();
    };

    const closeNavbar = () => {
        const navbarContent = document.getElementById("navbarContent");
        if (navbarContent.classList.contains("show")) {
          navbarContent.classList.remove("show");
        }
      };

    return(
        <>
        <nav className="navbar navbar-expand-lg navbar-light bg-danger px-4 w-100" >
            <div className="container-fluid">
                <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarContent"
                aria-controls="navbarContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
                >
                <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarContent">
                <ul className="navbar-nav w-70 mx-auto justify-content-center">
                    <li className="nav-item me-4 ">
                    <a className={`nav-link fw-bold ${ activeTab === "Select Region" ? "active" : ""}`} href="/" aria-current="page" onClick={() => handleTabClick("Select Region")}>
                        Select Region
                    </a>
                    </li>
                    <li className="nav-item me-5">
                    <a className={`nav-link fw-bold ${activeTab === "PD Optimizer" ? "active" : ""}`} href="#pd-optimizer" onClick={() => handleTabClick("PD Optimizer")}>
                        PD Optimizer
                    </a>
                    </li>
                    <li className="nav-item me-5">
                    <a className={`nav-link fw-bold ${ activeTab === "MG Optimizer" ? "active" : ""}`} href="#mg-optimizer" onClick={() => handleTabClick("MG Optimizer")}>
                        MG Optimizer
                    </a>
                    </li>
                    <li className="nav-item me-5">
                    <a className={`nav-link fw-bold ${ activeTab === "Predicted Harvest Dates" ? "active" : ""}`} href="#pharvestdate" onClick={() => handleTabClick("Predicted Harvest Dates")}>
                        Predicted Harvest Date
                    </a>
                    </li>

                    <li className="nav-item dropdown">
                    <a
                        className={`nav-link fw-bold dropdown-toggle ${
                            activeTab === "More" ? "active" : ""
                        }`}
                        href="#"
                        id="navbarDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        More
                    </a>
                    
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                        <li>
                        <a className="dropdown-item" href="#about" onClick={() => handleTabClick("About")}>
                            About
                        </a>
                        </li>
                        <li>
                        <a className="dropdown-item" href="https://forms.gle/HpGWPU1bPmyRhXk87" target="_blank" rel="noopener noreferrer"onClick={() => handleTabClick("Report")}>
                            Report
                        </a>
                        </li>
                        <li>
                        <a className="dropdown-item" href="#tutorial" onClick={() => handleTabClick("Tutorial")}>
                            Tutorial
                        </a>
                        </li>
                    </ul>
                    </li>
                </ul>
                </div>
            </div>
        </nav>

        {/* Pass activeTab as a prop to the Content component */}
        <Content activeTab={activeTab} />

        </>
    );
}
export default Navigationbar;