import React, { useState,useEffect, useContext } from "react";
import { InputGroup, Form, Alert, Button } from 'react-bootstrap';
import { RegionContext, RegionProvider } from "./RegionContext";
import PDGraph from "./PDGraph";

function PDOptimizer(){
    const {selectedRegion} = useContext(RegionContext)
    const [MGMinValue,setMGMinValue] = useState('2.0')
    const [MGMaxValue,setMGMaxValue] = useState('8.0')
    const [startDate, setStartDate] = useState('2024-04-01');
    const [endDate, setEndDate] = useState('2024-08-15');
    const [error, setError] = useState('');
    const [isDataReady, setIsDataReady] = useState(false);

    // States for Graph Data
    const [plotData, setPlotData] = useState(null);
    const [layout, setLayout] = useState({});
    const [optimalDate, setOptimalDate] = useState("");

    const sendDataToBackend = async () => {
        const data = {
          start_date: startDate,
          end_date: endDate,
          mg_min: MGMinValue,
          mg_max: MGMaxValue,
        };

        try {
            const response = await fetch(`http://3.16.192.151:8000/api/pd_optimiser`, {
            // const response = await fetch(`http://localhost:8000/api/pd_optimiser`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
              });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const result = await response.json();
            
            // Changed from JSON.parse(result.plot) to direct access
            setPlotData(result.plot.data);
            setLayout(result.plot.layout);
            setOptimalDate(result.optimal_date);
            setError('');
    
        } catch (error) {
            console.error('Fetch error:', error);
            setError('Failed to fetch optimization data. Please try again.');
            setPlotData(null);
            setLayout({});
        }
    };
    
    const handleMGChange = (event) => {
        const { name, value } = event.target;
        // Add input validation
        const numericValue = parseFloat(value).toFixed(1);
        
        if (name === 'min') {
            setMGMinValue(numericValue);
        } else if (name === 'max') {
            setMGMaxValue(numericValue);
        }
    };

    // In useEffect validation:
    useEffect(() => {
        const min = parseFloat(MGMinValue);
        const max = parseFloat(MGMaxValue);
        const isValid = !isNaN(min) && !isNaN(max) && min < max;
        
        setIsDataReady(isValid);
        setError(isValid ? '' : 'Minimum must be less than Maximum');
    }, [MGMinValue, MGMaxValue]);

    const generateOptions = (start,end,step)=>{
        const options = [];
        for (let i=2.0;i<=8.0;i+=0.1){
            options.push(i.toFixed(1));
        }
        return options;
    };
    
    return(
        <>
        <div className="container">
            <h2>Planting Date Optimization</h2>
            <h4>
            <h4>Region Selected : <i><u>{selectedRegion}</u></i></h4>
            </h4>
            <hr/>
            <h4>Adjust Planting Date and Maturity Groups</h4>
            <div className="row mb-3">
                <div className="col-md-3">
                <div className="form-group">
                    <label>Planting Start Date</label>
                    <input 
                    type="date" 
                    className="form-control" 
                    value={startDate}
                    onChange={(e)=>setStartDate(e.target.value)} 
                    />
                </div>
                </div>
                <div className="col-md-3">
                <div className="form-group">
                    <label>Planting End Date</label>
                    <input 
                    type="date" 
                    className="form-control" 
                    value={endDate} 
                    onChange={(e)=>setEndDate(e.target.value)}
                    />
                </div>
                </div>
                <div className="col-md-3">
                <label>Select Maturity Group Range (Min)</label>
                <InputGroup>
                <Form.Select name="min" value={MGMinValue} onChange={handleMGChange}>
                    {generateOptions(2.0, 8.0, 0.1).map((option) => (
                    <option key={`min-${option}`} value={option}>
                        {option}
                    </option>
                    ))}
                </Form.Select>
                <InputGroup.Text>to</InputGroup.Text>
                <Form.Select name="max" value={MGMaxValue} onChange={handleMGChange}>
                    {generateOptions(2.0, 8.0, 0.1).map((option) => (
                    <option key={`max-${option}`} value={option}>
                        {option}
                    </option>
                    ))}
                </Form.Select>
                </InputGroup>
                {error && <Alert variant="danger">{error}</Alert>}
                </div>
            </div>

            <Button
            variant="primary"
            onClick={sendDataToBackend}
            disabled={!isDataReady} // Disable button if data is invalid
            >
            Submit
            </Button>
            <hr></hr>
            {/* <h4 className="text-center">Planting Date Impact on Relative Yield Potential</h4> */}
            {/* <p><em>Yield Potential Maximized at 06 May 2024</em></p> */}
            
            <div className="container-fluid mb-2 mb-lg-3">
            {/* Graph for large screens */}
            <div className="d-none d-lg-block">
                <h4 className="text-center">Planting Date Impact on Relative Yield Potential</h4>
                <div className="border rounded p-3 bg-light">
                <PDGraph plotData={plotData} layout={layout} optimalDate={optimalDate} />
                </div>
            </div>

            {/* Graph for small screens */}
            <div className="d-block d-lg-none">
                <h4 className="text-center">Planting Date Impact on Relative Yield Potential</h4>
                <div className="border rounded p-3 bg-light">
                <PDGraph plotData={plotData} layout={layout} optimalDate={optimalDate} />
                </div>
            </div>
            </div>
        </div>
        </>
    );
}

export default PDOptimizer;
