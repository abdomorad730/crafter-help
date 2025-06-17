import React, { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      code: "",
      password: "",
      cPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      code: Yup.string().required("Code is required"),
      password: Yup.string()
        .matches(/^\d{9,}$/, "Password must be at least 9 digits")
        .required("Password is required"),

      cPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values) => {
      setError("");
      setSuccess("");

      try {
        const { data } = await axios.patch(
          "https://project1-kohl-iota.vercel.app/users/resetPassword",
          values
        );
        console.log("✅ Success:", data);
        setSuccess("✅ Password updated successfully");

        // Navigate to login after few seconds
        setTimeout(() => {
          navigate("/login");
        }, 500);
      } catch (err) {
        console.error("❌ Error:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to reset password");
      }
    },
  });

  return (
    <div className="max-w-md mx-auto my-20 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">
        Reset Password
      </h2>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {["email", "code", "password", "cPassword"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
              {field === "cPassword" ? "Confirm Password" : field}
            </label>
            <input
              type={field.includes("password") ? "password" : "text"}
              name={field}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values[field]}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            {formik.touched[field] && formik.errors[field] && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors[field]}
              </div>
            )}
          </div>

        ))}
        <div className="text-left mt-2">
          <Link
            to="/login"
            className="text-sm font-extrabold text-blue-600 hover:underline dark:text-blue-400"
          >
            Back to login ?
          </Link>
      

        </div>
        {error && <div className="text-red-500 text-center text-sm">{error}</div>}
        {success && <div className="text-green-500 text-center text-sm">{success}</div>}

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
              Submitting...
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </div>
  );
}
