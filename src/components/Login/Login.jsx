import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { TokenContext } from '../../Context/TokenContext';

export default function LoginForm() {

  let { token, setToken, setRole } = useContext(TokenContext)
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [usermessage, setUserMessage] = useState(null)
  const [messageError, setMessageError] = useState(null)
  const [isLoder, setIsLoder] = useState(false)
  let navigate = useNavigate()

  const validate = values => {
    const errors = {};


    if (!values.email) {
      errors.email = 'Email Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }
    if (!values.password) {
      errors.password = 'Password is Required';
    } else if (values.password.length < 9) {
      errors.password = `length must be at least 9`;
    }
    return errors;
  }
  const formik = useFormik({
    initialValues: {

      email: "",
      password: "",



    },
    validate,

    onSubmit: values => {
      handleLogin(values)

    }

  });



  async function handleLogin(values) {
    setIsLoder(true)
    try {
      let data = await axios.post(`https://project1-kohl-iota.vercel.app/users/signin`, values);
      console.log(data.data.user);

      // localStorage.setItem("user" , data.data.user)
      // localStorage.setItem("user", JSON.stringify(data.data.user));

      localStorage.setItem("userToken", data.data.access_token)
      localStorage.setItem("userRole", data.data.user.role)
      localStorage.setItem("userid", data.data.user.id)

      setToken(data.data.access_token);
      setRole(data.data.user.role);


      setUserMessage(data.data.message)
      setIsLoder(false)
      navigate("/home")
    } catch (err) {
      console.error(err.response?.data?.message);
      setMessageError(err.response?.data?.message)
      setIsLoder(false)

    }


  }





  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}   transition-colors duration-500  py-10 flex justify-center items-center`}>
      <div className="bg-white border border-purple-400 shadow-lg shadow-purple-500 dark:bg-gray-900 p-8 rounded-lg shadow-xl w-full sm:w-96">
        <h2 className="text-3xl font-bold text-center text-purple-600 dark:text-purple-400 mb-6">Login</h2>
        {usermessage ? <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
          <p className=' text-center font-bold text-2xl'>{usermessage}</p>
        </div> : null}

        {messageError ? <div className="p-4  mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
          <p className='text-center font-bold text-2xl'>{messageError}</p>
        </div> : null}
        <form onSubmit={formik.handleSubmit}>
          <ul className="space-y-4">
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
            </li>
            {/* Password */}


            <li>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 dark:text-gray-200">Password :</label>
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="new-password"
                onChange={formik.handleChange}
                value={formik.values.password}
                onBlur={formik.handleBlur}
                className="mt-1 p-3 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
                placeholder="Enter your password"
              />
            </li>
            <div className="text-left mt-2">
              <Link
                to="/ForgetPasword"
                className="text-sm font-extrabold text-blue-600 hover:underline dark:text-blue-400"
              >
                Forget Password?
              </Link>
            </div>
            {/* Submit Button */}
            <li>
              {isLoder ? (
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
                  className={`w-full p-3 rounded-lg font-semibold transition duration-300 ${!(formik.isValid && formik.dirty) ? 'bg-purple-300 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600'} text-white`}
                >
                  Login
                </button>
              )}
            </li>

          </ul>
        </form>
      </div>
    </div>
  );
}
