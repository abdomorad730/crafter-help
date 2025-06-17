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
const Profile = () => {
  const [WishList, setWishList] = useState([])
  const [Loder, setLoder] = useState(true)
  const [Profile, setProfile] = useState(null)
  let { headers } = useContext(TokenContext)
  let { CartItem, getProductToCart,cartN ,addProduct} = useContext(CartContext)
  const [wishlistnam, setwishlistnam] = useState(0)
// const [namCart, setnamCart] = useState(0)

   async function addToCart(productId, quantity) {
    await addProduct(productId, quantity);
  }

  // جلب بيانات الملف الشخصي
  async function getProfile() {
    await axios.get("https://project1-kohl-iota.vercel.app/users/profile", { headers }).then((data) => {
      setProfile(data.data.user)
      setLoder(false)
    }).catch((error) => {
      console.log(error);
      setLoder(false)
    })
  }

  async function getWishList(){
    await axios.get("https://project1-kohl-iota.vercel.app/product/r/washlist" , { headers }).then((data)=>{
      // console.log(data.data.user.washlist.length);
setwishlistnam(data.data.user.washlist.length)
      setWishList(data.data.user.washlist)
      
    }).catch((error)=>{
      console.log(error);
      
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
  // async function getProductToCartt() {
  //     try {
  //       const response = await axios.get("https://project1-kohl-iota.vercel.app/cart", { headers });
       
  //       setnamCart(response.data.cart.products.length)
  //       return response;
      
        

  //     } catch (error) {
  //       return error;
  //     }
  //   }


  useEffect(() => {
    getProfile()
    // getProductToCartt()
    getProductToCart()
    getWishList()
  }, []);

  return (
    <>
      <Toaster position=" bottom-center" reverseOrder={false} /> {/* ✅ عرض التوست */}

      {Loder ? <Loader /> : <div className="max-w-4xl border border-purple-400 shadow-purple-500 mx-auto my-20 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row my-16 items-center gap-8">
          
          {/* صورة البروفايل */}
          <div className="flex-shrink-0 my-4 mx-12">
            <img
              className="w-40 h-40 rounded-full object-cover border-4 border-purple-500 shadow-md"
              src={Profile?.image?.secure_url || `https://ui-avatars.com/api/?name=${Profile?.name}&background=0D8ABC&color=fff`}
              alt="Profile"
            />
          </div>

          <div className="flex-1 w-full">
            {/* الاسم */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
              <h2 className="text-2xl uppercase font-semibold text-purple-700 dark:text-purple-700">
                {Profile?.name}
              </h2>
            </div>

            {/* إحصائيات */}
           <div className="flex gap-8 mb-4">
  <div className="flex items-center gap-1">
    <span className="font-bold text-main dark:text-main">{cartN}</span>
    <span className="font-extrabold text-gray-800 dark:text-gray-300">Products in the Cart</span>
    <ShoppingCart className=' text-main' size={20} />

  </div>
  <div className="flex items-center gap-1">
    <span className="font-bold text-red-800 dark:text-red-800">{wishlistnam}</span>
    <span className="font-extrabold text-gray-800 dark:text-gray-300">Favorite Products</span>
        <FaHeart className="text-red-600 dark:text-red-800" />

  </div>
</div>

            {/* الايميل */}
            <div className="flex items-center gap-2 mb-2">
              <Mail className="text-black dark:text-white w-5 h-5" />
              <span className="text-gray-800 font-bold dark:text-white">{Profile?.email}</span>
            </div>

            {/* البايو أو العنوان */}
<div className="flex items-center gap-2 mb-2">
  <FaInfoCircle className="text-gray-600 dark:text-gray-400 mr-2" />
  <p className="text-gray-800 font-bold dark:text-white">
    {Profile?.bio || Profile?.address || "No bio available."}
  </p>
</div>        <div className="mt-2 flex items-center space-x-1">
  <FaKey className="text-blue-600 dark:text-blue-400" />
  <Link
    to="/ChangePassword"
    className="text-sm font-extrabold text-blue-600 hover:underline dark:text-blue-400"
  >
    Change Password?
  </Link>
</div>
          </div>
        </div>
      </div>}


     <div className="border-t  py-10">
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
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 transition-transform transform hover:-translate-y-2 hover:shadow-2xl"
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
              className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-300"
            >
              Remove
            </button>

            <button
    onClick={() => addToCart(product._id, 1)}
    className="flex-1 flex items-center justify-center gap-2 bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition duration-300"
  >
    <ShoppingCart size={20} />
    Add to Cart
  </button>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

    </>
  );
};

export default Profile;
