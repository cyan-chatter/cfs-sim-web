import './App.css'
import React, {useState, useEffect, useRef} from 'react'
import InputForm from './InputForm'

const Input = ({copyValuesToRoot}) => {
    
    const [NInput, setNInput] = useState(null)
    const [IInput, setIInput] = useState(null)
    
    const [DisabledNInput, setDisabledNInput] = useState(false)
    const [DisabledSubmit, setDisabledSubmit] = useState(true)

    const [CurInputs,setCurInputs] = useState({I1 : null, I2: null, I3: null}) 
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
        setNInput({i1 : inputNumber1.current.value, i2 : inputNumber2.current.value})
        setIInput(inputNumber1.current.value)
        setDisabledNInput(true)
    }

    const handleInputChange = (e) => {
        if(e.target.name === "I1"){
            setCurInputs({
                ...CurInputs,
                I1 : e.target.value
            })
        }
        else if(e.target.name === "I2"){
            setCurInputs({
                ...CurInputs,
                I2 : e.target.value
            })
        }
        else if(e.target.name === "I3"){
            setCurInputs({
                ...CurInputs,
                I3 : e.target.value
            })
        }
    }

    const handleSubmit = () => {
        setInputValues([...InputValues,CurInputs])
        setCurInputs({I1 : null, I2: null, I3: null})
        setIInput(IInput-1)
    }

    const createInputForm = () => {
        return (<InputForm keyIndex = {IInput} onSubmit={handleSubmit} onInputChange={handleInputChange}/>)
    }
    
    const displayInputValues = () => {
        return InputValues.map( (el)=>{
            return (
                <tr>
                    <td>{el.I1}</td>
                    <td>{el.I2}</td>
                    <td>{el.I3}</td>
                </tr>
            )
        })
    }

    

    return (
        <>
        <h4>Enter Input Number 1</h4>
        <input type="number" className="InputNumber1" ref={inputNumber1}  disabled = {DisabledNInput}></input>
        <h4>Enter Input Number 2</h4>
        <input type="number" className="InputNumber2" ref={inputNumber2}  disabled = {DisabledNInput}></input>
        <br/>
        <button className="TempButton" onClick={onFixNumber} disabled = {DisabledNInput}>Enter Input Numbers</button>
        <div className="InputValues"> 
            <h3>Input Values:</h3> 
            <div>{NInput ? (<><p>Input Number 1 : {NInput.i1}</p><p>Input Number 2 : {NInput.i2}</p></>) : null }</div> 
            <div>{InputValues ? (<table className="InputValuesTable"> <tr> <th>I1</th> <th>I2</th> <th>I3</th> </tr> {displayInputValues()}</table>) : (<p>NONE</p>)}</div> 
        </div>
        <div className="InputForm"> {IInput > 0 ? createInputForm() : null} </div>
        </>
    )
}

export default Input