import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import Loader from "../Loder/Loder";
import { FaStar } from 'react-icons/fa';
import { CartContext } from "../../Context/CartContext";
import { TokenContext } from "../../Context/TokenContext";
import toast, { Toaster } from "react-hot-toast";
import Slider from "react-slick";

export default function ProductDetails() {
  const { id } = useParams();
  const { addProduct } = useContext(CartContext);
  const { headers } = useContext(TokenContext);

  const [productDetails, setProductDetails] = useState(null);
  const [isLoader, setIsLoader] = useState(true);
  const [wishList, setWishList] = useState(() => {
    const stored = localStorage.getItem("wishList");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("wishList", JSON.stringify(wishList));
  }, [wishList]);

  useEffect(() => {
    getProductDetails();
  }, []);

  async function getProductDetails() {
    try {
      const { data } = await axios.get(`https://project1-kohl-iota.vercel.app/product/${id}`);
      setProductDetails(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoader(false);
    }
  }

  async function addToCart(productId) {
    try {
      await addProduct(productId, 1);
      toast.success("Added to cart");
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  }

  async function addToWishList(productId) {
    try {
      await axios.patch(`https://project1-kohl-iota.vercel.app/product/washlist/${productId}`, {}, { headers });
      const isAdded = !wishList.includes(productId);
      setWishList((prev) =>
        isAdded ? [...prev, productId] : prev.filter((id) => id !== productId)
      );
      toast.success(isAdded ? "Added to Wishlist" : "Removed from Wishlist");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update Wishlist");
    }
  }

  if (isLoader) return <Loader />;
  if (!productDetails) return <div className="text-center text-red-500 py-10">No product found</div>;

  const product = productDetails.product;
  const images = product.images || [];
  const isInWishList = wishList.includes(product._id);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 1000,
    pauseOnHover: true,
  };

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      <div className="max-w-5xl mx-auto my-20 p-6 grid grid-cols-1 md:grid-cols-2 gap-12 bg-white dark:bg-gray-900 rounded-3xl shadow-xl">
        <div className="flex justify-center items-center">
          <Slider {...sliderSettings} className="w-[400px] h-[300px] rounded-3xl shadow-lg overflow-hidden">
            {[product.imageCover, ...images].map((img, index) => (
              <div key={index} className="w-full h-full">
                <img
                  src={img.secure_url}
                  alt={`Product ${index}`}
                  className="w-full h-full object-cover rounded-3xl"
                />
              </div>
            ))}
          </Slider>
        </div>

        <div className="flex flex-col justify-between py-4 px-2">
          <div>
            <h2 className="text-4xl font-extrabold text-purple-600 mb-4">
              {product.name}
            </h2>

            <p className="text-gray-600 font-bold dark:text-gray-300 mb-6 text-lg leading-relaxed">
              {product.describtion}
            </p>

            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-2">
                <FaStar className="text-yellow-400 text-2xl" />
                <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  {product.avgRating}
                </span>
              </div>

              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                ${product.price}
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-auto">
            <button
              onClick={() => addToCart(product._id)}
              className="flex items-center justify-center gap-2 flex-1 text-xl py-2 bg-purple-500 hover:bg-purple-700 text-white rounded-lg transition duration-300"
            >
              Add To Cart
              <ShoppingCart size={22} />
            </button>

            <button
              onClick={() => addToWishList(product._id)}
              className="w-11 h-11 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-red-200 dark:hover:bg-gray-600 transition"
            >
              <Heart
                size={26}
                className={`transition duration-300 ${
                  isInWishList ? 'fill-red-500 stroke-red-500' : 'stroke-gray-500 hover:stroke-red-500'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
