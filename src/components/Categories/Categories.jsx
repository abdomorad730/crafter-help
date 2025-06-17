import React, { useContext, useEffect, useState } from "react";
import { TokenContext } from "../../Context/TokenContext";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../Loder/Loder";
import bg from '../../assets/images/hero1.jpg';
export default function Categories() {
let {role} =  useContext(TokenContext)
  const [Isloding, setIsloding] = useState(true)
  const [Categorie, setCategories] = useState([]);

  let headers = {
    Authorization: "Bearer " + localStorage.getItem("userToken"),
  };

  async function getCat() {
   
    try {
      const response = await axios.get("https://project1-kohl-iota.vercel.app/category", { headers });
      setCategories(response.data.categories);
      console.log(response.data.categories);
      setIsloding(false)
      
    } catch (error) {
      console.error("Error fetching catg:", error);
       setIsloding(false)
    }
  }

  async function deleteCategory(id) {
    try {
      await axios.delete(`https://project1-kohl-iota.vercel.app/category/delete/${id}`, { headers });
      setCategories(prev => prev.filter(item => item._id !== id));
      // console.log(data);
      
    } catch (error) {
      console.error("Error deleting brand:", error);
    }
  }

  useEffect(() => {
    getCat();
  }, []);

  return (
   <>
   {Isloding ? <Loader/> : <div className="min-h-screen transition-colors duration-500  py-10 px-4"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat', 
      }}
   >
     <div className=' flex items-center justify-center'>
       <h1 className="rounded-2xl  w-[300px] border-2 hover:scale-105 transition-all duration-150  border-purple-500 text-purple-500 font-extrabold text-3xl  shadow-lg shadow-purple-500 bg-stone-100 dark:bg-gray-800 p-4 text-center">
    Categories
  </h1>
  </div>
      <div className="grid grid-cols-1 pt-7 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
        {Categorie.map((category) => (
          <div
            key={category._id}
            className="w-64 bg-white shadow-xl shadow-purple-500 dark:bg-gray-900 border-2 border-purple-500 hover:border-none rounded-xl shadow-md p-4 flex flex-col items-center transition-all duration-300  hover:shadow  hover:border-purple-500 dark:hover:border-purple-400 hover:-translate-y-3 transform"
          >
            <div className="w-[210px] h-[200px] border shadow shadow-purple-300 mb-4 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center overflow-hidden">
              <img
                src={category.image.secure_url}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl uppercase font-extrabold text-orange-800 dark:text-blue-400 text-center mb-4">
              {category.name}
            </h2>
         <Link
  to={`/subCategory/${category.id}`}
  className="mt-auto bg-blue-500 btn hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg shadow-md"
>
  View Category Details
</Link>
          </div>
          
        ))}
      </div>
    </div>}
   </>
  );
}
