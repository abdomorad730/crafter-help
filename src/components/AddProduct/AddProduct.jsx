import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductForm = () => {
  const [brand, setBrand] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const navigate = useNavigate();

  const headers = {
    Authorization: "Bearer " + localStorage.getItem("userToken"),
  };

  async function getBrand() {
    try {
      const response = await axios.get("https://project1-kohl-iota.vercel.app/brand", { headers });
      setBrand(response.data.brands);
    } catch (error) {
      console.error("Error fetching brand:", error);
    }
  }

  async function getCategories() {
    try {
      const { data } = await axios.get("https://project1-kohl-iota.vercel.app/category", { headers });
      setCategories(data.categories);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  }

  async function getSubCat(categoryId) {
    try {
      const { data } = await axios.get(`https://project1-kohl-iota.vercel.app/sub-category/${categoryId}`, { headers });
      setSubCategories(data.subCategories);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getCategories();
    getBrand();
  }, []);

  const [form, setForm] = useState({
    name: "",
    describtion: "", // spelling required by backend
    stock: "",
    quantity: "",
    category: "",
    price: "",
    discount: "",
    rate: "",
    avgRating: "",
    brand: "",
    subCategory: "",
  });

  const [imageCover, setImageCover] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setForm({ ...form, category: selectedCategory });
    if (selectedCategory) {
      getSubCat(selectedCategory);
    } else {
      setSubCategories([]);
    }
  };

  const handleImageCoverChange = (e) => {
    setImageCover(e.target.files[0]);
  };

  const handleImagesChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError(false);

    const formData = new FormData();
    for (let key in form) {
      formData.append(key, form[key]);
    }

    if (imageCover) {
      formData.append("imageCover", imageCover);
    }

    images.forEach((img) => {
      formData.append("images", img);
    });

    try {
      await axios.post(
        "https://project1-kohl-iota.vercel.app/product/create",
        formData,
        { headers }
      );
      navigate("/Products");
      setMessage("✅ Product created successfully.");
    } catch (err) {
      setError(true);
      setMessage("❌ Error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const price = Number(form.price);
  const discount = Number(form.discount);
  const priceAfterDiscount =
    price && discount ? price - (price * discount) / 100 : 0;

  return (
    <div className="max-w-2xl mx-auto my-12 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-purple-600   text-center">
        Add New Product
      </h1>
      <form onSubmit={handleSubmit} className="space-y-5  ">
        {[
          ["name", "Product Name"],
          ["describtion", "Description"], // backend spelling
          ["stock", "Stock"],
          ["quantity", "Quantity"],
          ["price", "Price"],
          ["discount", "Discount (%)"],
          ["rate", "Rating"],
          ["avgRating", "Average Rating"],
        ].map(([key, label]) => (
          <div
           key={key}>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </label>
            <input
              type={["name", "describtion"].includes(key) ? "text" : "number"}
              name={key}
              value={form[key]}
              onChange={handleChange}
              className="w-full px-4 py-2   border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        ))}

        {/* Category Select */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </label>
          <select
            name="category"
            onChange={handleCategoryChange}
            value={form.category}
            className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sub Category Select */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Sub Category
          </label>
          <select
            name="subCategory"
            value={form.subCategory}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">-- Select Sub Category --</option>
            {subCategories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Brand Select */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Brand
          </label>
          <select
            name="brand"
            onChange={handleChange}
            value={form.brand}
            className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="">Select a Brand</option>
            {brand.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Image Cover Upload */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Image Cover
          </label>
          <input
            type="file"
            onChange={handleImageCoverChange}
            className="block w-full text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 cursor-pointer"
            required
          />
          {imageCover && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{imageCover.name}</p>
          )}
        </div>

        {/* Multiple Images Upload */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Extra Images
          </label>
          <input
            type="file"
            multiple
            onChange={handleImagesChange}
            className="block w-full text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 cursor-pointer"
          />
          {images.length > 0 && (
            <ul className="mt-2 text-sm text-gray-600 dark:text-gray-300 list-disc pl-5">
              {images.map((file, i) => (
                <li key={i}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Price After Discount */}
        <div className="text-right text-sm text-gray-700 dark:text-gray-300">
          <strong>Price after discount:</strong> {priceAfterDiscount.toFixed(2)} EGP
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 text-white font-semibold rounded-lg transition bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Product"}
        </button>
      </form>

      {/* Message */}
      {message && (
        <p
          className={`mt-6 text-center text-sm font-medium ${
            error ? "text-red-500" : "text-green-500"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default ProductForm;
