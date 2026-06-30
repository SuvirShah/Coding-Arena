import axios from "axios";



const axiosClient=axios.create({
    baseURL:'https://codearena-backend-g0bt.onrender.com',
    withCredentials:true,
    headers:{
        'Content-Type':'application/json'
    }
})

export default axiosClient;