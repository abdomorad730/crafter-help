import React, { useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { CartContext } from '../../Context/CartContext';
import { TokenContext } from '../../Context/TokenContext';
import Loader from '../Loder/Loder';
import toast, { Toaster } from 'react-hot-toast';

export default function AllProducts() {
  const [Loder, setLoder] = useState(true);
  const [products, setProducts] = useState([]);
  const [userId] = useState(() => localStorage.getItem("userid"));
  const [wishList, setWishList] = useState([]); // ✅ من السيرفر

  const navigate = useNavigate();
  const { role, headers } = useContext(TokenContext);
  const { addProduct } = useContext(CartContext);

  async function addToCart(productId, quantity) {
    await addProduct(productId, quantity);
  }

  // ✅ جلب الـ wishlist من السيرفر
  async function fetchWishList() {
    try {
      const { data } = await axios.get("https://project1-kohl-iota.vercel.app/product/r/washlist", { headers });
      const wishListIds = data.user.washlist.map((item) => item._id);
      setWishList(wishListIds);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    }
  }

  // ✅ جلب البيانات عند التحميل
  useEffect(() => {
    fetchWishList();
  }, []);

  // ✅ جلب المنتجات
  const { data, isLoading, isError } = useQuery({
    queryKey: ['allProducts'],
    queryFn: async () => {
      const res = await axios.get("https://project1-kohl-iota.vercel.app/product");
      setLoder(false);
      return res.data;
    },
  });

  useEffect(() => {
    if (data?.products) {
      setProducts(data.products);
    }
  }, [data]);

  // ✅ تعديل الـ wishlist في السيرفر وتحديث الـ state
  async function addToWishList(id) {
    try {
      await axios.patch(`https://project1-kohl-iota.vercel.app/product/washlist/${id}`, {}, { headers });
      fetchWishList(); // تحديث بعد الإضافة أو الحذف

      const isAdded = !wishList.includes(id);
      toast.success(isAdded ? 'Added to Wishlist' : 'Removed from Wishlist');
    } catch (error) {
      toast.error('Failed to update Wishlist');
      console.error(error);
    }
  }

  async function deleatProduct(id) {
    try {
      await axios.delete(`https://project1-kohl-iota.vercel.app/product/delete/${id}`, { headers });
      toast.success("Product deleted successfully");
      setProducts((prev) => prev.filter((product) => product._id !== id));
    } catch (error) {
      toast.error("Failed to delete product");
      console.error(error);
    }
  }

  if (isError) {
    setLoder(false);
    return <div className="text-center py-10 text-red-500">Error</div>;
  }

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />

      {Loder ? (
        <Loader />
      ) : (
        <div className="container border-t mt-2 mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-10 px-4">
            {role === "crafter" ? (
              <Link
                to="/addProduct"
                className="shadow-lg px-6 font-extrabold shadow-purple-500 py-3 text-lg bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition"
              >
                Add Product +
              </Link>
            ) : (
              <div className="w-[148px]" />
            )}

            <h1 className="rounded-2xl px-8 border-2 hover:scale-105 transition-all duration-150 border-purple-500 text-purple-500 font-extrabold text-4xl shadow-lg bg-stone-100 dark:bg-gray-800 p-4 text-center">
              All Products
            </h1>

            <div className="w-[148px]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((item) => {
              const isInWishList = wishList.includes(item._id);

              return (
                <div
                  key={item._id}
                  className="relative border-2 border-purple-400 hover:border-none flex flex-col bg-white shadow-xl dark:bg-gray-800 rounded-2xl overflow-hidden transition-all duration-500 shadow-2xl shadow-purple-500 hover:border-purple-500 hover:-translate-y-2"
                >
                  <Link to={`/productDetails/${item._id}`}>
                    <img
                      src={item.imageCover?.secure_url}
                      alt={item.name}
                      className="w-full h-52 object-cover rounded-t-2xl"
                    />

                    <div className="p-4 space-y-2">
                      <h3 className="text-lg uppercase font-bold text-purple-500 text-center">
                        {item.name}
                      </h3>
                      <p className="text-sm text-center text-gray-700 dark:text-gray-300 line-clamp-2">
                        {item.describtion}
                      </p>

                      <div className="flex justify-between items-center mt-4">
                        <span className="text-green-600 font-bold text-lg">${item.price}</span>
                        <span className="text-yellow-500 flex items-center gap-1 text-sm">
                          ⭐ {item.avgRating}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="flex gap-2 p-3 pt-0 mt-auto">
                    <button
                      onClick={() => addToCart(item._id, 1)}
                      className="flex-1 flex items-center justify-center gap-2 bg-purple-400 hover:bg-purple-700 text-white text-sm py-2 rounded-xl transition"
                    >
                      Add To Cart
                      <ShoppingCart size={18} />
                    </button>

                    <button
                      onClick={() => addToWishList(item._id)}
                      className="w-10 h-10 flex shadow shadow-red-400 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-gray-600 transition"
                    >
                      <Heart
                        size={22}
                        className={`transition ${
                          isInWishList
                            ? 'fill-red-500 stroke-red-500'
                            : 'stroke-gray-400 hover:stroke-red-500'
                        }`}
                      />
                    </button>
                  </div>

                  {userId === item.userId && (
                    <div className="p-3 flex justify-between gap-3">
                      <button
                        onClick={() => deleatProduct(item._id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-4 rounded-xl shadow-md transition duration-300 dark:bg-red-500 dark:hover:bg-red-600"
                      >
                        <i className="fa-solid fa-trash mr-2"></i>Delete
                      </button>
                      <button
                        onClick={() => navigate(`/updateProduct/${item._id}`)}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-4 rounded-xl shadow-md transition duration-300 dark:bg-yellow-400 dark:hover:bg-yellow-500"
                      >
                        <i className="fa-solid fa-pen-to-square mr-2"></i>Update
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
