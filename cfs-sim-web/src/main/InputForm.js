import '../design/App.css'
import React, {useState, useEffect} from 'react'

const InputForm = (props) => {
    
    return (
        <form key={"F" + props.keyIndex}>
            <input name="I1" type="text" onChange={props.onInputChange}></input>
            <input name="I2" type="number" onChange={props.onInputChange}></input>
            <input name="I3" type="number" onChange={props.onInputChange}></input>
            <button className="TempButton" onClick={props.onSubmit}>Submit</button>
        </form>        
    )
    
}

export default InputForm