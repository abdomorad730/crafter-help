import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterForm() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [usermessage, setUserMessage] = useState(null);
  const [messageError, setMessageError] = useState(null);
  const [isLoder, setIsLoder] = useState(false);
  const [role, setRole] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [image, setImage] = useState(null); // صورة المستخدم

  const navigate = useNavigate();

  const validate = values => {
    const errors = {};
    if (!values.firstName) errors.firstName = 'First Name is required';
    if (!values.lastName) errors.lastName = 'Last Name is required';
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    if (!values.cPassword) {
      errors.cPassword = 'Confirm Password is required';
    } else if (values.cPassword !== values.password) {
      errors.cPassword = 'Passwords must match';
    }
    if (!values.phone) {
      errors.phone = 'Phone number is required';
    } else if (!/^(002)?01[0-2,5]{1}[0-9]{8}$/.test(values.phone)) {
      errors.phone = 'Invalid Egyptian phone number';
    }
    if (!values.gender) errors.gender = 'Gender is required';
    if (!values.address) errors.address = 'Address is required';
    if (!values.day || !values.month || !values.year) {
      errors.birthdate = 'Complete birthdate is required';
    }
    return errors;
  };

  const months = {
    January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
    July: 7, August: 8, September: 9, October: 10, November: 11, December: 12,
  };

  const formik = useFormik({
    initialValues: {
      firstName: "", lastName: "", email: "",
      password: "", cPassword: "", phone: "",
      gender: "", address: "", day: "", month: "", year: "",
    },
    validate,
    onSubmit: async (values) => {
      if (!role) {
        setMessageError("Please select a role first.");
        return;
      }
      setIsLoder(true);

      const birthDate = `${values.year}-${months[values.month]}-${parseInt(values.day)}`;
     const formData = new FormData();
formData.append("firstName", values.firstName);
formData.append("lastName", values.lastName);
formData.append("email", values.email);
formData.append("password", values.password);
formData.append("cPassword", values.cPassword);
formData.append("gender", values.gender);
formData.append("address", values.address);
formData.append("phone", values.phone);
formData.append("DOB", birthDate);
formData.append("file", image); 


      const endpoint = role === "user"
        ? "https://project1-kohl-iota.vercel.app/users/signup/user"
        : "https://project1-kohl-iota.vercel.app/users/signup/crafter";

      try {
        const { data } = await axios.post(endpoint, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setUserMessage(data.message);
        setIsLoder(false);
        navigate("/confirmemail");
      } catch (err) {
        setMessageError(err.response?.data?.message || "Registration failed.");
        setIsLoder(false);
      }
    },
  });

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}   py-10 flex justify-center items-center`}>
      <div className="bg-white border border-purple-400 shadow-lg shadow-purple-500 dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full sm:w-96">
        <h2 className="text-3xl font-bold text-center text-purple-600 dark:text-purple-400 mb-6">Register</h2>

        {usermessage && (
          <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400">
            <p className='text-center font-bold text-2xl'>{usermessage}</p>
          </div>
        )}
        {messageError && (
          <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">
            <p className='text-center font-bold text-2xl'>{messageError}</p>
          </div>
        )}

        <form onSubmit={formik.handleSubmit}>
          <ul className="space-y-4">
            <li>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">First Name:</label>
              <input name="firstName" onChange={formik.handleChange} value={formik.values.firstName} onBlur={formik.handleBlur} className="mt-1 p-3 w-full border rounded-lg dark:bg-gray-700 dark:text-white" />
            </li>
            <li>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">Last Name:</label>
              <input name="lastName" onChange={formik.handleChange} value={formik.values.lastName} onBlur={formik.handleBlur} className="mt-1 p-3 w-full border rounded-lg dark:bg-gray-700 dark:text-white" />
            </li>
            <li>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">Email:</label>
              <input name="email" type="email" onChange={formik.handleChange} value={formik.values.email} onBlur={formik.handleBlur} className="mt-1 p-3 w-full border rounded-lg dark:bg-gray-700 dark:text-white" />
            </li>
            <li>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">Password:</label>
              <input name="password" type="password" onChange={formik.handleChange} value={formik.values.password} onBlur={formik.handleBlur} className="mt-1 p-3 w-full border rounded-lg dark:bg-gray-700 dark:text-white" />
            </li>
            <li>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">Confirm Password:</label>
              <input name="cPassword" type="password" onChange={formik.handleChange} value={formik.values.cPassword} onBlur={formik.handleBlur} className="mt-1 p-3 w-full border rounded-lg dark:bg-gray-700 dark:text-white" />
            </li>
            <li>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">Phone:</label>
              <input name="phone" onChange={formik.handleChange} value={formik.values.phone} onBlur={formik.handleBlur} className="mt-1 p-3 w-full border rounded-lg dark:bg-gray-700 dark:text-white" />
            </li>
            <li>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">Gender:</label>
              <select name="gender" onChange={formik.handleChange} value={formik.values.gender} className="mt-1 p-3 w-full border rounded-lg dark:bg-gray-700 dark:text-white">
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </li>
            <li>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">Address:</label>
              <input name="address" onChange={formik.handleChange} value={formik.values.address} className="mt-1 p-3 w-full border rounded-lg dark:bg-gray-700 dark:text-white" />
            </li>
            <li className="flex gap-2">
              <select name="day" onChange={formik.handleChange} value={formik.values.day} className="p-2 border rounded-lg dark:bg-gray-700 dark:text-white">
                <option value="">Day</option>
                {[...Array(31).keys()].map(i => <option key={i + 1}>{i + 1}</option>)}
              </select>
              <select name="month" onChange={formik.handleChange} value={formik.values.month} className="p-2 border rounded-lg dark:bg-gray-700 dark:text-white">
                <option value="">Month</option>
                {Object.keys(months).map(m => <option key={m}>{m}</option>)}
              </select>
              <select name="year" onChange={formik.handleChange} value={formik.values.year} className="p-2 border rounded-lg dark:bg-gray-700 dark:text-white">
                <option value="">Year</option>
                {[...Array(100).keys()].map(i => <option key={i}>{2025 - i}</option>)}
              </select>
            </li>

            {/* صورة المستخدم */}
            <li>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">Profile Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="mt-1 p-3 w-full border rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </li>

            {/* اختيار الدور */}
            <li className="relative">
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full bg-purple-600 from-purple-600 to-purple-500 text-white py-3 px-4 rounded-xl font-semibold text-lg shadow-md hover:from-purple-700 hover:to-purple-600 transition-all"
              >
                {role ? `Selected: ${role === "user" ? "User" : "Crafter"}` : "Register As"}
              </button>

              {showDropdown && (
                <div className="absolute mt-2 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg z-20 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => { setRole("user"); setShowDropdown(false); }}
                    className="block w-full font-extrabold text-left px-5 py-3 text-purple-700 dark:text-purple-600 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all text-md"
                  >
                    👤 Register as User
                  </button>
                  <button
                    type="button"
                    onClick={() => { setRole("crafter"); setShowDropdown(false); }}
                    className="block w-full font-extrabold text-left px-5 py-3 text-purple-700 dark:text-purple-600 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all text-md"
                  >
                    🛠️ Register as Crafter
                  </button>
                </div>
              )}
            </li>

            {/* إرسال */}
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
      Register
    </button>
  )}
</li>
          </ul>
        </form>
      </div>
    </div>
  );
}
