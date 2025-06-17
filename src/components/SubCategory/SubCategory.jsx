import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import Loader from '../Loder/Loder';
import { TokenContext } from '../../Context/TokenContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SubCategory() {
  let { role } = useContext(TokenContext);
  const { id } = useParams();
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  let headers = {
    Authorization: "Bearer " + localStorage.getItem("userToken")
  };

  // دالة لجلب بيانات الفئات الفرعية
  async function getSubCat() {
    try {
      const { data } = await axios.get(`https://project1-kohl-iota.vercel.app/sub-category/${id}`, { headers });
      setLoading(false);
      setSubCategoryData(data.subCategories);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Failed to fetch subcategory data.");
      toast.error("Failed to fetch subcategory data.");
    }
  }

  // دالة لحذف الفئة الفرعية
  function deleteSubCat(deletedId) {
    axios
      .delete(`https://project1-kohl-iota.vercel.app/sub-category/delete/${deletedId}`, { headers })
      .then((res) => {
        setSubCategoryData(prevData => prevData.filter(item => item._id !== deletedId));
        toast.success("Subcategory deleted successfully!");
      })
      .catch((error) => {
        console.log("Error deleting subcategory:", error);
        setError("Failed to delete subcategory.");
        toast.error("Failed to delete subcategory.");
      });
  }

  // استخدام useEffect لجلب البيانات عند تحميل الصفحة
  useEffect(() => {
    getSubCat();
  }, [id]);

  return (
    <>
      <ToastContainer />
      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen py-10 px-4 transition-colors duration-500">
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div className="grid grid-cols-1 pt-7 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
            {subCategoryData.length === 0 ? (
              <p className="text-center text-gray-600 dark:text-gray-300">No subcategories found</p>
            ) : (
              subCategoryData.map((category) => (
                <div
                  key={category._id} // استخدم _id كمفتاح
                  className="w-64 bg-white shadow-xl shadow-purple-400 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col items-center transition-all duration-300 hover:shadow-xl hover:border-purple-500 dark:hover:border-purple-400 hover:-translate-y-3 transform"
                >
                  <div className="w-[210px] h-[200px] border shadow shadow-purple-300 mb-4 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center overflow-hidden">
                    <img
                      src={category.image?.secure_url || 'fallback-image-url.jpg'} // إضافة صورة بديلة
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-xl uppercase font-extrabold text-orange-800 dark:text-blue-400 text-center mb-4">
                    {category.name}
                  </h2>
                 <Link
                   to={`/subCategory/SpecificSubCategory/${category._id}`}
                   className="mt-auto bg-blue-500 btn hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg shadow-md"
                 >
                    SubCategory Details
                 </Link>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
