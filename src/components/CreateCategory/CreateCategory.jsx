import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../Loder/Loder';
import bg from '../../assets/images/hero1.jpg';

const CreateCategory = () => {
  const [isLoder, setIsLoder] = useState(true);
  const [Categorie, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [existingImage, setExistingImage] = useState(null); // ⬅️ New state for existing image
  const [userId, setUserId] = useState(() => localStorage.getItem("userid"));

  let navigate = useNavigate();
  const headers = {
    Authorization: 'Bearer ' + localStorage.getItem('userToken'),
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      file: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Category name is required'),
      file: Yup.mixed().nullable().when('$isEditing', {
        is: false,
        then: Yup.mixed().required('A file is required'),
      }),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    enableReinitialize: true,
    context: { isEditing: !!editCategoryId },

    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append('name', values.name);
      if (values.file) {
        formData.append('file', values.file);
      }

      try {
        setIsSubmitting(true);

        if (editCategoryId) {
          await axios.patch(
            `https://project1-kohl-iota.vercel.app/category/update/${editCategoryId}`,
            formData,
            { headers }
          );
          toast.success('Category updated successfully!');
        } else {
          await axios.post(
            'https://project1-kohl-iota.vercel.app/category/create',
            formData,
            { headers }
          );
          toast.success('Category created successfully!');
        }

        setEditCategoryId(null);
        setExistingImage(null); // ⬅️ Reset image on submit
        resetForm();
        getCat();
        // navigate("/Categories");

      } catch (error) {
        toast.error(editCategoryId ? 'Failed to update category.' : 'Failed to create category.');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  async function getCat() {
    try {
      const response = await axios.get("https://project1-kohl-iota.vercel.app/category", { headers });
      setCategories(response.data.categories);
      setIsLoder(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setIsLoder(false);
    }
  }

  async function deleteCategory(id) {
    try {
      await axios.delete(`https://project1-kohl-iota.vercel.app/category/delete/${id}`, { headers });
      setCategories(prev => prev.filter(item => item._id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  }

  useEffect(() => {
    getCat();
  }, []);

  return (
    <>
      <div className="max-w-md mx-auto border border-purple-400 shadow-lg shadow-purple-500 transition-colors duration-500 bg-white my-20 p-6 rounded-lg dark:bg-gray-900 dark:text-white">
        <ToastContainer />
        <h2 className="text-2xl font-semibold text-center mb-4">
          {editCategoryId ? "Update Category" : "Create Category"}
        </h2>

        <form onSubmit={formik.handleSubmit}>
          {/* Category Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.name}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter category name"
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
            )}
          </div>

          {/* Current Image Preview */}
          {editCategoryId && existingImage && !formik.values.file && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Image
              </label>
              <img
                src={existingImage}
                alt="Current"
                className="mt-1 w-full h-40 object-cover rounded-md border"
              />
            </div>
          )}

          {/* Upload File */}
          <div className="mb-4">
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Upload File
            </label>
            <input
              id="file"
              name="file"
              type="file"
              onChange={(event) => {
                formik.setFieldValue('file', event.currentTarget.files[0]);
                setExistingImage(null); // hide old image when new one selected
              }}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {formik.touched.file && formik.errors.file && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.file}</div>
            )}
          </div>

          {/* Submit Button */}
          <div className="mb-4">
            <button
              type="submit"
              disabled={!(formik.isValid && formik.dirty) || isSubmitting}
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              {isSubmitting ? (
                <i className="fa fa-spinner fa-spin"></i>
              ) : (
                editCategoryId ? 'Update Category' : 'Create Category'
              )}
            </button>
          </div>
        </form>
      </div>

      <div className='border-t'>
        {isLoder ? (
          <Loader />
        ) : (
          <div
            className="min-h-screen transition-colors duration-500 py-10 px-4"
            style={{
              backgroundImage: `url(${bg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className="grid grid-cols-1 pt-7 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
              {Categorie.map((category, id) => (

                <div
                  key={id}
                  className="w-64 bg-white shadow-xl shadow-purple-500 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-4 flex flex-col items-center transition-all duration-300 hover:shadow hover:border-purple-500 dark:hover:border-purple-400 hover:-translate-y-3 transform"
                >
                  <div className="w-[210px] h-[200px] border shadow shadow-purple-300 mb-4 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center overflow-hidden">
                    <img
                      src={category.image.secure_url}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-xl uppercase font-extrabold text-orange-800 dark:text-blue-400 text-center mb-4">
                    {category.name}
                  </h2>
                  {/* <Link
                    to={`/subCategory/${category._id}`}
                    className="bg-blue-500 btn hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg shadow-md"
                  >
                    View Category Details
                  </Link> */}
                 

                 {userId == category.userId ?
                  <div className="pt-4 flex justify-between gap-3">
                    <button
                      onClick={() => deleteCategory(category._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-5 rounded-xl shadow-md transition duration-300 ease-in-out dark:bg-red-500 dark:hover:bg-red-600"
                    >
                      <i className="fa-solid fa-trash mr-2"></i>
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        formik.setFieldValue('name', category.name);
                        formik.setFieldValue('file', null); // reset file input
                        setEditCategoryId(category._id);
                         window.scrollTo({ top: 0, behavior: 'smooth' });
                        setExistingImage(category.image.secure_url); // ⬅️ Set image when editing
                      }}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-5 rounded-xl shadow-md transition duration-300 ease-in-out dark:bg-yellow-400 dark:hover:bg-yellow-500"
                    >
                      <i className="fa-solid fa-pen-to-square mr-2"></i>
                      Update
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
};

export default CreateCategory;
