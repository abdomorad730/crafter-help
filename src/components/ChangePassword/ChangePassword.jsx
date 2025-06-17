import React, { useContext } from 'react';
import { TokenContext } from '../../Context/TokenContext';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from "react-icons/fa";
export default function ChangePassword() {
  const { headers } = useContext(TokenContext);
let navigate = useNavigate()
  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      password: "",
      cPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required("Old password is required"),
      password: Yup.string()
        .min(9, "Password must be at least 9 characters")
        .required("New password is required"),
      cPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
    }),
  onSubmit: async (values, { setSubmitting, setStatus }) => {
  try {
    await axios.patch(
      "https://project1-kohl-iota.vercel.app/users/updatePassword",
      {
        oldPassword: values.oldPassword,
        password: values.password,
        cPassword: values.cPassword,
      },
      { headers }
    );

    setStatus({ success: "✅ Password updated successfully!" });

    setTimeout(() => {
      navigate("/login");
    }, 500);

  } catch (error) {
    setStatus({
      error: error.response?.data?.message || "❌ Failed to update password",
    });
  } finally {
    setSubmitting(false);
  }
}

  });

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-purple-700">Change Password</h2>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Old Password
          </label>
          <input
            type="password"
            name="oldPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.oldPassword}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          {formik.touched.oldPassword && formik.errors.oldPassword && (
            <div className="text-red-500 text-sm">{formik.errors.oldPassword}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            New Password
          </label>
          <input
            type="password"
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-sm">{formik.errors.password}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Confirm New Password
          </label>
          <input
            type="password"
            name="cPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.cPassword}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          {formik.touched.cPassword && formik.errors.cPassword && (
            <div className="text-red-500 text-sm">{formik.errors.cPassword}</div>
          )}
        </div>

        {formik.status?.error && (
          <div className="text-red-500 text-sm text-center">{formik.status.error}</div>
        )}
        {formik.status?.success && (
          <div className="text-green-500 text-sm text-center">{formik.status.success}</div>
        )}

    <button
  type="submit"
  disabled={formik.isSubmitting}
  className="w-full flex justify-center items-center gap-2 bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
>
  {formik.isSubmitting ? (
    <>
      <FaSpinner className="animate-spin" />
      Updating...
    </>
  ) : (
    "Update Password"
  )}
</button>

      </form>
    </div>
  );
}
