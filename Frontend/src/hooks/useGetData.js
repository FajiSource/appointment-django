import { useEffect, useState } from "react";

export default function useGetData( api ) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
            
    useEffect(()=>{
        const getData = async () => {
            setLoading(true)
            try{
                const res = await fetch(api)
                const data = await res.json();
                setData(data)
            }catch{
                setError("Server Error!")
            }finally{
                setLoading(false)
            }
        }
        
        getData()
    },[api])

    return {
        data,
        loading,
        error
    }
}
