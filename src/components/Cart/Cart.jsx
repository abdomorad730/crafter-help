import React, { useContext, useEffect, useState } from 'react'
import { CartContext } from '../../Context/CartContext'
import Loader from '../Loder/Loder'
import { Link, useNavigate } from 'react-router-dom'
import { TokenContext } from '../../Context/TokenContext'
import axios from 'axios'


export default function Cart() {
  const [loder, setLoder] = useState(true)
  const [cart, setCart] = useState([])
  const [idOrder, setidOrder] = useState(null)
  let navigate = useNavigate()

  const { getProductToCart, clearCart, deleteProduct, updateCart, totalPrice } = useContext(CartContext)
  let { headers } = useContext(TokenContext)

  async function CreateOrder(paymentMethod) {
    try {
      const response = await axios.post(
        "https://project1-kohl-iota.vercel.app/order/create",
        { paymentMethod },
        { headers }
      );
      console.log("Order Created:", response.data);
      setidOrder(response.data)
    } catch (error) {
      console.error("Error creating order:", error.response?.data || error);
    }
  }

  async function getCart() {
    try {
      const response = await getProductToCart();
      setCart(response?.data?.cart || []);
      setLoder(false);
    } catch (error) {
      console.error('Error fetching cart data:', error);
      setLoder(false);
    }
  }

  async function updateitem(id, count) {
    try {
      const response = await updateCart(id, count);
      console.log(response);
      await getCart();
    } catch (error) {
      console.error('Failed to update item', error);
    }
  }

  async function deleteItem(id) {
    try {
      const response = await deleteProduct(id);
      console.log(response);
      await getCart();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }

  async function clearToCart() {
    try {
      await clearCart();
      setCart([]);
    } catch (error) {
      console.error('Error clearing the cart:', error);
    }
  }

  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    getCart();
  }, []);

  return (
    <>
      {loder ? <Loader /> :
       <div
         
       className="relative container mx-auto my-6 overflow-x-auto rounded-2xl shadow-lg backdrop-blur-lg   p-4">
  {cart.length === 0 ? (
    <p className="text-center my-12 text-3xl font-bold  text-white">🛒 Your cart is empty</p>
  ) : (
    <table className="w-full text-sm  text-gray-700 dark:text-gray-300">
      <thead className="text-sm   uppercase bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
        <tr>
          <th className="px-6 py-4 text-center font-bold">Image</th>
          <th className="px-6 py-4 text-center font-bold">Product</th>
          <th className="px-6 py-4 text-center font-bold">Qty</th>
          <th className="px-6 py-4 text-center font-bold">Unit Price</th>
          <th className="px-6 py-4 text-center font-bold">Total</th>
          <th className="px-6 py-4 text-center font-bold">Action</th>
        </tr>
      </thead>
      <tbody>
        {cart[0]?.products?.map((item) => (
          <tr key={item.productId?.id} className=" border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 text-center">
            <td className="p-4">
              <img src={item.productId?.imageCover?.secure_url} alt={item.productId?.name} className="w-16 md:w-24 rounded-lg shadow" />
            </td>
            <td className="px-6 py-4 font-semibold text-xl text-purple-600 dark:text-white">{item.productId?.name}</td>
            <td className="px-6 py-4">
              <div className="flex justify-center items-center space-x-2">
                <button onClick={() => updateitem(item.productId.id, item.quantity - 1)} className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-700 text-purple-800 dark:text-white hover:bg-purple-200 dark:hover:bg-purple-600 transition">
                  −
                </button>
                <span className="min-w-[40px] bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-1 rounded-md">{item.quantity}</span>
                <button onClick={() => updateitem(item.productId.id, item.quantity + 1)} className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-700 text-purple-800 dark:text-white hover:bg-purple-200 dark:hover:bg-purple-600 transition">
                  +
                </button>
              </div>
            </td>
            <td className="px-6 py-4 font-bold text-green-600">${item.finalPrice}</td>
            <td className="px-6 py-4 font-bold text-green-600">${item.finalPrice * item.quantity}</td>
            <td className="px-6 py-4">
              <button onClick={() => deleteItem(item.productId.id)} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow transition">🗑️</button>
            </td>
          </tr>
        ))}
        <tr>
          {/* <td colSpan="2" className="text-left  mb-16 px-6 py-4 font-bold text-xl text-main">Total: ${totalPrice}</td> */}
          <td colSpan="2" className="text-center  mb-16 px-6 py-4">
            <button onClick={clearToCart} className="bg-red-600 text-lg  mb-16 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition">🧹 Clear Cart</button>
          </td>
          <td colSpan="2" className="px-6 py-4 text-right">
            <div className="relative inline-block mb-16 text-left">
              <button onClick={toggleDropdown} className="bg-purple-600  hover:bg-purple-700 text-white py-2 px-6 rounded-lg text-lg shadow-md flex items-center gap-2 transition">
                🛒 Checkout
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isOpen && (
                <div className="absolute  right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-10 overflow-hidden">
                  <button
                    onClick={async () => {
                      await CreateOrder("card");
                      navigate(`/checkout/${idOrder.order._id}`);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-purple-300 dark:hover:bg-purple-700 transition"
                  >
                    💳 Online Payment
                  </button>
                  <button

                    onClick={async () => {
                      
                      await CreateOrder("cash");
                      navigate(`/allorders`);
                      await  clearCart()
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-purple-300 dark:hover:bg-purple-700 transition"
                  >
                    💵 Cash Payment
                  </button>
                </div>
              )}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  )}
</div>

      }
    </>
  )
}
