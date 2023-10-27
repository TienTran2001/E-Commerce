import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { MdOutlineNavigateNext, MdNavigateBefore } from 'react-icons/md';

import { apiGetProducts } from '../apis';
const nav = [
  { id: 1, name: 'best seller' },
  { id: 2, name: 'new arrivals' },
];

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  nextArrow: <MdOutlineNavigateNext />,
  prevArrow: <MdNavigateBefore />,
};

const BestSeller = () => {
  const [checkActive, setCheckActive] = useState(1);
  const [bestSeller, setBestSeller] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  console.log({ bestSeller, newProducts });
  const fetchApiProducts = async () => {
    const response = await Promise.all([
      apiGetProducts({ sort: '-sold' }),
      apiGetProducts({ sort: '-createdAt' }),
    ]);

    if (response[0].success === true) setBestSeller(response[0].products);
    if (response[1].success === true) setNewProducts(response[1].products);
  };

  useEffect(() => {
    fetchApiProducts();
  }, []);

  return (
    <div className="mb-[100px]">
      <div className="flex gap-x-[40px] py-[15px] border-b-2 border-b-main ">
        {nav.map((el) => (
          <span
            key={el.id}
            className={`uppercase text-xl  font-semibold cursor-pointer ${
              checkActive === el.id ? 'text-text' : 'text-[#9B9B9B]'
            }`}
            onClick={() => setCheckActive(el.id)}
          >
            {el.name}
          </span>
        ))}
      </div>
      <Slider {...settings} className="relative w-full">
        <div>
          <h3>1</h3>
        </div>
        <div>
          <h3>2</h3>
        </div>
        <div>
          <h3>3</h3>
        </div>
        <div>
          <h3>4</h3>
        </div>
        <div>
          <h3>5</h3>
        </div>
        <div>
          <h3>6</h3>
        </div>
        <div>
          <h3>7</h3>
        </div>
      </Slider>
    </div>
  );
};

export default BestSeller;
