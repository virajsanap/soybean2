import React, { useState,useEffect } from "react";
import Content from "./Content";

function Navigationbar(){

    const [activeTab, setActiveTab] = useState("Select Region");
    const tabs = [
        "Select Region",
        "PD Optimizer",
        "MG Optimizer",
        "Harvest Dates",
        "About",
        "Tutorial",
    ];

    const handleTabClick = (e, tabName) => {
        // e.preventDefault(); // Prevent default link behavior
        if (tabName!=="Report"){
            e.preventDefault();
            setActiveTab(tabName);
        }
        closeNavbar();
    };

    const goTonextTab = () =>{
        const currentIndex = tabs.indexOf(activeTab)
        if (currentIndex<tabs.length-1){
            setActiveTab(tabs[currentIndex+1])
        }
        
    };

    const goToPrevTab = () =>{
        const currentIndex = tabs.indexOf(activeTab)
        if (currentIndex>0){
            setActiveTab(tabs[currentIndex-1])
        }
    }

    const closeNavbar = () => {
        const navbarContent = document.getElementById("navbarContent");
        if (navbarContent.classList.contains("show")) {
          navbarContent.classList.remove("show");
        }
      };

    const currentIndex =tabs.indexOf(activeTab);
    const showPreviousButton = currentIndex>0;
    const showNextButton = currentIndex<tabs.length-1;
    const nextTab = (currentIndex<tabs.length-1)?tabs[currentIndex+1]:null
    const prevTab = (currentIndex>0)?tabs[currentIndex-1]:null

    return(
        <>
        <nav className="navbar navbar-expand-lg navbar-light bg-danger px-4 w-100" >
            <div className="container-fluid d-flex align-items-center">
            <div className="d-flex align-items-center w-100">
                {/* menu icon */}
                <button
                className="navbar-toggler flex-shrink-0"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarContent"
                aria-controls="navbarContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
                >
                <span className="navbar-toggler-icon"></span>
                </button>
                {showPreviousButton && (
                    <button className="btn btn-outline-dark d-lg-none ms-2 flex-shrink-0" style={{ fontSize: "0.9rem" }} onClick={goToPrevTab}>
                        &lt; {prevTab}
                    </button>
                )}
                {showNextButton && (
                    <button className="btn btn-outline-dark d-lg-none ms-2 flex-shrink-0" style={{ fontSize: "0.9rem" }} onClick={goTonextTab}>
                        {nextTab} &gt;
                    </button>
                )}
            </div>
                <div className="collapse navbar-collapse" id="navbarContent">
                <ul className="navbar-nav w-70 mx-auto justify-content-center">
                    <li className="nav-item me-4 ">
                    <a className={`nav-link fw-bold ${ activeTab === "Select Region" ? "active" : ""}`} href="/" aria-current="page" onClick={(e) => handleTabClick(e, "Select Region")}>
                        Select Region
                    </a>
                    </li>
                    <li className="nav-item me-5">
                    <a className={`nav-link fw-bold ${activeTab === "PD Optimizer" ? "active" : ""}`} href="#pd-optimizer" onClick={(e) => handleTabClick(e,"PD Optimizer")}>
                        PD Optimizer
                    </a>
                    </li>
                    <li className="nav-item me-5">
                    <a className={`nav-link fw-bold ${ activeTab === "MG Optimizer" ? "active" : ""}`} href="#mg-optimizer" onClick={(e) => handleTabClick(e,"MG Optimizer")}>
                        MG Optimizer
                    </a>
                    </li>
                    <li className="nav-item me-5">
                    <a className={`nav-link fw-bold ${ activeTab === "Harvest Dates" ? "active" : ""}`} href="#pharvestdate" onClick={(e) => handleTabClick(e,"Predicted Harvest Dates")}>
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
                        <a className="dropdown-item" href="#about" onClick={(e) => handleTabClick(e,"About")}>
                            About
                        </a>
                        </li>
                        <li>
                        <a className="dropdown-item" href="https://forms.gle/HpGWPU1bPmyRhXk87" target="_blank" rel="noopener noreferrer"onClick={(e) => handleTabClick(e,"Report")}>
                            Report
                        </a>
                        </li>
                        <li>
                        <a className="dropdown-item" href="#tutorial" onClick={(e) => handleTabClick(e,"Tutorial")}>
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