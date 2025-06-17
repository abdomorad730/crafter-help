import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

export default function CreateSubCategory() {
  const [isLoader, setIsLoader] = useState(true);
  const [categories, setCategories] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState(null);
  const [editingSubCat, setEditingSubCat] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
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

  useEffect(() => {
    if (selectedCategory) {
      getSubCat(selectedCategory);
    } else {
      setSubCategoryData([]);
    }
  }, [selectedCategory]);

  async function getSubCat(categoryId) {
    try {
      const { data } = await axios.get(`https://project1-kohl-iota.vercel.app/sub-category/${categoryId}`, { headers });
      setSubCategoryData(data.subCategories);
      setError(null);
      console.log(data.subCategories);
      
    } catch (err) {
      console.error(err);
      setSubCategoryData([]);
      setError('Failed to fetch subcategory data.');
    }
  }

  const formik = useFormik({
    initialValues: {
      name: '',
      category: '',
      file: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      category: Yup.string().required('Category is required'),
      file: Yup.mixed().when([], {
        is: () => !editingSubCat,
        then: (schema) => schema.required('Image is required'),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('category', values.category);
      formData.append('file', values.file);

      try {
        setIsLoader(false);
        if (editingSubCat && editingSubCat?._id) {
          const { data } = await axios.patch(
            `https://project1-kohl-iota.vercel.app/sub-category/update/${editingSubCat?._id}`,
            formData,
            { headers }
          );

          setSubCategoryData(prev =>
            prev.map(item => item?._id === editingSubCat?._id ? data.subCategory : item)
          );

          formik.setFieldValue('name', data.subCategory.name);
          setEditingSubCat(null);
          setImagePreview(null);
          toast.success('Sub Category updated successfully');
        } else {
          const { data } = await axios.post(
            'https://project1-kohl-iota.vercel.app/sub-category/create',
            formData,
            { headers }
          );
          toast.success('Sub Category created successfully!');
          setSelectedCategory(values.category);
        }

        resetForm();
        setImagePreview(null);
        setIsLoader(true);
      } catch (error) {
        setIsLoader(true);
        console.log(error);
        toast.error('Failed to save Sub Category');
      }
    },
  });

  function deleteSubCat(deletedId) {
    axios
      .delete(`https://project1-kohl-iota.vercel.app/sub-category/delete/${deletedId}`, { headers })
      .then((res) => {
        setSubCategoryData(prevData => prevData.filter(item => item._id !== deletedId));
      })
      .catch((error) => {
        console.log('Error deleting subcategory:', error);
        setError('Failed to delete subcategory.');
      });
  }

  return (
    <>
      <div className="max-w-md my-16 mx-auto border-2xl border-purple-600 shadow-lg shadow-purple-500 bg-white dark:bg-gray-900 p-6 rounded-lg">
        <ToastContainer />
        <h2 className="text-2xl font-semibold text-purple-500 mb-4 text-center">
          {editingSubCat ? 'Update Sub Category' : 'Create Sub Category'}
        </h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-1 font-medium text-gray-900 dark:text-gray-200">Name</label>
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
              Select Category
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
                <option key={cat?._id} value={cat?.name}>
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
              Upload Image
            </label>
            <input
              id="file"
              name="file"
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                formik.setFieldValue('file', file);
                if (file) {
                  setImagePreview(URL.createObjectURL(file));
                }
              }}
              className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            />
            {formik.touched.file && formik.errors.file && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.file}</p>
            )}
          </div>

          {imagePreview && (
            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                Preview Image
              </label>
              <img
                src={imagePreview}
                alt="Preview"
                className="w-40 h-40 object-cover rounded-md border dark:border-gray-600"
              />
            </div>
          )}

          {isLoader ? (
            <button
              type="submit"
              disabled={!(formik.isValid && formik.dirty)}
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              {editingSubCat ? 'Update SubCategory' : 'Create SubCategory'}
            </button>
          ) : (
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              <i className="fa fa-spinner fa-spin"></i>
            </button>
          )}
        </form>
      </div>

      <div className="max-w-7xl mx-auto border-t-2 my-4 px-4">
        <div className="mb-6">
          <label className="block text-center pt-6 text-2xl font-semibold mb-2 text-white">
            Show Subcategories for:
          </label>
          <div className="flex justify-center items-center my-6">
            <select
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-1/2 px-4 py-2 border rounded-md text-center dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat?._id} value={cat?._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {subCategoryData.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-300 col-span-full">No subcategories found</p>
          ) : (
            subCategoryData.map((category) => {
              const isOwner = String(userId) === String(category?.userId);
              return (
                <div
                  key={category?._id}
                  className="bg-white shadow-purple-500 dark:bg-gray-900 border dark:border-gray-700 rounded-xl shadow-lg p-4 flex flex-col items-center"
                >
                  <div className="w-[210px] h-[200px] mb-4 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
                    <img
                      src={category?.image?.secure_url || 'fallback-image-url.jpg'}
                      alt={category?.name || 'No name available'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-orange-800 dark:text-blue-400 text-center mb-2">
                    {category?.name || 'No Name Available'}
                  </h2>
                  {isOwner && (
                    <div className=" flex justify-between gap-3">
                      <button
                        onClick={() => deleteSubCat(category?._id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-4 rounded-xl shadow-md transition duration-300 ease-in-out dark:bg-red-500 dark:hover:bg-red-600"
                      >
                        <i className="fa-solid fa-trash mr-2"></i>
                        Delete
                      </button>
                      <button
                        onClick={() => {
                          setEditingSubCat(category);
                          formik.setValues({
                            name: category.name,
                            category: selectedCategory,
                            file: null,
                          });
                          setImagePreview(category.image?.secure_url || '');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-4 rounded-xl shadow-md transition duration-300 ease-in-out dark:bg-yellow-400 dark:hover:bg-yellow-500"
                      >
                        <i className="fa-solid fa-pen-to-square mr-2"></i>
                        Update
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
