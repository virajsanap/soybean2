import React from "react";
import './App.css'

const Legend = ({ regionColors }) => {
    if (!regionColors) {
        return null; // or return a message indicating that the legend is not available
    }
    console.log("Region Colors:", regionColors);
    return (
        <div className="legend">
            <h5>Regions</h5>
            {Object.entries(regionColors).map(([region, color]) => (
                <div key={region} className="legend-item">
                    <span
                        className="legend-color"
                        style={{ backgroundColor: color }}
                    ></span>
                    <span className="legend-label">{region}</span>
                </div>
            ))}
        </div>
    );
};

export default Legend;
