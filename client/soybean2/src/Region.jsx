import React,{useState,useEffect,createContext, useContext } from "react";
import Map from './Map'
// import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useMediaQuery } from 'react-responsive';
// import ncGeoJson from "./resources/ncstate_counties.json";
import ncRegionsGeoJson from './resources/ncregions_counties_merged.json';
import { RegionContext} from "./RegionContext";
//try

function Region(){

    const zoomd = 6.5; // Default zoom for desktop
    const zoomm = 5.2;   // Default zoom for mobile
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const [zoomLevel, setZoomLevel] = useState(isMobile ? zoomm : zoomd);
    const [highlightedRegion, setHighlightedRegion] = useState(null);
    const { selectedRegion, setSelectedRegion } = useContext(RegionContext);

    // Store selected region in localStorage when it changes
    useEffect(() => {
        if (selectedRegion && selectedRegion !== "Please select a region") {
            localStorage.setItem('selectedRegion', selectedRegion);
        }
    }, [selectedRegion]);

    const sendRegionToBackend = async (region) => {
        try {
            const response = await fetch(`http://3.16.192.151:8000/api/select_region`, {
            // const response = await fetch(`http://localhost:8000/api/select_region`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ region: region }),
              });
          
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          
          const data = await response.json();
          console.log('Response from backend:', data);
        } catch (error) {
          console.error('Error sending region to backend:', error);
        }
      };

    const handleRegionSelect = (region) => {
        console.log("Region selected:", region);
        setSelectedRegion(region);
        sendRegionToBackend(region);
        localStorage.setItem('selectedRegion', region);
        
    };

    const regionColors = {
        "Tidewater": "#D14905",
        "N. Coastal Plain": "#FAC800",
        "N. Piedmont": "#008473",
        "S. Piedmont": "#4156A1",
        "S. Coastal Plain": "#6F7D1C",
    };

    // Function to style GeoJSON features (counties)
    const geoJsonStyle = (feature) => {    
        const region = feature.properties.REGION;
        return {
            fillColor: regionColors[region] || "#CCCCCC", // Default to gray if no color is defined
            weight: 1,
            opacity: 1,
            color: "black",
            fillOpacity: 0.7,
        };
    };

    // Highlight the entire region
    const highlightFeature = (e) => {
        const layer = e.target;
        const regionName = layer.feature.properties.REGION;

        // Get all layers of the same region and highlight them
        const allRegions = e.target._map._layers;
        Object.keys(allRegions).forEach(key => {
            const currentLayer = allRegions[key];
            if (currentLayer.feature && currentLayer.feature.properties.REGION === regionName) {
                currentLayer.setStyle({
                    weight: 3,
                    color: '#666',
                    fillOpacity: 0.9
                });
            }
        });

        setHighlightedRegion(regionName);
    };

    // Reset highlight for all regions
    const resetHighlight = (e) => {
        const layer = e.target;
        const regionName = layer.feature.properties.REGION;

        // Reset style for all regions
        const allRegions = e.target._map._layers;
        Object.keys(allRegions).forEach(key => {
            const currentLayer = allRegions[key];
            if (currentLayer.feature && currentLayer.feature.properties.REGION === regionName) {
                currentLayer.setStyle(geoJsonStyle(currentLayer.feature));
            }
        });

        setHighlightedRegion(null);
    };

    useEffect(() => {
        setZoomLevel(isMobile ? zoomm : zoomd);
    }, [isMobile]);


    return(
        <>
            <div className="container py-2">
                <h2 className="text-black">Select Region</h2>
            </div>
            <div className="container-fluid px-4">
                <div className="row">
                    {/* Map for large screens */}
                    <div className="col-lg-7 col-12 mb-3 d-none d-lg-block">
                        <div style={{ height: "400px", backgroundColor: "#d9d9d9" }} className="d-flex justify-content-center align-items-center">
                        <Map
                            geoJsonData={ncRegionsGeoJson}
                            geoJsonStyle={geoJsonStyle}
                            highlightFeature={highlightFeature}
                            resetHighlight={resetHighlight}
                            zoomLevel={zoomLevel}
                            height="400px"
                            onRegionSelect={handleRegionSelect}
                            regionColors={regionColors}
                        />
                        </div>
                        {/* <p>Selected Region: {selectedRegion}</p> */}
                        {selectedRegion === "Please select a region" ? (
                            <div className="alert alert-danger mt-2 fs-5" role="alert">
                                Please select a region
                            </div>
                        ) : (
                            <div className="alert alert-success mt-2 fs-5" role="alert">
                                Selected Region is {selectedRegion}
                            </div>
                        )}
                    </div>
        
                    {/* Map for small screens */}
                    <div className="col-12 mb-3 d-block d-lg-none">
                        <div style={{ height: "auto", width:"100%", backgroundColor: "#d9d9d9" }} className="d-flex justify-content-center align-items-center">
                        <Map
                            geoJsonData={ncRegionsGeoJson}
                            geoJsonStyle={geoJsonStyle}
                            highlightFeature={highlightFeature}
                            resetHighlight={resetHighlight}
                            zoomLevel={zoomLevel}
                            height = "200px"
                            onRegionSelect={handleRegionSelect}
                            regionColors={regionColors}
                        /> 
                        </div>
                        {/* <p>Selected Region: {selectedRegion}</p> */}
                        {selectedRegion === "Please select a region" ? (
                            <div className="alert alert-danger mt-2 fs-5" role="alert">
                                Please select a region
                            </div>
                        ) : (
                            <div className="alert alert-success mt-2 fs-5" role="alert">
                                Selected Region is {selectedRegion}
                            </div>
                        )}
                    </div>
                    <div className="col-lg-5 col-12" style={{ overflowY: "auto", maxHeight: "400px" }}>
                        <h4>Instructions</h4>
                        <p><strong>How to Use BeanPack</strong></p>
                        <p><strong>Select Region:</strong></p>
                        <p>Choose your region of interest on the map of North Carolina. After selecting your region, you should see the model running in the upper-right corner.</p>
                        <p><strong>Optimize Planting Date or Maturity Group:</strong></p>
                        <p>Once the model has completed, navigate to the tabs to optimize the planting date or maturity group:</p>
                        <ul>
                            <li>Use the <strong>PD Optimizer</strong> tab to find the ideal planting date for a given range of maturity groups.</li>
                            <li>Use the <strong>MG Optimizer</strong> tab to find the ideal maturity group for a selected range of planting dates.</li>
                        </ul>
                        <p><strong>Estimate Harvest Date:</strong></p>
                        <p>After optimizing the planting date and maturity group, go to the <strong>Predicted Harvest Date</strong> tab to estimate the harvest date window.</p>
                    </div>
                </div>
            </div>
            
        </>
    );
}

export default Region;
