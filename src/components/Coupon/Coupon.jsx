import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import React, { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';

export default function Coupon() {
    const [isLoader, setIsLoader] = useState(true);
    const [error, setError] = useState(null);

    const headers = {
        Authorization: 'Bearer ' + localStorage.getItem('userToken'),
    };

    async function createCoupon(values) {
        setIsLoader(false);

        try {
            const { data } = await axios.post(`https://project1-kohl-iota.vercel.app/coupon/create`, values, { headers });
            console.log(data);
            setIsLoader(true);
            toast.success('Coupon added successfully');



        } catch (err) {
            console.error(err);
            setIsLoader(true);
            toast.error('failed to add successfully');
            setError('Failed to fetch subcategory data.');
        }
    }
    const formik = useFormik({
        initialValues: {
            code: '',
            amount: '',
            fromDate: '',
            toDate: ''
        },
        validationSchema: Yup.object({
            code: Yup.string().required('Code is required'),
            amount: Yup.string().required('amount is required'),
            fromDate: Yup.string().required('date is required'),
            toDate: Yup.string().required('date is required'),



        }),
        onSubmit: async (values, { resetForm }) => {
            const formData = {code:values.code,amount:parseInt(values.amount),fromDate:values.fromDate,toDate:values.toDate};
            
            console.log({formData,values})
           await createCoupon(formData)
           resetForm()


        }
    })
    return <>
        <div className="max-w-md my-16 mx-auto border-2xl border-purple-600 shadow-lg shadow-purple-500 bg-white dark:bg-gray-900 p-6 rounded-lg">
                    <ToastContainer />

            <h2 className="text-2xl font-semibold text-purple-500 mb-4 text-center">
                Create Coupon
            </h2>
            <form onSubmit={formik.handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="code" className="block mb-1 font-medium text-gray-900 dark:text-gray-200">Code</label>
                    <input
                        id="code"
                        name="code"
                        onChange={formik.handleChange}
                        value={formik.values.code}
                        className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                    />
                    {formik.touched.code && formik.errors.code && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.code}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label htmlFor="amount" className="block mb-1 font-medium text-gray-900 dark:text-gray-200">amount</label>
                    <input
                        id="amount"
                        name="amount"
                        onChange={formik.handleChange}
                        value={formik.values.amount}
                        className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                    />
                    {formik.touched.amount && formik.errors.amount && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.amount}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label htmlFor="fromDate" className="block mb-1 font-medium text-gray-900 dark:text-gray-200">fromDate</label>
                    <input
                        id="fromDate"
                        name="fromDate"
                        onChange={formik.handleChange}
                        value={formik.values.fromDate}
                        className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                    />
                    {formik.touched.fromDate && formik.errors.fromDate && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.fromDate}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label htmlFor="toDate" className="block mb-1 font-medium text-gray-900 dark:text-gray-200">toDate</label>
                    <input
                        id="toDate"
                        name="toDate"
                        onChange={formik.handleChange}
                        value={formik.values.toDate}
                        className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                    />
                    {formik.touched.toDate && formik.errors.toDate && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.toDate}</p>
                    )}
                </div>







                {isLoader ? (
                    <button
                        type="submit"
                        disabled={!(formik.isValid && formik.dirty)}
                        className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 dark:bg-blue-700 dark:hover:bg-blue-600"
                    >
                        Create Coupon
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
    </>
}
