import axios from "axios";
import { createContext, useState } from "react";
import toast from "react-hot-toast";

export let CartContext = createContext()

export default function CartContextProvider(props) {
const [CartItem, setCartItem] = useState({ products: [] });
const [cartN, setcartN] = useState(0)

  const [totalPrice, settotalPrice] = useState(0)
   
    const [cartId, setCartId] = useState(null)
    
    let headers = {
      Authorization: "Bearer "+localStorage.getItem("userToken")
    };

  

    async function addProduct(productId, quantity) {
      return await axios.post(
        "https://project1-kohl-iota.vercel.app/cart/create",
        { productId, quantity },
        { headers }
      )
      .then((response) => {
        // console.log(response.data.subTotal);

        settotalPrice(response.data.cart.subTotal)
        // console.log(response.data.cart.subTotal);
        toast.success("Added to cart successfully");
        return response;
      })
      .catch((error) => {
        const message = error?.response?.data?.message || " An error occurred while adding to the cart   ";
        toast.error(message);
        return error;
      });
    }
    

    async function getProductToCart() {
      try {
        const response = await axios.get("https://project1-kohl-iota.vercel.app/cart", { headers });
         settotalPrice(response.data.cart.subTotal)
        // console.log(response.data.cart.products.length);
        setCartItem(response.data.cart)
        setcartN(response.data.cart.length)
        return response;
      
        

      } catch (error) {
        return error;
      }
    }
    

    async function deleteProduct(productId) {
      try {
          const response = await axios.delete(
              'https://project1-kohl-iota.vercel.app/cart/remove', 
              {
                  data: { productId },  
                  headers
              }
          );
          settotalPrice(response.data.cart.subTotal)

           
          // console.log(response);
          return response; 
      } catch (error) {
          console.error('Error deleting product:', error.response ? error.response.data : error);
          return error; 
      }
  }
  
  
      
   
    async function updateCart(productId,quantity) {
        try {
          const response = await axios.patch(
            `https://project1-kohl-iota.vercel.app/cart/update`,
            { productId,quantity },
            { headers }
          );
          settotalPrice(response.data.cart.subTotal)


          // settotalPrice(response.data.data.totalCartPrice)
          // setCartId(response.data.data._id)
           
          return response;
        } catch (error) {
        //   console.log('Update cart error:', error);
          return error.response; 
        }
      }
      async function clearCart(){
        await axios.delete("https://project1-kohl-iota.vercel.app/cart/clear" , {headers}).then((data)=>{
            // console.log(data);
            settotalPrice(0)

            return response
            
        }).catch((error)=>{
            // console.log(error);
            return error
            
        })
      }

  
    return <CartContext.Provider value={{ addProduct,cartN, totalPrice, CartItem  , deleteProduct ,updateCart,clearCart, getProductToCart  }}>
        {props.children}
    </CartContext.Provider>

}