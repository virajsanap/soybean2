import React, { useState,useEffect } from "react";
import { InputGroup, Form, Alert, Button } from 'react-bootstrap';
import { RegionContext, RegionProvider } from "./RegionContext";
import MGGraph from "./MGGraph";


function MGOptimizer(){
    const [MgPlotData, setMgPlotData] = useState(null)
    const [MgOptimalDate, setMgOptimalDate] = useState("");
    const [layout, setLayout] = useState({});
    const [MGMinValue,setMGMinValue] = useState('2.0')
    const [MGMaxValue,setMGMaxValue] = useState('8.0')
    const [startDate, setStartDate] = useState('2024-04-01');
    const [endDate, setEndDate] = useState('2024-08-15');
    const [error, setError] = useState('');
    const [isDataReady, setIsDataReady] = useState(false);

    const sendDataToBackend = async () => {
        const data = {
          start_date: startDate,
          end_date: endDate,
          mg_min: MGMinValue,
          mg_max: MGMaxValue,
        };

        try {
            // const response = await fetch(`http://3.16.192.151:8000/api/mg_optimiser`, {
            const response = await fetch(`http://localhost:8000/api/mg_optimiser`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
              });
  
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const result = await response.json();
          
          // Remove JSON.parse since backend returns direct JSON
          setMgPlotData(result.plot.data);
          setLayout(result.plot.layout);
          setMgOptimalDate(result.optimal_mg);  // Changed from optimal_date to optimal_mg
          setError('');
  
      } catch (error) {
          console.error('Fetch error:', error);
          setError('Failed to fetch maturity group data');
          setMgPlotData(null);
          setLayout({});
      }
  };
    
    // Update handleMGChange with better validation
    const handleMGChange = (event) => {
      const { name, value } = event.target;
      const numericValue = parseFloat(value).toFixed(1);
      
      if (name === 'min') {
          setMGMinValue(numericValue);
      } else if (name === 'max') {
          setMGMaxValue(numericValue);
      }
    };

    useEffect(() => {
        const min = parseFloat(MGMinValue);
        const max = parseFloat(MGMaxValue);
        const isValid = !isNaN(min) && !isNaN(max) && min < max;
    
        setIsDataReady(isValid);
        setError(isValid ? '' : 'Minimum must be less than Maximum');
    
        // Update layout with new x-axis range
        if (MgPlotData) {
            setLayout(prevLayout => ({
                ...prevLayout,
                xaxis: { 
                    ...prevLayout.xaxis, 
                    range: [min, max],
                    type: 'linear'  // Ensure axis type is linear
                }
            }));
        }
    }, [MGMinValue, MGMaxValue, MgPlotData]);
    

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
            <h2>Maturity Group Optimization</h2>
            {/* <p>Selected location is <em>N. Piedmont</em></p> */}
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

            <div className="container-fluid mb-2 mb-lg-3">
            {/* Graph for large screens */}
            <div className="d-none d-lg-block">
            <h4 className="text-center">Maturity Group Impact on Relative Yield Potential</h4>
                <div className="border rounded p-3 bg-light">
                <MGGraph plotData={MgPlotData} layout={layout} optimalDate={MgOptimalDate} />
                </div>
            </div>

            {/* Graph for small screens */}
            <div className="d-block d-lg-none">
                <h4 className="text-center">Maturity Group Impact on Relative Yield Potential</h4>
                <div className="border rounded p-3 bg-light">
                <MGGraph plotData={MgPlotData} layout={layout} optimalDate={MgOptimalDate} />
                </div>
            </div>
            </div>

        </div>
        </>
    );
}

export default MGOptimizer;
