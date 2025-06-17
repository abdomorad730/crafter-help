import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProductAdmain() {
  let headers = {
        Authorization: "Bearer " + localStorage.getItem("userToken")
    };
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["allProducts"],
    queryFn: async () => {
      const res = await axios.get("https://project1-kohl-iota.vercel.app/product");
      return res.data;
    },
  });

  async function deleatProduct(id) {
    try {
      await axios.delete(`https://project1-kohl-iota.vercel.app/product/delete/${id}`,{headers});
      toast.success("Product deleted successfully");
      // إعادة جلب المنتجات من جديد تلقائيًا
      queryClient.invalidateQueries(["allProducts"]);
    } catch (error) {
      toast.error("Failed to delete product");
      console.log(error);
    }
  }

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (isError) return <p className="text-center mt-10 text-red-500">Error loading products.</p>;

  return (
    <div className="grid grid-cols-1 my-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pt-6">
      {data?.products?.map((item) => (
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

      <div className="mt-auto p-3 flex justify-between gap-3">
  <button
    onClick={() => deleatProduct(item._id)}
    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-4 rounded-xl shadow-md transition duration-300 dark:bg-red-500 dark:hover:bg-red-600"
  >
    <i className="fa-solid fa-trash mr-2"></i>Delete
  </button>
</div>

        </div>
      ))}
    </div>
  );
}
