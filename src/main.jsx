import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./../node_modules/@fortawesome/fontawesome-free/css/all.min.css"
import './index.css'
import App from './App.jsx'
import TokenContextProvider, { TokenContext } from './Context/TokenContext.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CartContextProvider from './Context/CartContext.jsx'
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
<QueryClientProvider client={queryClient}>
<ReactQueryDevtools initialIsOpen={false} />
<TokenContextProvider>
  <CartContextProvider>
  <StrictMode>
    <App/>
  
  </StrictMode>
  </CartContextProvider>
  </TokenContextProvider>
  </QueryClientProvider>
)
