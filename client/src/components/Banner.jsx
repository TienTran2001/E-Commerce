import React from 'react';
import banner1 from '../assets/slide.avif';

const Banner = () => {
  return (
    <div>
      <img src={banner1} alt="" className="w-full h-[480px] object-cover" />
    </div>
  );
};

export default Banner;
