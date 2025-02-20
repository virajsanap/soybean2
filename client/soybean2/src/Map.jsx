import React,{useState}from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import Legend from "./Legend";

// The Map component receives GeoJSON data, styling functions, and event handlers as props
const Map = ({ geoJsonData, geoJsonStyle, highlightFeature, resetHighlight, zoomLevel,height,onRegionSelect,regionColors }) => {
    return (
        <div style={{ position: "relative", height: height, width: "100%" }}>
        <MapContainer
            style={{ height: height, width: "100%" }}
            center={[35.5, -78.0]} // Center on North Carolina
            zoom={zoomLevel}
            zoomSnap={0}
            zoomDelta={0.5}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <GeoJSON
                data={geoJsonData}
                style={geoJsonStyle}
                onEachFeature={(feature, layer) => {
                    layer.on({
                        mouseover: highlightFeature,
                        mouseout: resetHighlight,
                        click: (e) => {
                            // Handle click event if needed
                            const selected_region = feature.properties.REGION;
                            onRegionSelect(selected_region);
                            console.log("Selected Region:", selected_region);
                        }
                    });
                    layer.bindPopup(feature.properties.REGION);
                }}
            />
            
        </MapContainer>
        {/* <div className="d-flex justify-content-center align-items-center"> */}
        <Legend regionColors={regionColors} />
        
        </div>
    );
};

export default Map;