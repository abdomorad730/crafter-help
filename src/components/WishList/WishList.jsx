import React, { useContext, useEffect, useState } from 'react';
import { User, Mail, Shield } from "lucide-react";
import { TokenContext } from '../../Context/TokenContext';
import axios from 'axios';
import Loader from '../Loder/Loder';
import { CartContext } from '../../Context/CartContext';
import { data } from 'autoprefixer';
import { ShoppingCart } from "lucide-react";
import { FaHeart } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { FaKey } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export default function WishList() {

  const [WishList, setWishList] = useState([])
  const [Loder, setLoder] = useState(true)
  let { headers } = useContext(TokenContext)
  let { addProduct} = useContext(CartContext)

      
   async function addToCart(productId, quantity) {
    await addProduct(productId, quantity);
  }

     async function getWishList(){
        await axios.get("https://project1-kohl-iota.vercel.app/product/r/washlist" , { headers }).then((data)=>{
          // console.log(data.data.user.washlist);
          setWishList(data.data.user.washlist)
          setLoder(false)
        }).catch((error)=>{
          console.log(error);
          setLoder(false)
          
        })
      }
      async function removeFromWishlist(productId) {
        try {
          const { data } = await axios.patch(
            `https://project1-kohl-iota.vercel.app/product/washlist/${productId}`,
            {},
            { headers }
          );
      
          // ✅ شيل المنتج من الـ state مباشرة
          setWishList((prev) => prev.filter((item) => item._id !== productId));
      
          // ✅ رسالة تأكيد (اختياري)
           toast.success("Product removed from wishlist successfully!");
      
        } catch (error) {
          console.log("Error removing from wishlist:", error);
        }
      }
        useEffect(() => {
        
          getWishList()
        }, []);
  return (
    <>
   {Loder?<Loader/> :      <div className="  py-6">
      <div className="container mx-auto px-4">
      
         <div className=' flex items-center justify-center'>
           <h1 className="rounded-2xl mb-8 w-[300px] border-2 hover:scale-105 transition-all duration-150  border-purple-500 text-purple-500 font-extrabold text-3xl  shadow-lg shadow-purple-500 bg-stone-100 dark:bg-gray-800 p-4 text-center">
         My Favorite Products
      </h1>
      </div>
    
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {WishList.map((product) => (
            <div
              key={product._id}
              className="bg-white shadow-lg shadow-purple-500 border border-purple-400 hover:border-none dark:bg-gray-800 rounded-xl shadow-lg p-4 transition-transform transform hover:-translate-y-2 hover:shadow-2xl"
            >
              <img
                src={product.imageCover.secure_url}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
    
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {product.name}
                </h3>
    
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                  {product.describtion}
                </p>
    
                <div className="flex justify-between items-center mt-2">
                  <p className="text-green-600 font-bold">${product.price}</p>
                  <p className="flex items-center text-yellow-500 font-semibold text-sm">
                    ⭐ {product.rate || product.avgRating || 0}
                  </p>
                </div>
              </div>
    
              <div className="mt-4 flex gap-3">
              <button
    onClick={() => removeFromWishlist(product._id)}
    className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-300"
  >
    <span>Remove</span>
    <MdDelete size={20} />

  </button>

                <button
        onClick={() => addToCart(product._id, 1)}
        className="flex-1 flex items-center justify-center gap-2 bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition duration-300"
      >
        Add to Cart
        <ShoppingCart size={20} />

      </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>}
    </>
  )
}
