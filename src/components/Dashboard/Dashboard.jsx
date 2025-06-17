import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { TokenContext } from '../../Context/TokenContext';
import Loader from '../Loder/Loder';

export default function Dashboard() {
 let {headers}= useContext(TokenContext)
  const [users, setUsers] = useState([]);
  const [categoryDs, setCategoryDs] = useState([]);
  const [brandsDs, setBrandsDs] = useState([]);
  const [userDs, setUserDs] = useState([]);
  const [categoryNum, setCategoryNum] = useState(0);
  const [userNum, setUserNum] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [orders, setorders] = useState([])
  const [orderNum, setorderNum] = useState(null)
const [category, setcategory] = useState([])
const [Brandnam, setBrandnam] = useState(0)
const [ProductNam, setProductNam] = useState(0)
// const [loder, setloder] = useState(true)


  async function getCategory() {
    try {
      setIsLoading(false);
      const { data } = await axios.get('https://project1-kohl-iota.vercel.app/category', {
        headers
      });
      setCategoryDs(data.categories);
      setCategoryNum(data.categories.length);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function getDashBoard() {
    try {
           setIsLoading(false);

      const { data } = await axios.get('https://project1-kohl-iota.vercel.app/users/dashboard', {
        headers
      });
      console.log(data);
      
      setUserDs(data.data[1].value);
      setUserNum(data.data[1].value.length);
    } catch (error) {
      console.log(error);
    } finally {
           setIsLoading(false);

    }
  }

  async function getBrands() {
    try {
            setIsLoading(false);

      const { data } = await axios.get('https://project1-kohl-iota.vercel.app/brand', {
        headers
      });
      setBrandnam(data.brands.length)
      setBrandsDs(data.brands);
    } catch (error) {
      console.log(error);
    } finally {
            setIsLoading(false);

    }
  }

  async function Product(){
    await axios.get("https://project1-kohl-iota.vercel.app/product").then((data)=>{
      // console.log(data);
      setProductNam(data.data.products.length);
      
    }).catch((error)=>{
      console.log(error);
      
    })
  }
 

  useEffect(() => {
    Product()
    getCategory();
    getBrands();
    getDashBoard();
    getAllOrder()
    getCat()
  }, []);

  const toggleBlockStatus = async(id) => {
    await axios.patch(`https://project1-kohl-iota.vercel.app/users/block/${id}` , {headers})
        getDashBoard();

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, isDeleted: !user.isDeleted } : user
      )
    );
  };

  async function getAllOrder(){
    await axios.get("https://project1-kohl-iota.vercel.app/order" , {headers}).then((data)=>{
      setorderNum(data.data.orders.length);
      // console.log(data);
           setIsLoading(false);
      setorders(data.data.orders)
    }).catch((error)=>{
      console.log(error);
           setIsLoading(false);
      
    })
  }
 

    async function getCat() {
     
      try {
        const response = await axios.get("https://project1-kohl-iota.vercel.app/category", { headers });
        setcategory(response.data.categories);
        // console.log(response.data.categories);
        // setIsloding(false)
        
      } catch (error) {
        console.error("Error fetching catg:", error);
        //  setIsloding(false)
      }
    }

      async function deleteCategory(id) {
        try {
          await axios.delete(`https://project1-kohl-iota.vercel.app/category/delete/${id}`, { headers });
          setcategory(prev => prev.filter(item => item._id !== id));
        } catch (error) {
          console.error("Error deleting category:", error);
        }
      }
  
       async function deleteBrand(id) {
          try {
            await axios.delete(`https://project1-kohl-iota.vercel.app/brand/delete/${id}`, { headers });
            setBrandsDs((prev) => prev.filter((item) => item._id !== id));
          } catch (error) {
            console.error('Error deleting brand:', error);
          }
        }
      

  return (
  <>
  
{isLoading? <Loader/>:  <div className="p-4 sm:p-6 space-y-8   text-gray-800 dark:text-gray-200 min-h-screen">
  <h1 className="rounded-2xl  border-2 hover:scale-95 transition-all duration-150  border-amber-500 text-amber-500 font-extrabold text-3xl  shadow-lg bg-stone-100 dark:bg-gray-800 p-4 text-center">
    Admin Dashboard
  </h1>

  {/* Stats */}
  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
    <div className="rounded-2xl border-2  border-amber-500 hover:scale-105 transition-all duration-150 shadow-lg bg-stone-100 dark:bg-gray-800 p-4 text-center">
      <p className="text-4xl text-amber-800 dark:text-amber-500 font-bold">{ProductNam}</p>
      <p className="dark:text-white">Products</p>
    </div>
    <div className="rounded-2xl border-2  border-amber-500 hover:scale-105 transition-all shadow-lg bg-stone-100 dark:bg-gray-800 p-4 text-center">
      <p className="text-4xl text-amber-800 dark:text-amber-500 font-bold">{categoryNum}</p>
      <p className="dark:text-white">Categories</p>
    </div>
      <div className="rounded-2xl border-2  border-amber-500 hover:scale-105 transition-all shadow-lg bg-stone-100 dark:bg-gray-800 p-4 text-center">
      <p className="text-4xl text-amber-800 dark:text-amber-500 font-bold">{Brandnam}</p>
      <p className="dark:text-white">Brands</p>
    </div>
    <div className="rounded-2xl border-2  border-amber-500 hover:scale-105 transition-all shadow-lg bg-stone-100 dark:bg-gray-800 p-4 text-center">
      <p className="text-4xl text-amber-800 dark:text-amber-500 font-bold">{orderNum}</p>
      <p className="dark:text-white">Orders</p>
    </div>
    <div className="rounded-2xl border-2  border-amber-500 hover:scale-105 transition-all shadow-lg bg-stone-100 dark:bg-gray-800 p-4 text-center">
      <p className="text-4xl text-amber-800 dark:text-amber-500 font-bold">{userNum}</p>
      <p className="dark:text-white">Users</p>
    </div>
  </div>

  {/* Recent Orders & Manage Categories */}
<div className="bg-stone-100 dark:bg-gray-800 rounded-2xl overflow-auto">
  <h2 className="text-lg bg-amber-600 dark:bg-amber-700 text-white p-4 rounded-t-2xl font-semibold mb-4">
    Recent Orders
  </h2>

  <div className="w-full overflow-x-auto">
    <div className="max-h-[300px] overflow-y-auto">
      <table className="min-w-[700px] w-full text-xs sm:text-sm">
        <thead className="sticky top-0 z-10 bg-amber-100 dark:bg-gray-900 border-b border-amber-300 text-center">
          <tr>
            <th className="font-bold text-orange-700 dark:text-amber-400 py-2 px-2 whitespace-nowrap">User Name</th>
            <th className="font-bold text-orange-700 dark:text-amber-400 py-2 px-2 whitespace-nowrap">Date</th>
            <th className="font-bold text-orange-700 dark:text-amber-400 py-2 px-2 whitespace-nowrap">Total Price</th>
            <th className="font-bold text-orange-700 dark:text-amber-400 py-2 px-2 whitespace-nowrap">payment Method</th>
            <th className="font-bold text-orange-700 dark:text-amber-400 py-2 px-2 whitespace-nowrap">Phone</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order?._id} className="border-b border-amber-100 dark:border-gray-700 hover:bg-amber-50 dark:hover:bg-gray-700 transition">
             <td className="py-2 px-2 text-center text-gray-800 dark:text-gray-300 whitespace-nowrap">
  {order?.userId 
    ? typeof order.userId === 'object' 
      ? (typeof order.userId.name === 'string' 
          ? order.userId.name 
          : JSON.stringify(order.userId.name) || 'N/A')
      : order.userId
    : 'N/A'}
</td>

              <td className="py-2 px-2 text-center text-gray-800 dark:text-gray-300 whitespace-nowrap">
                {new Date(order?.createdAt).toLocaleString()}
              </td>
              <td className="py-2 px-2 text-center text-main font-semibold whitespace-nowrap">
                {order?.TotalPrice || order?.finalPrice} $
              </td>
                <td className="py-2 px-2 text-center text-red-600 font-semibold whitespace-nowrap">
                {order?.paymentMethod} 
              </td>
              <td className="py-2 px-2 text-center text-gray-800 dark:text-gray-300 whitespace-nowrap">
                {order?.phone || order?.phoneNumber}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>







  {/* Manage Brands + cat */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Manage Brands */}
  <div className="bg-stone-100 dark:bg-gray-800 rounded-2xl p-4 flex flex-col justify-between min-h-[300px]">
    <div>
      <h2 className="text-lg bg-amber-600 uppercase dark:bg-amber-700 text-white p-4 rounded-t-2xl font-semibold mb-4">Manage Brands</h2>
      <ul className="space-y-2">
        {brandsDs.map((brand) => (
          <li
            key={brand._id}
            className="bg-[#efebd9] dark:bg-gray-700 dark:text-amber-500 text-lg font-bold flex items-center justify-between rounded-xl px-3 py-2"
          >
            <span>{brand.name}</span>
           <button onClick={()=>deleteBrand(brand._id)}>
            <FaTrash className="text-red-600 cursor-pointer text-xl" />

           </button>
          </li>
        ))}
      </ul>
    </div>
    <button
      onClick={() => navigate("/layoutAdmin/createBrand")}
      className="mt-4 bg-yellow-800 dark:bg-amber-700 font-bold text-white w-full rounded-lg px-3 py-2 text-center"
    >
      + Add Brand
    </button>
  </div>

  {/* Manage Categories */}
  <div className="bg-stone-100 dark:bg-gray-800 rounded-2xl p-4 flex flex-col justify-between min-h-[300px]">
    <div>
      <h2 className="text-lg bg-amber-600 dark:bg-amber-700 text-white p-4 rounded-t-2xl font-semibold mb-4">Manage Categories</h2>
      <ul className="space-y-2">
        {category.map((cat) => (
          <li
            key={cat._id}
            className="bg-[#efebd9] dark:bg-gray-700 dark:text-amber-500 text-lg font-bold flex items-center justify-between rounded-xl px-3 py-2"
          >
            <span className=' uppercase'>{cat.name}</span>

             <button onClick={()=>deleteCategory(cat._id)}>
                          <FaTrash className="text-red-600 cursor-pointer text-xl" />

             </button>

          </li>
        ))}
      </ul>
    </div>
    <button
      onClick={() => navigate("/layoutAdmin/createcategory")}
      className="mt-4 bg-yellow-800 dark:bg-amber-700 font-bold text-white w-full rounded-lg px-3 py-2 text-center"
    >
      + Add Category
    </button>
  </div>
</div>


  
  

  {/* Users Table */}
<div className="bg-[#efebd9] dark:bg-gray-700 dark:text-white rounded-2xl p-4 overflow-x-auto">
  <h2 className="text-lg bg-amber-600 dark:bg-amber-700 text-white p-4 rounded-t-2xl font-semibold mb-4">Users</h2>
  <table className="min-w-full text-sm border-separate border-spacing-y-3">
    <thead>
      <tr className="text-left text-amber-700 text-lg dark:text-amber-600">
        <th className="px-4 py-2">ID</th>
        <th className="px-4 py-2">Name</th>
        <th className="px-4 py-2">Email</th>
        <th className="px-4 py-2">Role</th>
        <th className="px-4 py-2">Status</th>
        <th className="px-4 py-2">Action</th>
      </tr>
    </thead>
    <tbody>
      {userDs.map((user) => (
        <tr
          key={user.id}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm"
        >
          <td className="px-4 py-3 font-medium text-gray-800 dark:text-white rounded-l-xl">
            #{user.id}
          </td>
          <td className="px-4 py-3 text-amber-600 font-extrabold uppercase  ">{user.name}</td>
          <td className="px-4 py-3 text-gray-800 dark:text-white">{user.email}</td>
          <td className="px-4 py-3 capitalize text-main dark:text-main">{user.role}</td>
          <td className="px-4 py-3">
            <span
              className={user.isDeleted ? 'text-red-500' : 'text-green-500'}
            >
              {user.isDeleted ? 'Blocked' : 'Active'}
            </span>
          </td>
          <td className="px-4 py-3 rounded-r-xl">
            <button
              onClick={() => toggleBlockStatus(user._id)}
              className={`px-4 py-1.5 rounded text-white font-medium transition ${
                user.isDeleted ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {user.isDeleted ? 'Unblock' : 'Block'}
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>




</div>}
  </>
  );
}
