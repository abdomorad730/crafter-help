import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { TokenContext } from '../../../Context/TokenContext';

export default function ProtectedAdmin(props) {
  const { role } = useContext(TokenContext);
    if(role === "admin"){
    return props.children 
    }else{
      return <Navigate to="/home">

      </Navigate>
    }
  
}