import React, { useState,useEffect } from "react";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';

function PDOptimizer(){
    const [MGMinValue,setMGMinValue] = useState('2.0')
    const [MGMaxValue,setMGMaxValue] = useState('8.0')
    const [error, setError] = useState('');
    
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
        } else {
          setError('');
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
            {/* <p>Selected location is <em>N. Piedmont</em></p> */}
            <h4>Adjust Planting Date and Maturity Groups</h4>
            <div className="row mb-3">
                <div className="col-md-3">
                <div className="form-group">
                    <label>Planting Start Date</label>
                    <input 
                    type="date" 
                    className="form-control" 
                    defaultValue="2024-04-01" 
                    />
                </div>
                </div>
                <div className="col-md-3">
                <div className="form-group">
                    <label>Planting End Date</label>
                    <input 
                    type="date" 
                    className="form-control" 
                    defaultValue="2024-08-15" 
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

            <h4 className="text-center">Planting Date Impact on Relative Yield Potential</h4>
            {/* <p><em>Yield Potential Maximized at 06 May 2024</em></p> */}
            
            <div className="border rounded p-4 text-center bg-light">
                Graph Content
            </div>
        </div>
        </>
    );
}

export default PDOptimizer;