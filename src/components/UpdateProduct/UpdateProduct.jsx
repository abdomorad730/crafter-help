import { useState, useEffect, useCallback, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { TokenContext } from '../../Context/TokenContext';

export default function UpdateProduct() {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
let {headers}=  useContext(TokenContext)

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      stock: '',
      quantity: '',
      category: '',
      price: '',
      discount: '',
      rate: '',
      avgRating: '',
      brand: '',
      subCategory: '',
      imageCover: null,
      images: [],
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      description: Yup.string().required('Required'),
      stock: Yup.number().required('Required'),
      quantity: Yup.number().required('Required'),
      category: Yup.string().required('Required'),
      price: Yup.number().required('Required'),
      discount: Yup.number().required('Required'),
      rate: Yup.number().required('Required'),
      avgRating: Yup.number().required('Required'),
      brand: Yup.string().required('Required'),
      subCategory: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (key === 'images' && Array.isArray(value)) {
            value.forEach((img) => formData.append('images', img));
          } else if (key === 'imageCover' && value) {
            if (value instanceof File) {
              formData.append('imageCover', value);
            } else if (Array.isArray(value) && value.length > 0 && value[0] instanceof File) {
              formData.append('imageCover', value[0]);
            } else if (typeof value === 'string') {
              formData.append('imageCover', value);
            }
          } else {
            formData.append(key, String(value));
          }
        });

        const token = localStorage.getItem('authorization');
        await axios.patch(
          `https://project1-kohl-iota.vercel.app/product/update/${id}`,
          formData,
          {
            headers
          }
        );

        toast.success('Product updated successfully!');
        setTimeout(() => {
          navigate("/Products");
        }, 1500);
      } catch (error) {
        console.error('Error updating product:', error);
        toast.error('Failed to update product. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  async function getCategory() {
    try {
      const { data } = await axios.get(`https://project1-kohl-iota.vercel.app/category`, {
        headers,
      });
      setCategories(data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  async function getBrand() {
    try {
      const { data } = await axios.get(`https://project1-kohl-iota.vercel.app/brand`, {
        headers,
      });
      setBrands(data.brands);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  }

  const fetchSubCategories = async (categoryId) => {
    try {
      if (categoryId) {
        const { data } = await axios.get(`https://project1-kohl-iota.vercel.app/sub-category/${categoryId}`, {
          headers
        });
        setSubCategories(data.subCategories || []);
      } else {
        setSubCategories([]);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubCategories([]);
    }
  };

  const getProductData = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const { data } = await axios.get(`https://project1-kohl-iota.vercel.app/product/${id}`, {
        headers: { Authorization: localStorage.getItem("authorization") },
      });

      if (data.product) {
        const product = data.product;
        formik.setValues({
          name: product.name || '',
          description: product.description || '',
          stock: product.stock?.toString() || '',
          quantity: product.quantity?.toString() || '',
          category: product.category?._id || '',
          price: product.price?.toString() || '',
          discount: product.discount?.toString() || '',
          rate: product.rate?.toString() || '',
          avgRating: product.avgRating?.toString() || '',
          brand: product.brand?.name || '',
          subCategory: product.subCategory?.name || '',
          imageCover: null,
          images: [],
        });

        if (product.category?._id) {
          fetchSubCategories(product.category._id);
        }
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product data");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getCategory();
    getBrand();
    getProductData();
  }, [getProductData]);

  useEffect(() => {
    if (formik.values.category) {
      fetchSubCategories(formik.values.category);
    }
  }, [formik.values.category]);

  return (
    <>
      <ToastContainer />
      <form
        onSubmit={formik.handleSubmit}
        className="max-w-xl mt-32 mx-auto p-6 bg-[#f9f9f6] rounded-2xl shadow-lg space-y-5 border border-gray-300"
      >
        <h2 className="font-bold mb-4 text-center text-[#a9690a]">Update Product</h2>

        {[
          ['name', 'Product Name'],
          ['description', 'Description'],
          ['stock', 'Stock'],
          ['quantity', 'Quantity'],
          ['price', 'Price'],
          ['discount', 'Discount'],
          ['rate', 'Rate'],
          ['avgRating', 'Average Rating'],
        ].map(([key, label]) => (
          <div key={key}>
            <label htmlFor={key} className="block font-medium text-[#6b4f4f] mb-1">
              {label}
            </label>
            <input
              id={key}
              name={key}
              type="text"
              placeholder={label}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-[#f0ece4] text-gray-800"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values[key]}
            />
            {formik.touched[key] && formik.errors[key] && (
              <div className="text-red-500 text-sm">{formik.errors[key]}</div>
            )}
          </div>
        ))}

        {/* Category */}
        <div>
          <label htmlFor="category" className="block font-medium text-[#6b4f4f] mb-1">
            Category
          </label>
          <select
            name="category"
            id="category"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-[#f0ece4] text-gray-800"
            value={formik.values.category}
            onChange={(e) => {
              formik.setFieldValue('category', e.target.value);
              formik.setFieldValue('subCategory', '');
            }}
            onBlur={formik.handleBlur}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {formik.touched.category && formik.errors.category && (
            <div className="text-red-500 text-sm">{formik.errors.category}</div>
          )}
        </div>

        {/* SubCategory */}
        <div>
          <label htmlFor="subCategory" className="block font-medium text-[#6b4f4f] mb-1">
            SubCategory
          </label>
          <select
            name="subCategory"
            id="subCategory"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-[#f0ece4] text-gray-800"
            value={formik.values.subCategory}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={!subCategories.length}
          >
            <option value="">Select Subcategory</option>
            {subCategories.map((sub) => (
              <option key={sub._id} value={sub.name}>
                {sub.name}
              </option>
            ))}
          </select>
          {formik.touched.subCategory && formik.errors.subCategory && (
            <div className="text-red-500 text-sm">{formik.errors.subCategory}</div>
          )}
        </div>

        {/* Brand */}
        <div>
          <label htmlFor="brand" className="block font-medium text-[#6b4f4f] mb-1">
            Brand
          </label>
          <select
            name="brand"
            id="brand"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-[#f0ece4] text-gray-800"
            value={formik.values.brand}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">Select Brand</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand.name}>
                {brand.name}
              </option>
            ))}
          </select>
          {formik.touched.brand && formik.errors.brand && (
            <div className="text-red-500 text-sm">{formik.errors.brand}</div>
          )}
        </div>

        {/* Image Cover */}
        <div>
          <label className="block font-medium text-[#6b4f4f] mb-1">Image Cover</label>
          <input
            type="file"
            name="imageCover"
            accept="image/*"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-[#f0ece4] text-gray-800"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0] || null;
              formik.setFieldValue('imageCover', file);
            }}
          />
        </div>

        {/* Images */}
        <div>
          <label className="block font-medium text-[#6b4f4f] mb-1">Images (Multiple)</label>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-[#f0ece4] text-gray-800"
            onChange={(event) => {
              const files = event.currentTarget.files;
              formik.setFieldValue('images', files ? Array.from(files) : []);
            }}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-yellow-500 hover:text-black transition"
        >
          {isLoading ? (
            <FaSpinner className="animate-spin text-2xl text-center mx-auto" />
          ) : (
            "Update"
          )}
        </button>
      </form>
    </>
  );
}
