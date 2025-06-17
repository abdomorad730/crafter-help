import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import bg from '../../assets/images/hero1.jpg';
import Loader from '../Loder/Loder';

export default function CreateBrand() {
  const [isLoder, setIsLoder] = useState(true);
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [userId, setUserId] = useState(() => localStorage.getItem("userid"));

  let navigate = useNavigate();

  const headers = {
    Authorization: 'Bearer ' + localStorage.getItem('userToken'),
  };

  useEffect(() => {
    async function getCategories() {
      try {
        const { data } = await axios.get('https://project1-kohl-iota.vercel.app/category', { headers });
        setCategories(data.categories);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        toast.error('Error loading categories.');
      }
    }
    getCategories();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
      category: '',
      file: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      category: Yup.string().required('Category ID is required'),
      file: Yup.mixed().nullable(),
    }),
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('category', values.category);

      if (values.file) {
        formData.append('file', values.file);
      }

      try {
        setIsSubmitting(true);

        if (selectedBrand) {
          const { data: updatedBrand } = await axios.patch(
            `https://project1-kohl-iota.vercel.app/brand/update/${selectedBrand._id}`,
            formData,
            { headers }
          );
          toast.success('Brand updated successfully!');
          setData((prev) =>
            prev.map((item) =>
              item._id === selectedBrand._id ? { ...item, ...updatedBrand.brand } : item
            )
          );
        } else {
          const { data: newBrand } = await axios.post(
            'https://project1-kohl-iota.vercel.app/brand/create',
            formData,
            { headers }
          );
          // navigate("/Brands")
          toast.success('Brand created successfully!');
          getBrand()
        }

        resetForm();
        setSelectedBrand(null);
        setIsSubmitting(false);
      } catch (error) {
        console.error(error);
        toast.error('Failed to submit brand');
        setIsSubmitting(false);
      }
    },
  });

  async function getBrand() {
    try {
      const response = await axios.get('https://project1-kohl-iota.vercel.app/brand', { headers });
      setData(response.data.brands);
      setIsLoder(false);
    } catch (error) {
      console.error('Error fetching brand:', error);
      setIsLoder(false);
    }
  }

  useEffect(() => {
    getBrand();
  }, []);

  async function deleteBrand(id) {
    try {
      await axios.delete(`https://project1-kohl-iota.vercel.app/brand/delete/${id}`, { headers });
      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Error deleting brand:', error);
    }
  }

  return (
    <>
      <div className="max-w-md my-16 mx-auto border border-purple-400 shadow-lg shadow-purple-500 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md mt-10">
        <ToastContainer />
        <h2 className="text-2xl font-semibold text-purple-500 mb-4 text-center">
          {selectedBrand ? 'Update Brand' : 'Create Brand'}
        </h2>

        {selectedBrand && selectedBrand.image?.secure_url && (
          <div className="mb-4">
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">Current Image:</p>
            <img
              src={selectedBrand.image.secure_url}
              alt="Current brand"
              className="w-full h-48 object-cover rounded-lg border"
            />
          </div>
        )}

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
              Name
            </label>
            <input
              id="name"
              name="name"
              onChange={formik.handleChange}
              value={formik.values.name}
              className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
              Category ID
            </label>
            <select
              id="category"
              name="category"
              onChange={formik.handleChange}
              value={formik.values.category}
              className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            {formik.touched.category && formik.errors.category && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.category}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="file" className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
              Upload Image (Optional when updating)
            </label>
            <input
              id="file"
              name="file"
              type="file"
              onChange={(e) => formik.setFieldValue('file', e.target.files[0])}
              className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            {isSubmitting ? (
              <i className="fa fa-spinner fa-spin"></i>
            ) : (
              selectedBrand ? 'Update Brand' : 'Create Brand'
            )}
          </button>
        </form>
      </div>

      <div className="border-t">
        {isLoder ? (
          <Loader />
        ) : (
          <div
            className="py-12 px-6 transition-colors duration-500"
            style={{
              backgroundImage: `url(${bg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className="grid gap-8 pt-7 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center">
              {data.map((item, id) => (
                <div
                  key={id}
                  className="w-64 bg-white shadow-xl shadow-purple-500 dark:bg-black border-2 border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden transform transition-all duration-700 hover:shadow-2xl hover:-translate-y-3 hover:border-purple-800 dark:hover:border-purple-400"
                >
                  <div className="w-full h-60 overflow-hidden">
                    {item?.image?.secure_url ? (
                      <img
                        src={item?.image?.secure_url}
                        alt={item?.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                        No Image
                      </div>
                    )}

                  </div>
                  <div className="p-4">
                    <h2 className="text-center uppercase text-lg font-semibold text-orange-800 dark:text-blue-400">
                      {item.name}
                    </h2>
                  </div>
                   {userId==item.userId ?
                    <div className="p-4 flex justify-between gap-3">
                    <button
                      onClick={() => deleteBrand(item._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-4 rounded-xl shadow-md transition duration-300 dark:bg-red-500 dark:hover:bg-red-600"
                    >
                      <i className="fa-solid fa-trash mr-2"></i>Delete
                    </button>
                    <button
                      onClick={() => {
                        formik.setValues({
                          name: item.name,
                          category: item.category.name,
                          file: null,
                        });
                        setSelectedBrand(item);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-4 rounded-xl shadow-md transition duration-300 dark:bg-yellow-400 dark:hover:bg-yellow-500"
                    >
                      <i className="fa-solid fa-pen-to-square mr-2"></i>Update
                    </button>
                  </div>:null
                  }
                 
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
