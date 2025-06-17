import { useFormik } from 'formik';
import React, { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { TokenContext } from '../../Context/TokenContext';
import { CartContext } from '../../Context/CartContext';

export default function CheckOut() {
  const [loading, setLoading] = useState(false);
let Navigate = useNavigate()
  let { headers } = useContext(TokenContext);
 let {clearCart} = useContext(CartContext)
  let { id } = useParams(); // orderId from URL

  const formik = useFormik({
    initialValues: {
      code: ''
    },
  onSubmit: async (values) => {
  setLoading(true);
  try {
    const response = await axios.post(
      'https://project1-kohl-iota.vercel.app/order/create-payment',
      {
        orderId: id,
        ...(values.code && { code: values.code })
      },
      { headers }
    );
    console.log('Payment created:', response.data.data);
    // alert("Payment Created Successfully ✅");
  //  Navigate("/allorders")
  window.location.href = response.data.data.url
  // Navigate("/allorders")
    // clearCart();
  } catch (error) {
    console.log('Payment failed:', error.response?.data || error);
    alert("Payment Failed ❌");
  } finally {
    setLoading(false);
  }
}

  });

  return (
    <div className="max-w-md mx-auto mt-10 my-20 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl my-12 font-bold mb-4">Complete Your Payment</h2>
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="code" className="block text-sm font-medium text-gray-700">
          Discount Code (Optional)
        </label>
        <input
          type="text"
          id="code"
          name="code"
          value={formik.values.code}
          onChange={formik.handleChange}
          className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-indigo-300"
        />
       <button
       
  type="submit"
  className={`mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
  disabled={loading}
>
  {loading ? 'Processing...' : 'Pay Now'}
</button>

      </form>
    </div>
  );
}
