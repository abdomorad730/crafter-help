import React, { useContext, useEffect, useState } from 'react'
import { TokenContext } from '../../Context/TokenContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CartContext } from '../../Context/CartContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Heart, ShoppingCart } from 'lucide-react';
import Loader from '../Loder/Loder';

export default function BrandDetails() {
    const { id } = useParams();
    const [subCategoryData, setSubCategoryData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    let headers = {
        Authorization: "Bearer " + localStorage.getItem("userToken")
    };
    const [Loder, setLoder] = useState(true);
    const [products, setProducts] = useState([]);
    const [userId] = useState(() => localStorage.getItem("userid"));
    const [wishList, setWishList] = useState([]); // ✅ من السيرفر

    const navigate = useNavigate();
    const { role } = useContext(TokenContext);
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

    // دالة لجلب بيانات الفئات الفرعية
    async function getSubCat(id) {
        try {
            const { data } = await axios.get(`https://project1-kohl-iota.vercel.app/brand/SpecificBrand/${id}`, { headers });
            setLoading(false);
            setProducts(data.products);
            console.log(data)
        } catch (err) {
            console.error(err);
            setLoading(false);
            setError("Failed to fetch subcategory data.");
            toast.error("Failed to fetch subcategory data.");
        }
    }
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
    useEffect(() => {
        getSubCat(id)
    })

    return <>
        {loading ? <Loader /> :
            <div className="container border-t mt-2 mx-auto px-4 py-6">
                <div className="flex items-center justify-between mb-10 px-4">

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
                                            className={`transition ${isInWishList
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
            </div>}</>
}
