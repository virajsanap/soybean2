import React,{useState,useEffect,useContext} from "react";
import { RegionContext, RegionProvider } from "./RegionContext";
import axios from 'axios';

function About(){
    const { selectedRegion } = useContext(RegionContext);

    return (
        <div className="container-fluid">
            About
            <p>Currently selected region: {selectedRegion}</p>
        </div>
    );
}

export default About;