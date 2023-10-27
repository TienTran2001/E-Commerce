import React from 'react';

import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createSlug } from '../ultils/helper';

import icons from '../ultils/icons';

const Sidebar = () => {
  const { categories } = useSelector((state) => state.categories);

  return (
    <div className="border">
      <div className="text-white text-base font-medium px-4 py-[10px] uppercase bg-main flex items-center gap-x-4 ">
        <icons.bars />
        <span>All collection</span>
      </div>
      <div className="flex flex-col">
        {categories.map((el) => (
          <NavLink
            key={createSlug(el.title)}
            to={createSlug(el.title)}
            className={({ isActive }) =>
              isActive
                ? 'px-5 py-4 text-sm text-white bg-main'
                : 'px-5 py-4 text-sm hover:text-main transition-all '
            }
          >
            {el.title}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
