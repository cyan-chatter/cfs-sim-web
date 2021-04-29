import React, {useState, useEffect} from 'react'
export const useData = (urlData) => {
    const [Data,setData] = useState(null)
    console.log('use data runs')
    useEffect(()=>{
      console.log('use data -> useEffect runs')
      const fetchData = async (url) => {
        try{
            const ResponseStream = await fetch(url)
            const d = await ResponseStream.json()       
            setData(d)
        }catch(e){
          console.log(e)        
        }
      }
      if(urlData) fetchData(urlData)
    },[urlData])
  
    return Data;
}

//e.color = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
  