import React from 'react';
import navigation from '../ultils/navigation';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="w-main px-5 mb-5">
      <div className="w-full flex justify-between items-center border-t border-b py-2 h-12">
        <div className="flex items-center  gap-x-[30px]">
          {navigation.map((el) => (
            <NavLink
              key={el.id}
              to={el.path}
              className={({ isActive }) =>
                isActive
                  ? 'text-main text-sm font-medium'
                  : 'text-sm font-medium hover:text-main transition-all'
              }
            >
              {el.value}
            </NavLink>
          ))}
        </div>
        <div>
          <input
            type="text"
            className="w-[250px] max-w-[250px] px-[10px] py-2 border-none outline-none text-sm "
            placeholder="Search something"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
