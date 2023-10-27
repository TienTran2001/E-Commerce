import React from 'react';
import { Sidebar, Banner } from '../../components';

import BestSeller from '../../components/BestSeller';

const Home = () => {
  return (
    <section className="w-full flex">
      <div className="flex flex-col gap-5 w-[25%] flex-auto ">
        <Sidebar />
        <span>Deal daily</span>
      </div>
      <div className="flex flex-col gap-8 pl-5 w-[75%] flex-auto ">
        <Banner />
        <BestSeller />
      </div>
    </section>
  );
};

export default Home;
