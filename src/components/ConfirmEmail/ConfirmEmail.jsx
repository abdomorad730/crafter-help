import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { TokenContext } from '../../Context/TokenContext';

export default function ConfirmEmailForm() {

  // let { token, setToken } = useContext(TokenContext);
  const [usermessage, setUserMessage] = useState(null);
  const [messageError, setMessageError] = useState(null);
  const [isLoader, setIsLoader] = useState(false);
  let navigate = useNavigate();

  const validate = values => {
    const errors = {};

    if (!values.email) {
      errors.email = 'Email Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      otp: "",
    },
    validate,
    onSubmit: values => {
      handleEmailConfirm(values);
    }
  });

  async function handleEmailConfirm(values) {
    setIsLoader(true);
    try {
      const data = await axios.patch('https://project1-kohl-iota.vercel.app/users/confirmMail', values);
      // localStorage.setItem('userToken', data.data.token);
      // setToken(data.data.token);
      console.log(data);
      
      
      setUserMessage(data.data.message);
      setIsLoader(false);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error(err.response?.data?.message);
      setMessageError(err.response?.data?.message);
      setIsLoader(false);
    }
  }

  return (
    <div className="min-h-screen transition-colors duration-500  py-10 flex justify-center items-center relative">
      <div className="bg-white border border-purple-400 shadow-lg shadow-purple-500 dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full sm:w-96">
        <h2 className="text-3xl font-bold text-center text-purple-600 dark:text-purple-400 mb-6">Confirm Email</h2>
        
        {usermessage && (
          <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
            <p className='text-center font-bold text-2xl'>{usermessage}</p>
          </div>
        )}

        {messageError && (
          <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
            <p className='text-center font-bold text-2xl'>{messageError}</p>
          </div>
        )}

        <form onSubmit={formik.handleSubmit}>
          <ul className="space-y-4 ">
            {/* Email */}
            <li>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-200">Email :</label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="username"
                onChange={formik.handleChange}
                value={formik.values.email}
                onBlur={formik.handleBlur}
                className="mt-1 p-3 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
                placeholder="Enter your email"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
              )}
            </li>

            {/* OTP */}
            <li>
              <label htmlFor="otp" className="block text-sm font-bold text-gray-700 dark:text-gray-200">OTP :</label>
              <input
                type="text"
                id="otp"
                name="otp"
                onChange={formik.handleChange}
                value={formik.values.otp}
                onBlur={formik.handleBlur}
                className="mt-1 p-3 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
                placeholder="Enter the OTP"
              />
              {formik.touched.otp && formik.errors.otp && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.otp}</div>
              )}
            </li>

            {/* Submit Button */}
            <li>
              {isLoader ? (
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white p-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-300 dark:bg-purple-700 dark:hover:bg-purple-600"
                >
                  <i className='fa fa-spinner fa-spin'></i>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!(formik.isValid && formik.dirty)}
                  className="w-full bg-purple-600 text-white p-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-300 dark:bg-purple-700 dark:hover:bg-purple-600 disabled:opacity-50"
                >
                  Confirm Email
                </button>
              )}
            </li>
          </ul>
        </form>
      </div>
    </div>
  );
}
