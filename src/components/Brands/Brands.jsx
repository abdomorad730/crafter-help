import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import Loader from '../Loder/Loder';
import { TokenContext } from '../../Context/TokenContext';
import bg from '../../assets/images/hero1.jpg';
import { Link } from 'react-router-dom';

export default function Brands() {
  let { role } = useContext(TokenContext)
  const [isLoding, setisLoding] = useState(true);
  const [data, setData] = useState([]);
  let headers = {
    Authorization: "Bearer " + localStorage.getItem("userToken") // تعديل هنا
  };

  async function getBrand() {
    try {
      const response = await axios.get("https://project1-kohl-iota.vercel.app/brand", { headers });
      // console.log(response.data.brands);
      setData(response.data.brands);
      setisLoding(false);
    } catch (error) {
      console.error("Error fetching brand:", error);
      setisLoding(false);
    }
  }

  useEffect(() => {
    getBrand();
  }, []);

  async function deleteBrand(id) {
    try {
      await axios.delete(`https://project1-kohl-iota.vercel.app/brand/delete/${id}`, { headers });
      setData(prev => prev.filter(item => item._id !== id));
      // console.log(data);

    } catch (error) {
      console.error("Error deleting brand:", error);
    }
  }

  return (
    <>
      {isLoding ? <Loader /> : <div className="py-12 px-6   transition-colors duration-500"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className=' flex items-center  justify-center'>
          <h1 className="rounded-2xl  w-[300px] border-2 hover:scale-105 transition-all duration-150  border-purple-500 text-purple-500 font-extrabold text-3xl  shadow-lg shadow-purple-500 bg-stone-100 dark:bg-gray-800 p-4 text-center">
            All Brands
          </h1>
        </div>
        <div className="grid gap-8 pt-7 grid-cols-1 sm:grid-cols-2 text-center md:grid-cols-3 lg:grid-cols-4 place-items-center">
          {data.map((item, id) => (
            <div
              key={id}
              className="w-64 bg-white shadow-xl shadow-purple-500 dark:bg-black border-2 border-purple-500 hover:border-none rounded-2xl shadow-md overflow-hidden transform transition-all duration-700 hover:shadow-2xl hover:-translate-y-3 hover:border-purple-800 dark:hover:border-purple-400"
            >
              <div className="w-full h-60 overflow-hidden">
                {item?.image?.secure_url ? (
                  <img
                    src={item.image.secure_url}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-200 text-sm">
                    No Image Available
                  </div>
                )}

              </div>
              <div className="p-4">
                <h2 className="text-center uppercase mb-4 text-lg font-semibold text-orange-800 dark:text-blue-400">
                  {item.name}
                </h2>
                <Link
                  to={`/brand/${item._id}`}
                  className="mt-auto bg-blue-500 btn   hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg shadow-md"
                >
                  View Brand Details
                </Link>
              </div>

              {/* {role ==="admin" ?<div className="p-4 flex justify-between gap-3">
                <button
                  onClick={() => deleteBrand(item.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-4 rounded-xl shadow-md transition duration-300 ease-in-out dark:bg-red-500 dark:hover:bg-red-600"
                >
                  <i className="fa-solid fa-trash mr-2"></i>
                  Delete
                </button>
                <button
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-4 rounded-xl shadow-md transition duration-300 ease-in-out dark:bg-yellow-400 dark:hover:bg-yellow-500"
                >
                  <i className="fa-solid fa-pen-to-square mr-2"></i>
                  Update
                </button>
              </div>:null} */}
            </div>
          ))}
        </div>
      </div>}
    </>
  );
}
