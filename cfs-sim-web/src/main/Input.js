import '../design/App.css'
import React, {useState, useEffect, useRef} from 'react'
import InputForm from './InputForm'
import '../design/Input.css'

const Input = ({copyValuesToRoot}) => {
    
    const [NInput, setNInput] = useState(null)
    const [IInput, setIInput] = useState(null)
    
    const [DisabledNInput, setDisabledNInput] = useState(false)
    const [DisabledSubmit, setDisabledSubmit] = useState(true)

    const [CurInputs,setCurInputs] = useState({id : null, at: null, bt: null, p: null}) 
    const [InputValues, setInputValues] = useState([])

    const inputNumber1 = useRef(0)
    const inputNumber2 = useRef(0)

    useEffect(() => {
        
        if(IInput === 0){ 
            console.log('IInput got to 0')
            copyValuesToRoot(NInput,InputValues)
            //setDisabledNInput(false)
        }
        
    }, [IInput])

    const onFixNumber = () => {
        setNInput({n : inputNumber1.current.value, tq : inputNumber2.current.value})
        setIInput(+(inputNumber1.current.value))
        setDisabledNInput(true)
    }

    const handleInputChange = (e) => {
        if(e.target.name === "I1"){
            setCurInputs({
                ...CurInputs,
                id : e.target.value
            })
        }
        else if(e.target.name === "I2"){
            setCurInputs({
                ...CurInputs,
                at : e.target.value
            })
        }
        else if(e.target.name === "I3"){
            setCurInputs({
                ...CurInputs,
                bt : e.target.value
            })
        }
        else if(e.target.name === "I4"){
            setCurInputs({
                ...CurInputs,
                p : e.target.value
            })
        }
    }

    const handleSubmit = () => {
        setInputValues([...InputValues,CurInputs])
        setCurInputs({id: null, at: null, bt: null, p: null})
        setIInput(IInput-1)
    }

    const createInputForm = () => {
        return (<InputForm keyIndex = {IInput} onSubmit={handleSubmit} onInputChange={handleInputChange}/>)
    }
    
    const displayInputValues = () => {
        return InputValues.map( (el)=>{
            return (
                <tr>
                    <td>{el.id}</td>
                    <td>{el.at}</td>
                    <td>{el.bt}</td>
                    <td>{el.p}</td>
                </tr>
            )
        })
    }

    return (
        <>
        <div className="InputMain">
        <div className = "InputStart">
        <p className="labelInputBinder">
        <label>Enter Number of Processes</label>
        <input type="number" className="InputNumber" ref={inputNumber1}  disabled = {DisabledNInput}></input>
        </p>
        <p className="labelInputBinder">
        <label>Enter Time Quantum</label>
        <input type="number" className="InputNumber" ref={inputNumber2}  disabled = {DisabledNInput}></input>
        </p>
        <button className="TempButton" id="Enter" onClick={onFixNumber} disabled = {DisabledNInput}> Enter </button>
        </div>    
        <div className="InputForm"> {IInput > 0 ? createInputForm() : null} </div>
        </div>
        <div className="InputValues"> 
            <h3>Values:</h3>
            <div>{NInput ? (<><p><b className="highlight">Number of Processes</b> = <b className="highlight">{NInput.n}</b></p><p><b className="highlight">Time Quantum</b> = <b className="highlight">{NInput.tq}</b></p></>) : null }</div> 
            <div>{InputValues ? (<table className="InputValuesTable"> <tr> <th>Process ID</th> <th>Arrival Time</th> <th>Burst Time</th> <th>Priority</th> </tr> {displayInputValues()}</table>) : (<p>Enter the input values</p>)}</div> 
        </div>
        </>
    )
}

export default Input