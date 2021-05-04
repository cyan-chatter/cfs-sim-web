import '../design/App.css'
import '../design/Input.css'
import React, {useState, useEffect} from 'react'

const InputForm = (props) => {
    
    return (
        <React.Fragment key={"F" + props.keyIndex}>
            <p className="labelInputBinder">
            <label> Enter Process ID </label>
            <input name="I1" type="text" onChange={props.onInputChange}></input>
            </p>
            <p className="labelInputBinder">
            <label> Enter Arrival Time </label>
            <input name="I2" type="number" onChange={props.onInputChange}></input>
            </p>    
            <p className="labelInputBinder">
            <label> Enter Burst Time </label>
            <input name="I3" type="number" onChange={props.onInputChange}></input>
            </p>
            <p className="labelInputBinder">
            <label> Enter Priority </label>
            <input name="I4" type="number" onChange={props.onInputChange}></input>
            </p>
            <p className="labelInputBinder">
            <button className="TempButton" id="Submit" onClick={props.onSubmit}>Submit</button>
            </p>
        </React.Fragment>        
    )
    
}

export default InputForm