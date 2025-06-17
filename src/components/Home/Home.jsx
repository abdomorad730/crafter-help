import React from 'react';
import FeatureProducts from '../FeatureProducts/FeatureProducts';
import MainSlider from '../../MainSlider/MainSlider';
import CategorySlider from '../CategorySlider/CategorySlider';
import bg from '../../assets/images/hero1.jpg';

export default function Home() {
  return (
    <div
       className="min-h-screen bg-cover bg-center "
        style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover', // خلي الصورة تغطي الـ div بالكامل
        backgroundPosition: 'center', // خلي الصورة في منتصف الـ div
        backgroundRepeat: 'no-repeat', // تأكد إن الصورة مش هتتكرر
      }}
    >
      <MainSlider />
      <CategorySlider />
      <FeatureProducts />
    </div>
  );
}
