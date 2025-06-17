import React, { useState } from 'react';
import imagg from "../../assets/images/delif.jpg";

export default function AllOrder() {
// const [orders, setorders] = useState(second)
  
//     async function getAllOrder(){
//       await axios.get("https://project1-kohl-iota.vercel.app/order" , {headers}).then((data)=>{
        
//         console.log(data);
        
//         setorders(data.data.orders)
//       }).catch((error)=>{
//         console.log(error);
        
//       })
//     }
   
  return (
    <>
      <div className="relative w-full h-screen">
        <img 
          src={imagg} 
          className="w-full h-full " 
          alt="Delivery" 
        />
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-white text-2xl font-bold shadow-md p-4 bg-black bg-opacity-50 rounded">
        The distance of the road and we will reach you..
        </div>
      </div>
    </>
  );
}
