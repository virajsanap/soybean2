// Navigationbar.jsx
import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

const tabs = [
  { name: "Select Region", path: "/" },
  { name: "PD Optimizer", path: "/pd-optimizer" },
  { name: "MG Optimizer", path: "/mg-optimizer" },
  { name: "Harvest Dates", path: "/harvest-dates" },
];

function Navigationbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine the active index based on the current URL
  const currentIndex = tabs.findIndex((tab) => tab.path === location.pathname);
  const showPreviousButton = currentIndex > 0;
  const showNextButton = currentIndex < tabs.length - 1;
  const nextTab = showNextButton ? tabs[currentIndex + 1] : null;
  const prevTab = showPreviousButton ? tabs[currentIndex - 1] : null;

  const handleNext = () => {
    if (nextTab) navigate(nextTab.path);
  };

  const handlePrev = () => {
    if (prevTab) navigate(prevTab.path);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-danger px-4 w-100">
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            {/* Mobile menu toggle */}
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
              <button
                className="btn btn-outline-dark d-lg-none ms-2 flex-shrink-0"
                style={{ fontSize: "0.9rem" }}
                onClick={handlePrev}
              >
                &lt; {prevTab.name}
              </button>
            )}
            {showNextButton && (
              <button
                className="btn btn-outline-dark d-lg-none ms-2 flex-shrink-0"
                style={{ fontSize: "0.9rem" }}
                onClick={handleNext}
              >
                {nextTab.name} &gt;
              </button>
            )}
          </div>
          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav mx-auto justify-content-center">
              {tabs.map((tab) => (
                <li key={tab.name} className="nav-item mx-2">
                  <NavLink
                    to={tab.path}
                    end={tab.path === "/"} // Use "end" prop for exact matching on home
                    className={({ isActive }) =>
                      "nav-link fw-bold" + (isActive ? " active" : "")
                    }
                  >
                    {tab.name}
                  </NavLink>
                </li>
              ))}
              <li className="nav-item mx-2 dropdown">
                <a
                  className="nav-link fw-bold dropdown-toggle"
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
                    <NavLink className="dropdown-item" to="/about">
                      About
                    </NavLink>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="https://forms.gle/HpGWPU1bPmyRhXk87"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Report
                    </a>
                  </li>
                  <li>
                    <NavLink className="dropdown-item" to="/tutorial">
                      Tutorial
                    </NavLink>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navigationbar;
