import React, { useState,useEffect, useContext } from "react";
import { InputGroup, Form, Alert, Button } from 'react-bootstrap';
import { RegionContext, RegionProvider } from "./RegionContext";
import PDGraph from "./PDGraph";

function PDOptimizer(){
    const Region = useContext(RegionContext)
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
            const response = await fetch('http://localhost:8181/api/pd_optimiser', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            });
      
            if (!response.ok) {
              console.error('Failed to send data to backend');
            } else {
              const result = await response.json();
              console.log('Response from backend:', result);

              // Update graph data
              setPlotData(JSON.parse(result.plot).data);
              setLayout(JSON.parse(result.plot).layout);
              setOptimalDate(result.optimal_date);
            }
          } catch (error) {
            console.error('Error:', error);
          }
    };
    
    const handleMGChange = (event)=>{
        const {name,value} = event.target;
        if (name==='min'){
            setMGMinValue(value)
        }else if(name==='max'){
            setMGMaxValue(value)
        } 
    };

    useEffect(() => {
        if (parseFloat(MGMinValue) >= parseFloat(MGMaxValue)) {
          setError('Minimum value must be less than maximum value');
          setIsDataReady(false)
        } else {
          setError('');
          setIsDataReady(true)
        }
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
            {/* <p>Selected location is {Region}</p> */}
            <h4>Adjust Planting Date and Maturity Groups</h4>
            <div className="row mb-3">
                <div className="col-md-3">
                <div className="form-group">
                    <label>Planting Start Date</label>
                    <input 
                    type="date" 
                    className="form-control" 
                    value="2024-04-01"
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
                    value="2024-08-15" 
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