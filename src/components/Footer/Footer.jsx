import React from 'react';
import payment from '../../Assets/images/pay.png';
import google from '../../Assets/images/play.jpg';
import app from '../../Assets/images/app.jpg';

export default function Footer() {
  return (
    <footer className="bg-black  dark:bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="font-extrabold text-2xl text-purple-600 dark:text-white mb-2">
            Get the FreshCart App
          </h2>
          <p className="font-semibold text-lg text-gray-300 mb-4">
            We will send you a link, open it in your phone to download the app.
          </p>
          <div className="flex justify-center space-x-4 mb-6">
            <input
              type="text"
              className="w-3/4 p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Email..."
            />
            <button className="py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              Share App Link
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="md:w-1/2 p-4">
            <h5 className="font-bold text-lg text-purple-600 dark:text-white mb-2">
              Payment Methods
            </h5>
            <img className="rounded-lg max-w-full" src={payment} alt="Payment Methods" />
          </div>

          <div className="md:w-1/2 p-4">
            <h5 className="font-bold text-lg text-purple-600 dark:text-white mb-2">
              Get Deliveries with FreshCart
            </h5>
            <div className="flex justify-start space-x-4">
              <img className="rounded-lg mx-2 max-w-full w-24" src={google} alt="Google Play" />
              <img className="rounded-lg max-w-full w-24" src={app} alt="App Store" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
