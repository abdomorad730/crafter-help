import React, { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";

export default function ForgetPassword() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: async (values) => {
      setError("");

      try {
        const { data } = await axios.post(
          "https://project1-kohl-iota.vercel.app/users/forgetPassword",
          { email: values.email }
        );
        console.log("✅ Response:", data);

        // Navigate to reset password page
        navigate("/resetPassword");
      } catch (err) {
        console.error("❌ Error:", err.response?.data || err.message);
        setError("❌ Failed to send reset email");
      }
    },
  });

  return (
    <div className="max-w-md mx-auto my-20 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">
        Forgot Password
      </h2>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
          )}

        </div>
          <div className="text-left mt-2">
                  <Link
                    to="/resetPassword"
                    className="text-sm font-extrabold text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Back to Reset Password ?
                  </Link>
              
        
                </div>

        {error && <div className="text-red-500 text-sm text-center">{error}</div>}

       <button
  type="submit"
  disabled={formik.isSubmitting}
  className="w-full py-2 flex justify-center items-center gap-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition disabled:opacity-50"
>
  {formik.isSubmitting ? (
    <>
      <svg
        className="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
        ></path>
      </svg>
      Sending...
    </>
  ) : (
    "Send Reset Link"
  )}
</button>

      </form>
    </div>
  );
}
