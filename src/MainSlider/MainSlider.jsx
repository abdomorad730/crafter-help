import React, { useContext, useEffect, useState } from 'react'
import slider1 from "./../assets/images/hand13.webp"
import slider2 from "./../assets/images/hand6.jpg"

import slider5 from "./../assets/images/s1.jpeg"

import slider9 from "./../assets/images/s2.jpeg"




import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import axios from 'axios'
import { TokenContext } from '../Context/TokenContext'
import Loader from '../components/Loder/Loder'

export default function MainSlider() {
  const [Loder, setLoder] = useState(true)
  const [categories, setCategories] = useState([]);
 let {headers}= useContext(TokenContext)


  async function getCat() {
   
    try {
      const response = await axios.get("https://project1-kohl-iota.vercel.app/category", { headers });
      setCategories(response.data.categories);
      // console.log(response.data.categories);
      setLoder(false)
      
      
    } catch (error) {
      console.error("Error fetching catg:", error);
      setLoder(false)
      
    }
  }
  useEffect(() => {
getCat()
  }, [])
  

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 1500,
    pauseOnHover: true,
  }

  return (
 <>

{Loder ? (
  <Loader />
) : (
  <div className="container transition-colors duration-500 bg-white/0 dark:bg-gray-900/0 mx-auto px-4 py-6">
    <div className="flex pl-5 pl-5 flex-col md:flex-row gap-4">
      {/* Main Slider */}
      <div className="w-full md:w-2/4 overflow-hidden rounded-xl shadow-md">
        <Slider {...settings}>
          {categories.map((cat) => (
            <div key={cat.id} className="relative h-[400px] w-full">
              <img
                src={cat.image.secure_url}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover rounded-xl"
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Side sliders */}
      <div className="hidden md:flex flex-col w-1/4 gap-4">
        {[slider2, slider1].map((img, idx) => (
          <div key={idx} className="relative overflow-hidden rounded-xl shadow-md h-[195px] w-full">
            <img
              src={img}
              alt={`side-img-${idx}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      <div className="hidden md:flex flex-col w-1/4 gap-4">
        {[slider9, slider5].map((img, idx) => (
          <div key={idx} className="relative overflow-hidden rounded-xl shadow-md h-[195px] w-full">
            <img
              src={img}
              alt={`side-img-${idx}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  </div>
)}

 
 </>
  )
}
