import axios from "axios"

const commomAPI=async(httpmethod,url,reqBody,reqHeader)=>{
    const reqConfig={
        method:httpmethod,
        url,
        data:reqBody,
        headers:reqHeader?reqHeader:{"Content-Type":"application/json"}
    }
    return await axios(reqConfig).then(res=>res).catch(err=>err.response)
}


export default commomAPI