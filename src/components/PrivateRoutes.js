
import {Outlet, Navigate} from 'react-router-dom';
import axios from "axios";
import { useState } from 'react';

async function check(){
    var test = false
    let token = localStorage.getItem('token')

    await axios.post('http://localhost:8888/savage-dreams/api/checkToken', {
        data: token
    },{
        headers:{
            'Authorization': `Bearer ${token}` 
        }
    }).then((response) => {
        test = true
    })
    return test
}

const PrivateRoutes = () => {
    
    var data = check()
    console.log(data)
    
    return data ?   <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;