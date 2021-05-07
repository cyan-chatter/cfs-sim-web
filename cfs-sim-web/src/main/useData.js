import React, {useState, useEffect} from 'react'

export const useData = (urlData, postData) => {
    const [Data,setData] = useState(null)
    console.log('use data runs')
    
    //need to perform a POST request here with postData
    useEffect(()=>{

      console.log('use data -> useEffect runs')
      const fetchData = async (url) => {
        console.log('use data -> fetch runs with input: ')
        console.log(postData)    
        try{
            console.log("Try runs")

            const ResponseStream = await fetch(url,{
              method: 'POST', // *GET, POST, PUT, DELETE, etc.
              mode: 'cors', // no-cors, *cors, same-origin
              credentials: 'same-origin', // include, *same-origin, omit
              headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
              },
              redirect: 'follow', // manual, *follow, error
              referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
              body: JSON.stringify(postData) // body data type must match "Content-Type" header
            })
            const response = await ResponseStream.json()
            setData(response)
        }catch(e){
          console.log(e)        
        }
      }
      if(urlData && postData) fetchData(urlData)
    },[urlData,postData])  
    return Data;
}

//e.color = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
  