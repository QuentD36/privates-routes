import React, {useState, useEffect} from 'react';
import {Outlet, Navigate} from 'react-router-dom';
import axios from "axios";
import Config from "../config.json";

const PrivateRoutes = () => {
    const [tokenValid, setTokenValid] = useState();

    useEffect(() => {
        const checkToken = async () => {
            let token = localStorage.getItem('token')
            var response = await axios.get(Config.BASE_URL + '/api/checkToken', {
                headers:{
                    'Authorization': `Bearer ${token}` 
                }
            })
            // console.log(response)
            setTokenValid(response.data.success);
        }
        checkToken();
    }, [])

    console.log(tokenValid)
    return tokenValid ?  <Navigate to="/" /> : <Outlet />;
};

export default PrivateRoutes;
