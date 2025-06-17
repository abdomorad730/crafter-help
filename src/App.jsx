
import { createBrowserRouter, createHashRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Home from './components/Home/Home'
import Brands from './components/Brands/Brands'
import Categories from './components/Categories/Categories'
import Cart from './components/Cart/Cart'
import Login from './components/Login/Login'
import Logout from './components/Logout/Logout'
import Register from './components/Register/Register'
import NotFound from './components/NotFound/NotFound'
import Layout from './components/Layout/Layout'
import Products from './components/Products/Products'
import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes'
import ProtectedAuth from './components/ProtectedAuth/ProtectedAuth'
import ProductDetails from './components/ProductDetails/ProductDetails'
import { Toaster } from 'react-hot-toast'
import CheckOut from './components/CheckOut/CheckOut'
import ConfirmEmail from './components/ConfirmEmail/ConfirmEmail'
import AddProduct from './components/AddProduct/AddProduct'
import LayoutAdmin from './components/LayoutAdmin/LayoutAdmin'
import SubCategory from './components/SubCategory/SubCategory'
import CreateCategory from './components/CreateCategory/CreateCategory'
import CreateSubCategory from './components/CreateSubCategory/CreateSubCategory'
import Dashboard from './components/Dashboard/Dashboard'
import CreateBrand from './components/CreateBrand/CreateBrand'
import ProtectedAdmin from './components/ConfirmEmail/ProtectedAdmin/ProtectedAdmin'
import Profile from './components/Profile/Profile'
import ForgetPasword from './components/ForgetPasword/ForgetPasword'
import ResetPassword from './components/ResetPassword/ResetPassword'
import ChangePassword from './components/ChangePassword/ChangePassword'
import UpdateProduct from './components/UpdateProduct/UpdateProduct'
import AllOrder from './components/AllOrder/AllOrder'
import WishList from './components/WishList/WishList'
import ProductAdmain from './components/ProductAdmain/ProductAdmain'
import Coupon from './components/Coupon/Coupon'
import BrandDetails from './components/BrandDetails/brandDetails'
import SubDetails from './components/SubDetails/subDetails'



function App() {
  const routes = createHashRouter([
    {
      path: "",
      element: <Layout />,
      children: [
        { index: true, element: <ProtectedRoutes><Home /></ProtectedRoutes> },
        { path: "Home", element: <ProtectedRoutes><Home /></ProtectedRoutes> },
        { path: "Brands", element: <ProtectedRoutes><Brands /></ProtectedRoutes> },
        { path: "Products", element: <ProtectedRoutes><Products /></ProtectedRoutes> },
        { path: "updateproduct/:id", element: <ProtectedRoutes><UpdateProduct /></ProtectedRoutes> },



        { path: "profile", element: <ProtectedRoutes><Profile /></ProtectedRoutes> },

        { path: "subCategory/:id", element: <ProtectedRoutes><SubCategory /></ProtectedRoutes> },
        { path: "allorder", element: <ProtectedRoutes><AllOrder /></ProtectedRoutes> },
        { path: "checkout/:id", element: <ProtectedRoutes><CheckOut /></ProtectedRoutes> },
        { path: "Categories", element: <ProtectedRoutes><Categories /></ProtectedRoutes> },
        { path: "Cart", element: <ProtectedRoutes><Cart /></ProtectedRoutes> },
        { path: "addProduct", element: <ProtectedRoutes><AddProduct /></ProtectedRoutes> },
        { path: "wishlist", element: <ProtectedRoutes><WishList /></ProtectedRoutes> },

        { path: "ChangePassword", element: <ProtectedRoutes><ChangePassword /></ProtectedRoutes> },

        { path: "productDetails/:id", element: <ProtectedRoutes><ProductDetails /></ProtectedRoutes> },
        { path: "Login", element: <ProtectedAuth><Login /></ProtectedAuth> },
        { path: "ForgetPasword", element: <ProtectedAuth><ForgetPasword /></ProtectedAuth> },
        { path: "resetPassword", element: <ProtectedAuth><ResetPassword /></ProtectedAuth> },
        { path: "brand/:id", element: <ProtectedRoutes><BrandDetails/></ProtectedRoutes> },
        { path: "subCategory/SpecificSubCategory/:id", element: <ProtectedRoutes><SubDetails/></ProtectedRoutes> },




        { path: "confirmemail", element: <ProtectedAuth><ConfirmEmail /></ProtectedAuth> },
        { path: "Register", element: <ProtectedAuth><Register /></ProtectedAuth> },

        {
          path: "/LayoutAdmin", element: <ProtectedAdmin><LayoutAdmin /></ProtectedAdmin>, children: [
            { index: true, element: <ProtectedAdmin><Dashboard /></ProtectedAdmin> },
            { path: "CreateCategory", element: <ProtectedAdmin><CreateCategory /></ProtectedAdmin> },
            { path: "CreateSubCategory", element: <ProtectedAdmin><CreateSubCategory /></ProtectedAdmin> },
            { path: "CreateBrand", element: <ProtectedAdmin><CreateBrand /></ProtectedAdmin> },
            { path: "CreateCoupon", element: <ProtectedAdmin><Coupon /></ProtectedAdmin> },
            { path: "productadmain", element: <ProtectedAdmin><ProductAdmain /></ProtectedAdmin> },


          ]
        },

        { path: "*", element: <NotFound /> }
      ]
    }
  ]);

  return (
    <>
      <RouterProvider router={routes} />
      <Toaster position="bottom-center" reverseOrder={false} />
    </>
  );
}


export default App
