import React, { useContext, useEffect, useState } from 'react';


import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axios from 'axios';
import { TokenContext } from '../../Context/TokenContext';
import Loader from '../Loder/Loder';

export default function Categories() {
  const [Loder, setLoder] = useState(true)
let {headers}= useContext(TokenContext)
  const [images, setimages] = useState([])
   

  async function getBrand() {
      try {
        const response = await axios.get("https://project1-kohl-iota.vercel.app/brand", { headers });
        // console.log(response.data.brands);
        setimages(response.data.brands);
        setLoder(false)
       
      } catch (error) {
        console.error("Error fetching brand:", error);
        setLoder(false)
         
      }
    }
  
    useEffect(() => {
      getBrand();
    }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 1000,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ]
  };

  return (
   <>
{Loder ? (
  <Loader />
) : (
  <div className="py-5 px-4 bg-white/0 transition-colors duration-500">
    <div className="container mx-auto">
      <Slider {...settings}>
        {images.map((img) => (
          <div key={img.id} className="px-2">
            <div className="relative w-full aspect-[3/2] overflow-hidden rounded-2xl shadow-lg group transition-all duration-300 hover:shadow-2xl">
              <img
                src={img.image?.secure_url}
                alt={img.name}
                className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105 opacity-80"
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  </div>
)}

   </>
  );
}
