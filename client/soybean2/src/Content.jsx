import React from "react";
import { useState } from "react";
import Region from "./Region";
import PDOptimizer from "./PDOptimizer";
import MGOptimizer from "./MGOptimizer";
import About from "./About";
import PHarvestDate from "./PHarvestDate";
import Tutorial from "./Tutorial";

function Content({activeTab}){
    // const [selectedTab, setSelectedTab] = useState("Select Region")

    return(
        <>
        <div id="main-content" className="flex-grow-1">
            {activeTab === "Select Region" && <Region />}
            {activeTab ==="PD Optimizer" && <PDOptimizer/>}
            {activeTab ==="MG Optimizer" && <MGOptimizer/>}
            {activeTab ==="Harvest Dates" && <PHarvestDate/>}
            {activeTab ==="About" && <About/>}
            {activeTab ==="Tutorial" && <Tutorial/>}
        </div>
        </>
    );
}

export default Content