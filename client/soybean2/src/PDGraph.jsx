import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
// test
const PDGraph = ({ plotData, layout, optimalDate }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const mobileLayout = {
    ...layout,
    height: 300,
    margin: { l: 40, r: 20, t: 30, b: 60 },
    xaxis: {
      ...layout.xaxis,
      tickangle: -90,
      tickfont: { size: 7 },
      automargin: true,
    },
    yaxis: {
      ...layout.yaxis,
      tickfont: { size: 4 },
      automargin: true,
    },
    showlegend: false,
    dragmode: "pan",
  };

  const desktopLayout = {
    ...layout,
    height: 400,
    margin: { l: 40, r: 30, t: 40, b: 70 },
    xaxis: {
      ...layout.xaxis,
      tickangle: -90,
      tickfont: { size: 12 },
      automargin: true,
    },
    yaxis: {
      ...layout.yaxis,
      tickfont: { size: 12 },
      automargin: true,
    },
    dragmode: "pan",
  };

  return (
    <div className="container-fluid p-0">
      {optimalDate && (
        <p className="fw-bold mb-2">
          Optimal Planting Date: <span>{optimalDate}</span>
        </p>
      )}
      {plotData ? (
        <Plot
          data={plotData}
          layout={isMobile ? mobileLayout : desktopLayout}
          useResizeHandler={true}
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        <p>No data available. Click Submit to generate the graph.</p>
      )}
    </div>
  );
};

export default PDGraph;