import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js"; 

const MGGraph = ({ plotData, layout, optimalDate }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    // const MGRange = [2,8]
    // Handle window resizing to detect device type
    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };
  
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  
    // Adjust layouts based on device type
    const mobileLayout = {
      ...layout,
      height: 300,
      margin: { l: 40, r: 20, t: 30, b: 60 },
      xaxis: {
        ...layout?.xaxis,
        title: "Maturity Group",
        tickangle: -90,
        tickfont: { size: 7 },
        automargin: true,
      },
      yaxis: {
        ...layout?.yaxis,
        title: "Relative yeild potential",
        tickfont: { size: 7 },
        automargin: true,
      },
      showlegend: false,
      dragmode: "pan",
    };
  
    const desktopLayout = {
      ...layout,
      height: 400,
      margin: { l: 50, r: 30, t: 50, b: 70 },
      xaxis: {
        ...layout?.xaxis,
        title: "Maturity Group",
        tickangle: 0,
        tickfont: { size: 12 },
        automargin: true,
      },
      yaxis: {
        ...layout?.yaxis,
        title: "Relative yeild potential",
        tickfont: { size: 12 },
        automargin: true,
      },
      dragmode: "pan",
    };
  
    return (
      <div className="container-fluid p-0">
        {/* Display optimal maturity group if available */}
        {optimalDate && (
            <p className="fw-bold mb-2">
                Optimal Maturity Group: <span>{optimalDate}</span>
            </p>
        )}
  
        {/* Display graph or a fallback message */}
        {plotData ? (
          <Plot
            data={plotData}
            layout={isMobile ? mobileLayout : desktopLayout}
            useResizeHandler={true}
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <p>No data available. Adjust inputs and click Submit to generate the graph.</p>
        )}
      </div>
    );
  };
  
  export default MGGraph;