import React from 'react';
import logo from '../assets/logo.png';
import icons from '../ultils/icons';
import { Link } from 'react-router-dom';
import path from '../ultils/path';

const Header = () => {
  return (
    <header className="w-main px-5 h-[110px] flex justify-between items-center py-[35px] ">
      <Link to={path.HOME}>
        <img src={logo} className="w-[234px] object-cover " alt="logo" />
      </Link>
      <div className="flex justify-between items-center ">
        {/* header right item - phone */}
        <div className="header-right-item ">
          <div className="flex items-center gap-x-[10px] text-[13px]">
            <icons.phone className="text-main w-[10px]" />
            <span className="font-semibold">(+1800) 000 8808</span>
          </div>
          <p className="text-xs">Mon-Sat 9:00AM - 8:00PM</p>
        </div>
        {/* header right item - mail */}
        <div className="header-right-item ">
          <div className=" flex items-center gap-x-[10px] text-[13px]">
            <icons.mail className="text-main w-[14px]" />
            <span className="font-semibold">tienco201@gmail.com</span>
          </div>
          <p className="text-xs">Online Support 24/7</p>
        </div>
        {/* header right item - user */}
        <div className="header-right-item ">
          <icons.user className="text-main text-xl cursor-pointer" />
        </div>
        {/* header right item - bag */}
        <div className="header-right-item text-sm relative pr-0">
          <icons.bag className="text-main text-xl cursor-pointer" />
          <div className="absolute w-5 h-5 rounded-full bg-main top-0 -right-3 text-white flex items-center justify-center">
            0
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
