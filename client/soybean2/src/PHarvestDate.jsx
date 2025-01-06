import React from "react";
import NPiedmontImage from './assets/N_Piedmont_bw.png';

function PHarvestDate(){
    return(
        <div className="container mt-4">
        <h2>Harvest Date Predictions</h2>
        
        <div className="text-center my-4">
        <img 
            src={NPiedmontImage} 
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