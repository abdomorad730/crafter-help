import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GrUserAdmin } from "react-icons/gr";
import { MdOutlineCreateNewFolder ,MdDelete } from "react-icons/md";




export default function SidBar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* زر السهم لفتح/غلق السايد بار */}
      <button
        className="fixed top-1/2 left-4 z-50 bg-gray-700 text-white p-2 rounded-full shadow-md transform -translate-y-1/2"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-[85px] z-40 h-screen transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } w-64 bg-white/30 dark:bg-gray-800/30 backdrop-blur-md shadow-lg`}
        aria-label="Sidebar"
      >
        <div className="h-full px-4 py-6 overflow-y-auto">
          <ul className="space-y-3 font-semibold text-sm tracking-wide">
            <li>
              <Link
                to="/LayoutAdmin"
                className="flex items-center p-2 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-700 transition-colors"
              >
                <GrUserAdmin className="text-black text-xl dark:text-white" />
                <span className="ml-3 text-black dark:text-white">Admin</span>
              </Link>

            </li>

            <li>
              <Link
                to="/LayoutAdmin/CreateBrand"
                className="flex items-center p-2 text-black dark:text-gray-100 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-700 transition-colors"
              >
                <MdOutlineCreateNewFolder className="text-black text-xl dark:text-white" />

                <span className="ml-3">Add Brand</span>
              </Link>
            </li>
            <li>
              <Link
                to="/LayoutAdmin/CreateCoupon"
                className="flex items-center p-2 text-black dark:text-gray-100 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-700 transition-colors"
              >
                <MdOutlineCreateNewFolder className="text-black text-xl dark:text-white" />

                <span className="ml-3">Create Coupon</span>
              </Link>
            </li>

            <li>
              <Link
                to="/LayoutAdmin/CreateCategory"
                className="flex items-center p-2 text-black dark:text-gray-100 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-700 transition-colors"
              >
                <MdOutlineCreateNewFolder className="text-black text-xl dark:text-white" />

                <span className="ml-3">Add Category</span>
              </Link>
            </li>

            <li>
              <Link
                to="/LayoutAdmin/CreateSubCategory"
                className="flex items-center p-2 text-black dark:text-gray-100 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-700 transition-colors"
              >
                <MdOutlineCreateNewFolder className="text-black text-xl dark:text-white" />

                <span className="ml-3">Add Sub Category</span>
              </Link>
            </li>
              <li className=''>
              <Link
                to="/LayoutAdmin/productadmain"
                className="flex items-center  pl-2 pt-3 text-black dark:text-gray-100 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-700 transition-colors"
              >
                <MdDelete className="text-black text-xl dark:text-white" />

                <span className="ml-3">Products</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
