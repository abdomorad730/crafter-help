import { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { TokenContext } from "../../Context/TokenContext";
import logo from "../../assets/images/logo.png";
import axios from "axios";
import { FaCartArrowDown } from "react-icons/fa";
import { AiFillHeart } from "react-icons/ai";

export default function Navbar() {
  const navigate = useNavigate();
  const { token, setToken, role ,headers } = useContext(TokenContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
const [Profile, setProfile] = useState(null)
   async function getProfile(){
  await axios.get("https://project1-kohl-iota.vercel.app/users/profile" , {headers}).then((data)=>{
    // console.log(data.data.user);
    setProfile(data.data.user)
  }).catch((error)=>{
    console.log(error);
    
  })
 }
 useEffect(() => {
  getProfile()
 }, [])
 



  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    // إغلاق القائمة المنسدلة عند النقر خارجها
    const handleClickOutside = (e) => {
      if (!e.target.closest('.profile-menu')) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  function logout() {
    localStorage.removeItem("userToken");
    setToken(null);
    navigate("/login");
  }

  return (
<nav className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-md shadow-md border-b border-gray-300 dark:border-gray-700">
  <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <NavLink to="/home" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src={logo} className="h-14 rounded-xl w-[100px]" alt="Logo" />
        </NavLink>

        <div className="flex md:order-2 items-center space-x-3 md:space-x-4 rtl:space-x-reverse">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-xl text-gray-700 dark:text-yellow-300 p-2 rounded focus:outline-none"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          {/* Profile Avatar & Dropdown */}
          {token && (
            <div className="relative profile-menu">
              <img
                src={Profile?.image?.secure_url || `https://ui-avatars.com/api/?name=${Profile?.name}&background=0D8ABC&color=fff`}
                alt="profile"
                className="w-10 h-10 rounded-full cursor-pointer border-2 border-indigo-500"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              />
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 shadow-lg rounded-md z-50">
                  <NavLink
                    to="/profile"
                    className="block px-4 py-2 dark:hover:text-orange-400 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Profile
                  </NavLink>
                  <button
                    onClick={logout}
                    className="w-full text-left  px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Desktop Menu */}
          <ul className="hidden md:flex flex-row items-center space-x-4">
            {!token ? (
              <>
                <li>
                  <NavLink
                    to="/Login"
                    className={({ isActive }) =>
                      isActive
                        ? "block bg-orange-800 rounded font-bold py-2 px-3 text-white dark:text-white text-xl font-extrabold"
                        : "block font-bold py-2 hover:text-orange-400 dark:hover:text-orange-400 px-3 text-white dark:text-white"
                    }
                  >
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/Register"
                    className={({ isActive }) =>
                      isActive
                        ? "block bg-orange-800 rounded font-bold py-2 px-3 text-white dark:text-white text-xl font-extrabold"
                        : "block font-bold py-2 hover:text-orange-400 dark:hover:text-orange-400 px-3 text-white dark:text-white"
                    }
                  >
                    Register
                  </NavLink>
                </li>
              </>
            ) : null}
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden focus:outline-none focus:ring-2 dark:text-gray-400"
            aria-controls="navbar-cta"
            aria-expanded={isMenuOpen ? "true" : "false"}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu Links */}
        <div
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
            isMenuOpen ? "block" : "hidden"
          }`}
          id="navbar-cta"
        >
          {token && (
            <ul className="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent">
              <li>
                <NavLink
                  to="/home"
                  className={({ isActive }) =>
                    isActive
                      ? "block bg-orange-800 rounded font-bold py-2 px-3 text-white dark:text-white text-xl font-extrabold"
                      : "block font-bold py-2 text-orange-400 hover:text-orange-400 dark:hover:text-orange-400 px-3 text-gray-900 text-lg dark:text-orange-400	"
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/products"
                  className={({ isActive }) =>
                    isActive
                      ? "block bg-orange-800 rounded font-bold py-2 px-3 text-white dark:text-white text-xl font-extrabold"
                      : "block font-bold py-2 text-orange-400 hover:text-orange-400 dark:hover:text-orange-400 px-3 text-gray-900 text-lg dark:text-orange-400"
                  }
                >
                  Products
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/categories"
                  className={({ isActive }) =>
                    isActive
                      ? "block bg-orange-800 rounded font-bold py-2 px-3 text-white dark:text-white text-xl font-extrabold"
                      : "block font-bold py-2 text-orange-400 hover:text-orange-400 dark:hover:text-orange-400 px-3 text-gray-900 text-lg dark:text-orange-400"
                  }
                >
                  Categories
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/brands"
                  className={({ isActive }) =>
                    isActive
                      ? "block bg-orange-800 rounded font-bold py-2 px-3 text-white dark:text-white text-xl font-extrabold"
                      : "block font-bold py-2 text-orange-400 hover:text-orange-400 dark:hover:text-orange-400 px-3 text-gray-900 text-lg dark:text-orange-400"
                  }
                >
                  Brands
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    isActive
                      ? "block bg-orange-800 rounded font-bold py-2 px-3 text-white dark:text-white text-xl font-extrabold"
                      : "block font-bold py-2 text-orange-400 hover:text-orange-400 dark:hover:text-orange-400 px-3 text-gray-900 text-lg dark:text-orange-400"
                  }
                >
                 <div className=" text-3xl"> <FaCartArrowDown /></div>
                </NavLink>
              </li>
                            <li>
                <NavLink
                  to="/wishlist"
                  className={({ isActive }) =>
                    isActive
                      ? "block bg-orange-800 rounded font-bold py-2 px-3 text-white dark:text-white text-xl font-extrabold"
                      : "block font-bold py-2 text-orange-400 hover:text-orange-400 dark:hover:text-orange-400 px-3 text-gray-900 text-lg dark:text-orange-400"
                  }
                >
                 <div className=" text-3xl"> <AiFillHeart /></div>
                </NavLink>
              </li>
              {role === "admin" && (
                <li>
                  <NavLink
                    to="/layoutAdmin"
                    className={({ isActive }) =>
                      isActive
                        ? "block bg-orange-800 rounded font-bold py-2 px-3 text-white dark:text-white text-xl font-extrabold"
                      : "block font-bold py-2 text-orange-400 hover:text-orange-400 dark:hover:text-orange-400 px-3 text-gray-900 text-lg dark:text-orange-400"
                    }
                  >
                    Admin
                  </NavLink>
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
