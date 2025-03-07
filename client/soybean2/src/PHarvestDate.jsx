import React,{useContext} from "react";
import NPiedmontImage from './assets/N_Piedmont_bw.png';
import SPiedmontImage from './assets/S_Piedmont_bw.png';
import S_Costal_Image from './assets/S_Coastal_Plain_bw.png';
import N_Costal_Image from './assets/N_Coastal_Plain_bw.png';
import Tidewater_Image from './assets/Tidewater_bw.png';
import { RegionContext, RegionProvider } from "./RegionContext";


function PHarvestDate(){
    const Region = useContext(RegionContext)

    const regionImages = {
        "Tidewater": Tidewater_Image,
        "N. Coastal Plain": N_Costal_Image,
        "N. Piedmont": NPiedmontImage,
        "S. Piedmont": SPiedmontImage,
        "S. Coastal Plain": S_Costal_Image,
    };

    const getRegionImg = (region) => {
        return regionImages[region.selectedRegion];
    };
    return(
        <div className="container mt-2">
        <h2>Harvest Date Predictions</h2>
        
        <div className="text-center my-4">
        
        <img 
        
            src= {getRegionImg(Region)} 
            alt="SoyStage Harvest Predictions" 
            className="img-fluid rounded" 
            style={{ maxHeight: '400px', objectFit: 'cover' }}
        />
        </div>    
        <div className="text-left">
            <p>
            Harvest date predictions were made using SoyStage and assuming 10 days from planting to emergence. We estimated planting date and maturity group combinations would be ready for harvest on average 10 days after hitting R7. Previous research in North Carolina has indicated that SoyStage, developed in the Midsouth USA, predicts reproductive growth stages in North Carolina within 5–10 days of accuracy. Three locations were selected across North Carolina to give the user a general idea on harvest dates, but if you want to plug in your specific location in the state and planned production practices, please visit SoyStage.
            </p>
        </div>
        <div className="text-center mb-3">
        <a 
            href="https://soystage.uark.edu/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-success mt-3"
            >
            Go to SoyStage
            </a>
        </div>
        </div>
    );
}

export default PHarvestDate;